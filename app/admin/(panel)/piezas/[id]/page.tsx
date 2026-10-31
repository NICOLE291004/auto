import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Aviso } from "@/components/admin/Aviso";
import { PiezaForm } from "@/components/admin/PiezaForm";
import { requireAdmin } from "@/lib/auth";
import type { Pieza } from "@/lib/admin/data";
import { diasRestantes, estaVigente } from "@/lib/expiry";
import { actualizarPieza, eliminarPieza, marcarVendida, renovarPieza } from "../actions";

export default async function PiezaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { db } = await requireAdmin();
  const { id } = await params;
  const { ok, error } = await searchParams;

  const { data } = await db.from("piezas").select("*, yunkeros(nombre)").eq("id", id).maybeSingle();
  if (!data) notFound();
  const p = data as Pieza;
  const { data: yunkeros } = await db.from("yunkeros").select("id, nombre").order("nombre");

  const ahora = new Date();
  const vigente = estaVigente(p, ahora);
  const accion = "w-full rounded-2xl border-2 border-linea bg-white px-4 py-3 font-bold hover:border-azul";

  return (
    <div className="space-y-5">
      <Link href="/admin/piezas" className="text-sm font-semibold text-azul">
        ← Piezas
      </Link>
      <h1 className="font-display text-3xl font-extrabold leading-tight">{p.pieza}</h1>

      {p.foto_url && (
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-niebla">
          <Image src={p.foto_url} alt={p.pieza} fill sizes="(min-width:768px) 600px, 100vw" className="object-cover" />
        </div>
      )}

      <div className="rounded-3xl bg-white p-4">
        <p className="font-bold">
          {p.estado === "vendida"
            ? "Vendida"
            : vigente
              ? `Publicada: vence en ${diasRestantes(p.expira_en, ahora)} días`
              : "Vencida: ya no se muestra en el sitio"}
        </p>
        <p className="text-sm text-muted">
          Vence el {new Date(p.expira_en).toLocaleDateString("es-MX", { day: "numeric", month: "long" })}
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <form action={renovarPieza.bind(null, p.id)}>
            <button className={accion}>Renovar 10 días</button>
          </form>
          {p.estado !== "vendida" && (
            <form action={marcarVendida.bind(null, p.id)}>
              <button className={accion}>Marcar vendida</button>
            </form>
          )}
        </div>
      </div>

      <Aviso ok={ok} error={error} />
      <PiezaForm action={actualizarPieza.bind(null, p.id)} pieza={p} yunkeros={yunkeros ?? []} />

      <details className="rounded-3xl bg-white p-4">
        <summary className="cursor-pointer font-bold text-rojo-hondo">Eliminar pieza</summary>
        <p className="my-3 text-muted">Se borra para siempre. Si solo se vendió, usa “Marcar vendida”.</p>
        <form action={eliminarPieza.bind(null, p.id)}>
          <button className="w-full rounded-2xl bg-rojo px-4 py-3 font-bold text-white">Sí, eliminar</button>
        </form>
      </details>
    </div>
  );
}
