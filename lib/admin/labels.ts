export const ESTADOS_PEDIDO = [
  { value: "nuevo", label: "Nuevo" },
  { value: "cotizado", label: "Cotizado" },
  { value: "vendido", label: "Vendido" },
  { value: "perdido", label: "Perdido" },
] as const;

export const ORIGENES = [
  { value: "anuncio", label: "Anuncio" },
  { value: "marketplace", label: "Marketplace" },
  { value: "google", label: "Google" },
  { value: "taller", label: "Taller" },
  { value: "cliente_antiguo", label: "Cliente antiguo" },
  { value: "sitio_web", label: "Sitio web" },
] as const;

export const etiquetaEstado = (v: string) => ESTADOS_PEDIDO.find((e) => e.value === v)?.label ?? v;
export const etiquetaOrigen = (v: string) => ORIGENES.find((o) => o.value === v)?.label ?? v;

export const colorEstado: Record<string, string> = {
  nuevo: "bg-azul text-white",
  cotizado: "bg-senal text-ink",
  vendido: "bg-emerald-600 text-white",
  perdido: "bg-linea text-muted",
};

export const dinero = (n: number | null | undefined) =>
  n === null || n === undefined
    ? "—"
    : new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
