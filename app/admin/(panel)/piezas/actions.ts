"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { piezaSchema } from "@/lib/admin/schemas";
import { calcularExpiracion } from "@/lib/expiry";
import { FOTO_MAX_BYTES, FOTO_TIPOS } from "@/lib/validators";

/** Revalida el panel y el sitio público (catálogo y páginas SEO). */
function refrescar() {
  revalidatePath("/admin", "layout");
  revalidatePath("/piezas", "layout");
  revalidatePath("/");
}

async function subirFoto(db: Awaited<ReturnType<typeof requireAdmin>>["db"], foto: FormDataEntryValue | null) {
  if (!(foto instanceof File) || foto.size === 0) return { url: null as string | null };
  if (foto.size > FOTO_MAX_BYTES || !FOTO_TIPOS.includes(foto.type)) return { error: "foto" as const };
  const path = `${randomUUID()}.${foto.type.split("/")[1]}`;
  const { error } = await db.storage.from("piezas").upload(path, foto, { contentType: foto.type });
  if (error) {
    console.error("subirFoto:", error.message);
    return { error: "foto" as const };
  }
  return { url: db.storage.from("piezas").getPublicUrl(path).data.publicUrl };
}

export async function crearPieza(formData: FormData) {
  const { db } = await requireAdmin();
  const r = piezaSchema.safeParse(Object.fromEntries(formData));
  if (!r.success) redirect("/admin/piezas/nueva?error=datos");

  const foto = await subirFoto(db, formData.get("foto"));
  if ("error" in foto) redirect("/admin/piezas/nueva?error=foto");

  const ahora = new Date();
  const { error } = await db.from("piezas").insert({
    ...r.data,
    foto_url: foto.url,
    publicada_en: ahora.toISOString(),
    expira_en: calcularExpiracion(ahora).toISOString(),
  });
  if (error) {
    console.error("crearPieza:", error.message);
    redirect("/admin/piezas/nueva?error=guardar");
  }
  refrescar();
  redirect("/admin/piezas?ok=creada");
}

export async function actualizarPieza(id: string, formData: FormData) {
  const { db } = await requireAdmin();
  const r = piezaSchema.safeParse(Object.fromEntries(formData));
  if (!r.success) redirect(`/admin/piezas/${id}?error=datos`);

  const foto = await subirFoto(db, formData.get("foto"));
  if ("error" in foto) redirect(`/admin/piezas/${id}?error=foto`);

  const { error } = await db
    .from("piezas")
    .update({ ...r.data, ...(foto.url ? { foto_url: foto.url } : {}) })
    .eq("id", id);
  if (error) {
    console.error("actualizarPieza:", error.message);
    redirect(`/admin/piezas/${id}?error=guardar`);
  }
  refrescar();
  redirect(`/admin/piezas/${id}?ok=guardada`);
}

/** Vuelve a publicar la pieza: activa y con 10 días nuevos desde hoy. */
export async function renovarPieza(id: string) {
  const { db } = await requireAdmin();
  const ahora = new Date();
  const { error } = await db
    .from("piezas")
    .update({
      estado: "activa",
      publicada_en: ahora.toISOString(),
      expira_en: calcularExpiracion(ahora).toISOString(),
    })
    .eq("id", id);
  if (error) redirect(`/admin/piezas/${id}?error=guardar`);
  refrescar();
  redirect(`/admin/piezas/${id}?ok=renovada`);
}

export async function marcarVendida(id: string) {
  const { db } = await requireAdmin();
  const { error } = await db.from("piezas").update({ estado: "vendida" }).eq("id", id);
  if (error) redirect(`/admin/piezas/${id}?error=guardar`);
  refrescar();
  redirect("/admin/piezas?ok=vendida");
}

export async function eliminarPieza(id: string) {
  const { db } = await requireAdmin();
  const { error } = await db.from("piezas").delete().eq("id", id);
  if (error) redirect(`/admin/piezas/${id}?error=guardar`);
  refrescar();
  redirect("/admin/piezas?ok=eliminada");
}
