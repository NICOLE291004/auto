"use server";

import { redirect } from "next/navigation";
import { resenaSchema } from "@/lib/resenas";
import { supabaseServicio } from "@/lib/supabase/admin";

/** El cliente envía su reseña con el enlace único. Solo se acepta una vez y queda pendiente de aprobación. */
export async function enviarResena(token: string, formData: FormData) {
  const r = resenaSchema.safeParse(Object.fromEntries(formData));
  if (!r.success) redirect(`/resena/${token}?error=datos`);

  const db = supabaseServicio();
  if (!db) redirect(`/resena/${token}?error=guardar`);

  // El filtro por estado hace que el enlace solo sirva una vez.
  const { data, error } = await db
    .from("resenas")
    .update({
      estrellas: r.data.estrellas,
      comentario: r.data.comentario,
      nombre_publico: r.data.nombre,
      estado: "pendiente",
      enviada_en: new Date().toISOString(),
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
