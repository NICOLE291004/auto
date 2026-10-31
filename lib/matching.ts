import { slugify } from "./slug";

export type PedidoAbierto = {
  id: string;
  marca_slug: string;
  modelo_slug: string;
  anio: number | null;
  pieza: string;
};

export type PiezaVigente = {
  id: string;
  marca_slug: string;
  modelo_slug: string;
  anio_desde: number;
  anio_hasta: number;
  pieza: string;
};

const PALABRAS_VACIAS = new Set(["de", "del", "la", "el", "los", "las", "para", "con", "y"]);

/** "Faros delanteros" -> ["faro", "delantero"]: minúsculas, sin acentos, sin plurales simples. */
export function palabrasClave(pieza: string): string[] {
  return slugify(pieza)
    .split("-")
    .filter((p) => p && !PALABRAS_VACIAS.has(p))
    .map((p) => (p.length > 3 && p.endsWith("s") ? p.slice(0, -1) : p));
}

/**
 * Mismo tipo de pieza si todas las palabras del texto más corto están en el más largo.
 * "faro" coincide con "faro derecho"; "faro derecho" NO coincide con "faro izquierdo".
 */
export function mismaPieza(a: string, b: string): boolean {
  const pa = palabrasClave(a);
  const pb = palabrasClave(b);
  if (pa.length === 0 || pb.length === 0) return false;
  const [corta, larga] = pa.length <= pb.length ? [pa, pb] : [pb, pa];
  return corta.every((p) => larga.includes(p));
}

/** Marca, modelo, año y tipo de pieza. Si el pedido no trae año, no se descarta por año. */
export function coincide(pedido: PedidoAbierto, pieza: PiezaVigente): boolean {
  if (pedido.marca_slug !== pieza.marca_slug) return false;
  if (pedido.modelo_slug !== pieza.modelo_slug) return false;
  if (pedido.anio !== null && (pedido.anio < pieza.anio_desde || pedido.anio > pieza.anio_hasta)) {
    return false;
  }
  return mismaPieza(pedido.pieza, pieza.pieza);
}

export function buscarCoincidencias<P extends PedidoAbierto, Z extends PiezaVigente>(
  pedidos: P[],
  piezas: Z[],
): { pedido: P; piezas: Z[] }[] {
  return pedidos
    .map((pedido) => ({ pedido, piezas: piezas.filter((z) => coincide(pedido, z)) }))
    .filter((c) => c.piezas.length > 0);
}
