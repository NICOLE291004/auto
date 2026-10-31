import "server-only";
import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { FOTO_MAX_BYTES, FOTO_TIPOS } from "./validators";

/** Lee un archivo opcional del formulario. null si no hay; "invalida" si no es una imagen permitida. */
export function leerImagen(valor: FormDataEntryValue | null): File | null | "invalida" {
  if (!(valor instanceof File) || valor.size === 0) return null;
  if (valor.size > FOTO_MAX_BYTES || !FOTO_TIPOS.includes(valor.type)) return "invalida";
  return valor;
}

/** Sube la imagen al bucket público 'resenas' con nombre aleatorio y devuelve su URL. */
export async function subirImagenResena(db: SupabaseClient, archivo: File): Promise<string | null> {
  const path = `${randomUUID()}.${archivo.type.split("/")[1]}`;
  const { error } = await db.storage.from("resenas").upload(path, archivo, { contentType: archivo.type });
  if (error) {
    console.error("subirImagenResena:", error.message);
    return null;
  }
  return db.storage.from("resenas").getPublicUrl(path).data.publicUrl;
}
