import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getCoincidencias } from "@/lib/admin/data";
import { dinero, etiquetaOrigen, ORIGENES } from "@/lib/admin/labels";
import { calcularStats, rangoDesde, type Rango } from "@/lib/stats";

const RANGOS: { value: Rango; label: string }[] = [
  { value: "semana", label: "7 días" },
  { value: "mes", label: "30 días" },
  { value: "todo", label: "Todo" },
];

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ rango?: string }> }) {
  const { db } = await requireAdmin();
  const { rango: r } = await searchParams;
  const rango: Rango = r === "semana" || r === "todo" ? r : "mes";

  const { data } = await db.from("pedidos").select("estado, origen, ganancia, created_at");
  const stats = calcularStats(
    (data ?? []) as Parameters<typeof calcularStats>[0],
    rangoDesde(rango),
    ORIGENES.map((o) => o.value),
  );
  const coincidencias = await getCoincidencias(db);
  const maxVentas = Math.max(1, ...stats.ventasPorOrigen.map((o) => o.ventas));

  const tarjeta = "rounded-3xl bg-white p-5";
  return (
    <div className="space-y-5">
      <h1 className="font-display text-3xl font-extrabold">Resumen</h1>

      {coincidencias.length > 0 && (
        <Link
          href="/admin/coincidencias"
          className="flex items-center justify-between gap-3 rounded-3xl bg-rojo p-5 font-bold text-white"
        >
          <span>
            {coincidencias.length === 1
              ? "1 pedido abierto tiene una pieza que coincide"
              : `${coincidencias.length} pedidos abiertos tienen piezas que coinciden`}
          </span>
          <span aria-hidden>Ver →</span>
        </Link>
      )}

      <div className={tarjeta}>
        <p className="text-sm font-bold text-muted">Pedidos de la semana</p>
        <p className="font-display text-5xl font-extrabold text-azul">{stats.pedidosSemana}</p>
      </div>

      <div className="flex gap-2" role="group" aria-label="Periodo">
        {RANGOS.map((o) => (
          <Link
            key={o.value}
            href={`/admin?rango=${o.value}`}
            className={`rounded-full border-2 px-4 py-2 text-[15px] font-semibold ${
              rango === o.value ? "border-azul bg-azul text-white" : "border-linea bg-white"
            }`}
          >
            {o.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={tarjeta}>
          <p className="text-sm font-bold text-muted">Tasa de cierre</p>
          <p className="font-display text-4xl font-extrabold">{Math.round(stats.tasaCierre * 100)}%</p>
          <p className="mt-1 text-sm text-muted">
            {stats.vendidos} vendidos de {stats.totalPedidos} pedidos
          </p>
        </div>
        <div className={tarjeta}>
          <p className="text-sm font-bold text-muted">Ganancia total</p>
          <p className="font-display text-4xl font-extrabold text-emerald-700">{dinero(stats.gananciaTotal)}</p>
          <p className="mt-1 text-sm text-muted">{stats.perdidos} perdidos</p>
        </div>
      </div>

      <div className={tarjeta}>
        <h2 className="mb-4 font-display text-xl font-bold">Ventas por origen</h2>
        <ul className="space-y-3">
          {stats.ventasPorOrigen.map((o) => (
            <li key={o.origen}>
              <div className="flex justify-between text-[15px] font-semibold">
                <span>{etiquetaOrigen(o.origen)}</span>
                <span>
                  {o.ventas} · {dinero(o.ganancia)}
                </span>
              </div>
              <div className="mt-1 h-3 overflow-hidden rounded-full bg-niebla">
                <div className="h-full rounded-full bg-azul" style={{ width: `${(o.ventas / maxVentas) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
