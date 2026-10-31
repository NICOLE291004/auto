import Image from "next/image";
import Link from "next/link";
import { Aviso } from "@/components/admin/Aviso";
import { IconMas } from "@/components/icons";
import { requireAdmin } from "@/lib/auth";
import type { Pieza } from "@/lib/admin/data";
import { dinero } from "@/lib/admin/labels";
import { diasRestantes, estaVigente } from "@/lib/expiry";
import { rangoAnios } from "@/lib/piezas";

const FILTROS = [
  { value: "vigentes", label: "Vigentes" },
  { value: "vencidas", label: "Vencidas" },
  { value: "vendidas", label: "Vendidas" },
  { value: "todas", label: "Todas" },
];

export default async function PiezasPage({
  searchParams,
}: {
  searchParams: Promise<{ ver?: string; ok?: string }>;
}) {
  const { db } = await requireAdmin();
  const { ver = "vigentes", ok } = await searchParams;

  const { data } = await db
    .from("piezas")
    .select("*, yunkeros(nombre)")
    .order("publicada_en", { ascending: false })
    .limit(300);
  const ahora = new Date();
  const todas = (data ?? []) as Pieza[];
  const piezas = todas.filter((p) =>
    ver === "vigentes"
      ? estaVigente(p, ahora)
      : ver === "vencidas"
        ? p.estado !== "vendida" && !estaVigente(p, ahora)
        : ver === "vendidas"
          ? p.estado === "vendida"
          : true,
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-3xl font-extrabold">Piezas</h1>
        <Link
          href="/admin/piezas/nueva"
          className="inline-flex items-center gap-1.5 rounded-2xl bg-rojo px-4 py-3 font-bold text-white hover:bg-rojo-hondo"
        >
          <IconMas width={20} height={20} /> Nueva
        </Link>
      </div>
      <Aviso ok={ok} />
      <nav aria-label="Filtrar piezas" className="mb-4 flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <Link
            key={f.value}
            href={`/admin/piezas?ver=${f.value}`}
            className={`rounded-full border-2 px-4 py-2 text-[15px] font-semibold ${
              ver === f.value ? "border-azul bg-azul text-white" : "border-linea bg-white"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      {piezas.length === 0 ? (
        <p className="rounded-3xl bg-white p-6 text-muted">No hay piezas en esta vista.</p>
      ) : (
        <ul className="space-y-3">
          {piezas.map((p) => {
            const vigente = estaVigente(p, ahora);
            const dias = diasRestantes(p.expira_en, ahora);
            return (
              <li key={p.id}>
                <Link href={`/admin/piezas/${p.id}`} className="flex gap-3 rounded-3xl bg-white p-3 hover:shadow-md">
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl bg-niebla">
                    {p.foto_url && <Image src={p.foto_url} alt="" fill sizes="96px" className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg font-bold leading-tight">{p.pieza}</p>
                    <p className="truncate text-muted">
                      {p.marca} {p.modelo} {rangoAnios(p)}
                    </p>
                    <p className="mt-1 text-sm">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          p.estado === "vendida"
                            ? "bg-emerald-600 text-white"
                            : vigente
                              ? dias <= 2
                                ? "bg-senal text-ink"
                                : "bg-azul text-white"
                              : "bg-linea text-muted"
                        }`}
                      >
                        {p.estado === "vendida" ? "Vendida" : vigente ? `${dias} d` : "Vencida"}
                      </span>
                      <span className="text-muted">
                        {" "}
                        {p.yunkeros?.nombre ?? "Sin yunkero"} · {dinero(p.precio_yunkero)}
                      </span>
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
