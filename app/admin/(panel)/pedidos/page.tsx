import Link from "next/link";
import { Aviso } from "@/components/admin/Aviso";
import { IconMas } from "@/components/icons";
import { requireAdmin } from "@/lib/auth";
import type { Pedido } from "@/lib/admin/data";
import { colorEstado, dinero, ESTADOS_PEDIDO, etiquetaEstado, etiquetaOrigen } from "@/lib/admin/labels";

const FILTROS = [{ value: "todos", label: "Todos" }, ...ESTADOS_PEDIDO];

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; ok?: string }>;
}) {
  const { db } = await requireAdmin();
  const { estado = "todos", ok } = await searchParams;

  let q = db.from("pedidos").select("*").order("created_at", { ascending: false }).limit(200);
  if (ESTADOS_PEDIDO.some((e) => e.value === estado)) q = q.eq("estado", estado);
  const { data } = await q;
  const pedidos = (data ?? []) as Pedido[];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-3xl font-extrabold">Pedidos</h1>
        <Link
          href="/admin/pedidos/nuevo"
          className="inline-flex items-center gap-1.5 rounded-2xl bg-rojo px-4 py-3 font-bold text-white hover:bg-rojo-hondo"
        >
          <IconMas width={20} height={20} /> Nuevo
        </Link>
      </div>
      <Aviso ok={ok} />

      <nav aria-label="Filtrar por estado" className="mb-4 flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "todos" ? "/admin/pedidos" : `/admin/pedidos?estado=${f.value}`}
            className={`rounded-full border-2 px-4 py-2 text-[15px] font-semibold ${
              estado === f.value ? "border-azul bg-azul text-white" : "border-linea bg-white"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      {pedidos.length === 0 ? (
        <p className="rounded-3xl bg-white p-6 text-muted">No hay pedidos en esta vista.</p>
      ) : (
        <ul className="space-y-3">
          {pedidos.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/pedidos/${p.id}`} className="block rounded-3xl bg-white p-4 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-xl font-bold leading-tight">{p.pieza}</p>
                    <p className="text-muted">
                      {p.marca} {p.modelo} {p.anio ?? ""}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${colorEstado[p.estado]}`}>
                    {etiquetaEstado(p.estado)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">
                  {p.cliente_nombre} · {etiquetaOrigen(p.origen)} ·{" "}
                  {new Date(p.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                  {p.estado === "vendido" && p.ganancia !== null && (
                    <span className="font-bold text-emerald-700"> · {dinero(p.ganancia)}</span>
                  )}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
