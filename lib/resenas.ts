import { z } from "zod";
import { supabasePublico } from "./supabase/public";

export type ResenaPublica = {
  id: string;
  nombre_publico: string;
  estrellas: number;
  comentario: string;
  pieza: string;
  enviada_en: string;
  foto_url: string | null;
  avatar_url: string | null;
};

/** "Luis Pérez García" -> "Luis P." Nunca muestra el apellido completo. */
export function nombreSugerido(nombreCompleto: string): string {
  const partes = nombreCompleto.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "Cliente";
  const nombre = partes[0].charAt(0).toUpperCase() + partes[0].slice(1).toLowerCase();
  const inicial = partes[1]?.charAt(0);
  return inicial ? `${nombre} ${inicial.toUpperCase()}.` : nombre;
}

/** Texto del vehículo y pieza que se muestra bajo la reseña. */
export function descripcionPieza(p: { pieza: string; marca: string; modelo: string; anio: number | null }) {
  const pieza = p.pieza.charAt(0).toUpperCase() + p.pieza.slice(1);
  return `${pieza} · ${p.marca} ${p.modelo}${p.anio ? ` ${p.anio}` : ""}`;
}

export function urlResena(sitio: string, token: string) {
  return `${sitio.replace(/\/$/, "")}/resena/${token}`;
}

export function mensajeResena(nombre: string, url: string) {
  const primero = nombre.trim().split(/\s+/)[0] ?? "";
  return `Hola ${primero}, gracias por tu compra en Alex Autopartes. ¿Nos regalas una reseña? Toma menos de un minuto: ${url}`;
}

export const resenaSchema = z.object({
  estrellas: z.coerce.number().int().min(1).max(5),
  comentario: z.string().trim().min(10, "Cuéntanos un poco más").max(500),
  nombre: z.string().trim().min(2).max(40),
});

/** Reseña escrita directo en el sitio: pide el WhatsApp (privado) para que el admin pueda confirmar la compra. */
export const resenaAbiertaSchema = resenaSchema.extend({
  whatsapp: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().regex(/^\d{10,15}$/, "WhatsApp inválido")),
  pieza: z
    .string()
    .trim()
    .max(80)
    .transform((v) => (v === "" ? "Compra en Alex Autopartes" : v)),
});

/** Reseñas aprobadas. Si falla o no hay Supabase, devuelve []. */
export async function getResenasPublicas(limite = 6): Promise<ResenaPublica[]> {
  const db = supabasePublico();
  if (!db) return [];
  const { data, error } = await db
    .from("resenas_publicas")
    .select("id, nombre_publico, estrellas, comentario, pieza, enviada_en, foto_url, avatar_url")
    .order("enviada_en", { ascending: false })
    .limit(limite);
  if (error) {
    console.error("getResenasPublicas:", error.message);
    return [];
  }
  return (data ?? []) as ResenaPublica[];
}
