import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { buscarCoincidencias } from "../matching";

export type Pedido = {
  id: string;
  marca: string;
  modelo: string;
  anio: number | null;
  marca_slug: string;
  modelo_slug: string;
  pieza: string;
  foto_path: string | null;
  cliente_nombre: string;
  cliente_whatsapp: string;
  ubicacion: string | null;
  estado: string;
  origen: string;
  precio_venta: number | null;
  costo_yunkero: number | null;
  ganancia: number | null;
  notas: string | null;
  created_at: string;
};

export type Pieza = {
  id: string;
  marca: string;
  modelo: string;
  marca_slug: string;
  modelo_slug: string;
  anio_desde: number;
  anio_hasta: number;
  pieza: string;
  foto_url: string | null;
  precio_yunkero: number | null;
  yunkero_id: string | null;
  estado: string;
  publicada_en: string;
  expira_en: string;
  created_at: string;
  yunkeros: { nombre: string } | null;
};

export type Yunkero = {
  id: string;
  nombre: string;
  whatsapp: string | null;
  especialidad: string | null;
  notas: string | null;
};

/** Pedidos abiertos (nuevo o cotizado) contra piezas vigentes. */
export async function getCoincidencias(db: SupabaseClient) {
  const [{ data: pedidos }, { data: piezas }] = await Promise.all([
    db.from("pedidos").select("*").in("estado", ["nuevo", "cotizado"]).order("created_at", { ascending: false }),
    db
      .from("piezas")
      .select("*, yunkeros(nombre)")
      .eq("estado", "activa")
      .gt("expira_en", new Date().toISOString()),
  ]);
  return buscarCoincidencias((pedidos ?? []) as Pedido[], (piezas ?? []) as Pieza[]);
}
