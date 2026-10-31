export const DIAS_VIGENCIA = 10;
const DIA_MS = 24 * 60 * 60 * 1000;

/** Fecha en que vence una pieza publicada en `publicada`. */
export function calcularExpiracion(publicada: Date, dias = DIAS_VIGENCIA): Date {
  return new Date(publicada.getTime() + dias * DIA_MS);
}

type ConVigencia = { estado: string; expira_en: string | Date };

/** Una pieza se muestra al público solo si está activa y no ha vencido. Igual que la vista piezas_publicas. */
export function estaVigente(p: ConVigencia, ahora = new Date()): boolean {
  return p.estado === "activa" && new Date(p.expira_en).getTime() > ahora.getTime();
}

/** Días completos que le quedan (redondea hacia arriba); 0 si ya venció. */
export function diasRestantes(expira: string | Date, ahora = new Date()): number {
  const ms = new Date(expira).getTime() - ahora.getTime();
  return ms <= 0 ? 0 : Math.ceil(ms / DIA_MS);
}
