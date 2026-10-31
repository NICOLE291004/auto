export type PedidoStat = {
  estado: string;
  origen: string;
  ganancia: number | null;
  created_at: string | Date;
};

export type Rango = "semana" | "mes" | "todo";
const DIA_MS = 24 * 60 * 60 * 1000;

export function rangoDesde(rango: Rango, ahora = new Date()): Date | null {
  if (rango === "semana") return new Date(ahora.getTime() - 7 * DIA_MS);
  if (rango === "mes") return new Date(ahora.getTime() - 30 * DIA_MS);
  return null;
}

export function calcularStats(
  pedidos: PedidoStat[],
  desde: Date | null,
  origenes: readonly string[],
  ahora = new Date(),
) {
  const enRango = desde ? pedidos.filter((p) => new Date(p.created_at) >= desde) : pedidos;
  const semanaDesde = rangoDesde("semana", ahora)!;
  const pedidosSemana = pedidos.filter((p) => new Date(p.created_at) >= semanaDesde).length;

  const vendidos = enRango.filter((p) => p.estado === "vendido");
  const perdidos = enRango.filter((p) => p.estado === "perdido").length;
  // Tasa de cierre = vendidos / pedidos recibidos en el periodo.
  const tasaCierre = enRango.length === 0 ? 0 : vendidos.length / enRango.length;
  const gananciaTotal = vendidos.reduce((s, p) => s + (p.ganancia ?? 0), 0);

  const ventasPorOrigen = origenes
    .map((origen) => {
      const v = vendidos.filter((p) => p.origen === origen);
      return {
        origen,
        ventas: v.length,
        ganancia: v.reduce((s, p) => s + (p.ganancia ?? 0), 0),
      };
    })
    .sort((a, b) => b.ventas - a.ventas || b.ganancia - a.ganancia);

  return {
    pedidosSemana,
    totalPedidos: enRango.length,
    vendidos: vendidos.length,
    perdidos,
    tasaCierre,
    gananciaTotal,
    ventasPorOrigen,
  };
}
