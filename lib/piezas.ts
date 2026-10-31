import { supabasePublico } from "./supabase/public";

export type PiezaPublica = {
  id: string;
  marca: string;
  marca_slug: string;
  modelo: string;
  modelo_slug: string;
  anio_desde: number;
  anio_hasta: number;
  pieza: string;
  foto_url: string | null;
  publicada_en: string;
};

const COLUMNAS =
  "id, marca, marca_slug, modelo, modelo_slug, anio_desde, anio_hasta, pieza, foto_url, publicada_en";

/** Piezas vigentes (la vista ya filtra vencidas). Si falla o no hay Supabase, devuelve []. */
export async function getPiezasPublicas(filtro?: {
  marcaSlug?: string;
  modeloSlug?: string;
  limite?: number;
}): Promise<PiezaPublica[]> {
  const db = supabasePublico();
  if (!db) return [];
  let q = db.from("piezas_publicas").select(COLUMNAS).order("publicada_en", { ascending: false });
  if (filtro?.marcaSlug) q = q.eq("marca_slug", filtro.marcaSlug);
  if (filtro?.modeloSlug) q = q.eq("modelo_slug", filtro.modeloSlug);
  if (filtro?.limite) q = q.limit(filtro.limite);
  const { data, error } = await q;
  if (error) {
    console.error("getPiezasPublicas:", error.message);
    return [];
  }
  return (data ?? []) as PiezaPublica[];
}

export function rangoAnios(p: Pick<PiezaPublica, "anio_desde" | "anio_hasta">) {
  return p.anio_desde === p.anio_hasta ? `${p.anio_desde}` : `${p.anio_desde}–${p.anio_hasta}`;
}
