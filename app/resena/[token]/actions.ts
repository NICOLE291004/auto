"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { resenaSchema } from "@/lib/resenas";
import { supabaseServicio } from "@/lib/supabase/admin";
import { FOTO_MAX_BYTES, FOTO_TIPOS } from "@/lib/validators";

/** El cliente envía su reseña con el enlace único. Solo se acepta una vez y queda pendiente de aprobación. */
export async function enviarResena(token: string, formData: FormData) {
  const r = resenaSchema.safeParse(Object.fromEntries(formData));
  if (!r.success) redirect(`/resena/${token}?error=datos`);

  const db = supabaseServicio();
  if (!db) redirect(`/resena/${token}?error=guardar`);

  // Fotos opcionales: de la pieza ("foto") y de perfil ("avatar"). Se validan todas antes de subir nada.
  const archivos = (["foto", "avatar"] as const)
    .map((campo) => ({ campo, archivo: formData.get(campo) }))
    .filter((x): x is { campo: "foto" | "avatar"; archivo: File } => x.archivo instanceof File && x.archivo.size > 0);
  for (const { archivo } of archivos) {
    if (archivo.size > FOTO_MAX_BYTES || !FOTO_TIPOS.includes(archivo.type)) redirect(`/resena/${token}?error=foto`);
  }

  const urls: { foto_url?: string; avatar_url?: string } = {};
  if (archivos.length > 0) {
    // Solo se sube si el enlace sigue vigente (la reseña no se ha enviado antes).
    const { data: vigente } = await db
      .from("resenas")
      .select("id")
      .eq("token", token)
      .eq("estado", "solicitada")
      .maybeSingle();
    if (!vigente) redirect(`/resena/${token}`);
    for (const { campo, archivo } of archivos) {
      const path = `${randomUUID()}.${archivo.type.split("/")[1]}`;
      const { error: errFoto } = await db.storage.from("resenas").upload(path, archivo, { contentType: archivo.type });
      if (errFoto) {
        console.error(`enviarResena ${campo}:`, errFoto.message);
        redirect(`/resena/${token}?error=foto`);
      }
      urls[campo === "foto" ? "foto_url" : "avatar_url"] = db.storage.from("resenas").getPublicUrl(path).data.publicUrl;
    }
  }

  // El filtro por estado hace que el enlace solo sirva una vez.
  const { data, error } = await db
    .from("resenas")
    .update({
      estrellas: r.data.estrellas,
      comentario: r.data.comentario,
      nombre_publico: r.data.nombre,
      estado: "pendiente",
      enviada_en: new Date().toISOString(),
      // Solo se escriben si hay foto, para que enviar sin fotos no dependa de las migraciones 0004 y 0005.
      ...urls,
    })
    .eq("token", token)
    .eq("estado", "solicitada")
    .select("id");

  if (error) {
    console.error("enviarResena:", error.message);
    redirect(`/resena/${token}?error=guardar`);
  }
  if (!data || data.length === 0) redirect(`/resena/${token}`);
  redirect(`/resena/${token}?ok=1`);
}
