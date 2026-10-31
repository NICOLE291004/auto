"use server";

import { headers } from "next/headers";
import { randomUUID } from "node:crypto";
import { supabaseServicio } from "@/lib/supabase/admin";
import { FOTO_MAX_BYTES, FOTO_TIPOS, pedidoSchema } from "@/lib/validators";

export type ResultadoPedido =
  | { ok: true; guardado: boolean }
  | { ok: false; error: string };

// Límite simple por IP (en memoria; en serverless es "mejor esfuerzo").
const intentos = new Map<string, number[]>();
const VENTANA_MS = 10 * 60 * 1000;
const MAX_INTENTOS = 5;

function demasiadosIntentos(ip: string) {
  const ahora = Date.now();
  const recientes = (intentos.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  recientes.push(ahora);
  intentos.set(ip, recientes);
  return recientes.length > MAX_INTENTOS;
}

export async function crearPedido(formData: FormData): Promise<ResultadoPedido> {
  // Honeypot: los bots llenan este campo, las personas no lo ven.
  if (formData.get("sitio_web")) return { ok: true, guardado: false };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconocida";
  if (demasiadosIntentos(ip)) {
    return { ok: false, error: "Enviaste varios pedidos seguidos. Intenta de nuevo en unos minutos." };
  }

  const parsed = pedidoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: "Revisa los datos: hay un campo vacío o con formato incorrecto." };
  }
  const p = parsed.data;

  const db = supabaseServicio();
  if (!db) {
    // Sin Supabase configurado el cliente aún puede seguir por WhatsApp.
    console.warn("crearPedido: Supabase no está configurado; el pedido no se guardó.");
    return { ok: true, guardado: false };
  }

  try {
    let foto_path: string | null = null;
    const foto = formData.get("foto");
    if (foto instanceof File && foto.size > 0) {
      if (foto.size > FOTO_MAX_BYTES || !FOTO_TIPOS.includes(foto.type)) {
        return { ok: false, error: "La foto debe ser JPG, PNG o WebP de máximo 5 MB." };
      }
      const ext = foto.type.split("/")[1];
      const path = `${randomUUID()}.${ext}`;
      const { error } = await db.storage.from("pedidos").upload(path, foto, { contentType: foto.type });
      if (error) throw error;
      foto_path = path;
    }

    const { error } = await db.from("pedidos").insert({
      marca: p.marca,
      modelo: p.modelo,
      anio: p.anio,
      pieza: p.pieza,
      foto_path,
      cliente_nombre: p.nombre,
      cliente_whatsapp: p.whatsapp,
      ubicacion: p.ubicacion,
      origen: "sitio_web",
    });
    if (error) throw error;
    return { ok: true, guardado: true };
  } catch (e) {
    // Si falla el guardado no frenamos al cliente: todavía puede escribirnos por WhatsApp.
    console.error("crearPedido:", e);
    return { ok: true, guardado: false };
  }
}
