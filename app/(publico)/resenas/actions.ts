"use server";

import { headers } from "next/headers";
import { leerImagen, subirImagenResena } from "@/lib/resenas-fotos";
import { resenaAbiertaSchema } from "@/lib/resenas";
import { supabaseServicio } from "@/lib/supabase/admin";

export type ResultadoResena = { ok: true } | { ok: false; error: string } | null;

// Límite simple por IP (en memoria; en serverless es "mejor esfuerzo"). La aprobación manual es la defensa real.
const intentos = new Map<string, number[]>();
const VENTANA_MS = 30 * 60 * 1000;
const MAX_INTENTOS = 3;

function demasiados(ip: string) {
  const ahora = Date.now();
  const recientes = (intentos.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  recientes.push(ahora);
  intentos.set(ip, recientes);
  return recientes.length > MAX_INTENTOS;
}

/** Reseña escrita directo en la página. Siempre entra como 'pendiente': solo se publica si un admin la aprueba. */
export async function enviarResenaAbierta(_anterior: ResultadoResena, formData: FormData): Promise<ResultadoResena> {
  // Honeypot: los bots llenan este campo, las personas no lo ven.
  if (formData.get("sitio_web")) return { ok: true };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconocida";
  if (demasiados(ip)) return { ok: false, error: "Enviaste varias reseñas seguidas. Intenta de nuevo más tarde." };

  const r = resenaAbiertaSchema.safeParse(Object.fromEntries(formData));
  if (!r.success) {
    return { ok: false, error: "Elige las estrellas, cuéntanos un poco más (mínimo 10 letras) y revisa tu WhatsApp." };
  }

  const foto = leerImagen(formData.get("foto"));
  const avatar = leerImagen(formData.get("avatar"));
  if (foto === "invalida" || avatar === "invalida") {
    return { ok: false, error: "Las fotos deben ser JPG, PNG o WebP de máximo 5 MB." };
  }

  const db = supabaseServicio();
  if (!db) return { ok: false, error: "No pudimos guardar tu reseña. Intenta de nuevo." };

  const urls: { foto_url?: string; avatar_url?: string } = {};
  if (foto) {
    const url = await subirImagenResena(db, foto);
    if (!url) return { ok: false, error: "No pudimos subir la foto. Intenta con otra o sin foto." };
    urls.foto_url = url;
  }
  if (avatar) {
    const url = await subirImagenResena(db, avatar);
    if (!url) return { ok: false, error: "No pudimos subir tu foto de perfil. Intenta con otra o sin foto." };
    urls.avatar_url = url;
  }

  const { error } = await db.from("resenas").insert({
    pedido_id: null,
    pieza: r.data.pieza,
    nombre_sugerido: r.data.nombre,
    nombre_publico: r.data.nombre,
    estrellas: r.data.estrellas,
    comentario: r.data.comentario,
    contacto: r.data.whatsapp,
    fuente: "sitio",
    estado: "pendiente",
    enviada_en: new Date().toISOString(),
    ...urls,
  });
  if (error) {
    console.error("enviarResenaAbierta:", error.message);
    return { ok: false, error: "No pudimos guardar tu reseña. Intenta de nuevo." };
  }
  return { ok: true };
}
