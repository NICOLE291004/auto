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

  // Foto opcional. Solo se sube si el enlace sigue vigente (la reseña no se ha enviado antes).
  let foto_url: string | null = null;
  const foto = formData.get("foto");
  if (foto instanceof File && foto.size > 0) {
    if (foto.size > FOTO_MAX_BYTES || !FOTO_TIPOS.includes(foto.type)) redirect(`/resena/${token}?error=foto`);
    const { data: vigente } = await db.from("resenas").select("id").eq("token", token).eq("estado", "solicitada").maybeSingle();
    if (!vigente) redirect(`/resena/${token}`);
    const path = `${randomUUID()}.${foto.type.split("/")[1]}`;
    const { error: errFoto } = await db.storage.from("resenas").upload(path, foto, { contentType: foto.type });
    if (errFoto) {
      console.error("enviarResena foto:", errFoto.message);
      redirect(`/resena/${token}?error=foto`);
    }
    foto_url = db.storage.from("resenas").getPublicUrl(path).data.publicUrl;
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
      // Solo se escribe si hay foto, para que enviar sin foto no dependa de la migración 0004.
      ...(foto_url ? { foto_url } : {}),
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
