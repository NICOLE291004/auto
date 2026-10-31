import Link from "next/link";
import { Aviso } from "@/components/admin/Aviso";
import { IconMas } from "@/components/icons";
import { requireAdmin } from "@/lib/auth";
import type { Yunkero } from "@/lib/admin/data";
import { waCliente } from "@/lib/whatsapp";

export default async function YunkerosPage({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const { db } = await requireAdmin();
  const { ok } = await searchParams;
  const { data } = await db.from("yunkeros").select("*").order("nombre");
  const yunkeros = (data ?? []) as Yunkero[];

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="font-display text-3xl font-extrabold">Yunkeros</h1>
        <Link
          href="/admin/yunkeros/nuevo"
          className="inline-flex items-center gap-1.5 rounded-2xl bg-rojo px-4 py-3 font-bold text-white hover:bg-rojo-hondo"
        >
          <IconMas width={20} height={20} /> Nuevo
        </Link>
      </div>
      <p className="mb-4 text-muted">Privado: nunca aparece en el sitio público.</p>
      <Aviso ok={ok} />
      {yunkeros.length === 0 ? (
        <p className="rounded-3xl bg-white p-6 text-muted">Aún no hay yunkeros. Agrega el primero.</p>
      ) : (
        <ul className="space-y-3">
          {yunkeros.map((y) => (
            <li key={y.id} className="flex items-center justify-between gap-3 rounded-3xl bg-white p-4">
              <Link href={`/admin/yunkeros/${y.id}`} className="min-w-0 flex-1">
                <p className="truncate font-display text-lg font-bold">{y.nombre}</p>
                <p className="truncate text-sm text-muted">{y.especialidad ?? "Sin especialidad"}</p>
              </Link>
              {y.whatsapp && (
                <a
                  href={waCliente(y.whatsapp)}
                  target="_blank"
                  rel="noopener"
                  className="shrink-0 rounded-xl bg-wa px-3 py-2 text-sm font-bold text-white"
                >
                  WhatsApp
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
