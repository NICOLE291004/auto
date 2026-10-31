import Link from "next/link";
import { IconWhatsApp } from "@/components/icons";
import { requireAdmin } from "@/lib/auth";
import { getCoincidencias } from "@/lib/admin/data";
import { diasRestantes } from "@/lib/expiry";
import { rangoAnios } from "@/lib/piezas";
import { waCliente } from "@/lib/whatsapp";

export default async function CoincidenciasPage() {
  const { db } = await requireAdmin();
  const coincidencias = await getCoincidencias(db);

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-extrabold">Coincidencias</h1>
      <p className="mb-4 text-muted">
        Pedidos abiertos (nuevo o cotizado) que ya tienen una pieza vigente con la misma marca, modelo, año y tipo de pieza.
      </p>
      {coincidencias.length === 0 ? (
        <p className="rounded-3xl bg-white p-6 text-muted">
          Sin coincidencias por ahora. Cuando publiques una pieza que encaje con un pedido abierto, aparecerá aquí.
        </p>
      ) : (
        <ul className="space-y-4">
          {coincidencias.map(({ pedido: p, piezas }) => (
            <li key={p.id} className="rounded-3xl bg-white p-4">
              <Link href={`/admin/pedidos/${p.id}`} className="block">
                <p className="font-display text-xl font-bold leading-tight">{p.pieza}</p>
                <p className="text-muted">
                  {p.marca} {p.modelo} {p.anio ?? ""} · {p.cliente_nombre}
                </p>
              </Link>
              <ul className="mt-3 space-y-2">
                {piezas.map((z) => (
                  <li key={z.id} className="flex items-center justify-between gap-2 rounded-2xl bg-niebla p-3">
                    <Link href={`/admin/piezas/${z.id}`} className="min-w-0 flex-1">
                      <p className="truncate font-semibold">
                        {z.pieza} · {z.marca} {z.modelo} {rangoAnios(z)}
                      </p>
                      <p className="text-sm text-muted">
                        {z.yunkeros?.nombre ?? "Sin yunkero"} · vence en {diasRestantes(z.expira_en)} d
                      </p>
                    </Link>
                    <a
                      href={waCliente(
                        p.cliente_whatsapp,
                        `Hola ${p.cliente_nombre}, te escribimos de Alex Autopartes. Tenemos una opción para tu pedido: ${z.pieza} para ${z.marca} ${z.modelo} ${rangoAnios(z)}. ¿Te interesa que te pasemos los detalles?`,
                      )}
                      target="_blank"
                      rel="noopener"
                      aria-label={`Avisar a ${p.cliente_nombre} por WhatsApp`}
                      className="flex shrink-0 items-center gap-1.5 rounded-xl bg-wa px-3 py-2 text-sm font-bold text-white"
                    >
                      <IconWhatsApp width={18} height={18} /> Avisar
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
