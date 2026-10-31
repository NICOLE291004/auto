"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { pedidoEdicionSchema, pedidoNuevoSchema } from "@/lib/admin/schemas";

export async function crearPedidoAdmin(formData: FormData) {
  const { db } = await requireAdmin();
  const r = pedidoNuevoSchema.safeParse(Object.fromEntries(formData));
  if (!r.success) redirect("/admin/pedidos/nuevo?error=datos");
  const p = r.data;

  const { error } = await db.from("pedidos").insert({
    pieza: p.pieza,
    marca: p.marca,
    modelo: p.modelo,
    anio: p.anio,
    cliente_nombre: p.nombre,
    cliente_whatsapp: p.whatsapp,
    ubicacion: p.ubicacion,
    origen: p.origen,
    notas: p.notas,
  });
  if (error) {
    console.error("crearPedidoAdmin:", error.message);
    redirect("/admin/pedidos/nuevo?error=guardar");
  }
  revalidatePath("/admin", "layout");
  redirect("/admin/pedidos?ok=creado");
}

export async function actualizarPedido(id: string, formData: FormData) {
  const { db } = await requireAdmin();
  const r = pedidoEdicionSchema.safeParse(Object.fromEntries(formData));
  if (!r.success) redirect(`/admin/pedidos/${id}?error=datos`);

  const { error } = await db.from("pedidos").update(r.data).eq("id", id);
  if (error) {
    console.error("actualizarPedido:", error.message);
    redirect(`/admin/pedidos/${id}?error=guardar`);
  }
  revalidatePath("/admin", "layout");
  redirect(`/admin/pedidos/${id}?ok=guardado`);
}
