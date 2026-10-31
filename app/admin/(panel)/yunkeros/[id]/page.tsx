import Link from "next/link";
import { notFound } from "next/navigation";
import { Aviso } from "@/components/admin/Aviso";
import { YunkeroForm } from "@/components/admin/YunkeroForm";
import { requireAdmin } from "@/lib/auth";
import type { Yunkero } from "@/lib/admin/data";
import { eliminarYunkero, guardarYunkero } from "../actions";

export default async function YunkeroPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { db } = await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const { data } = await db.from("yunkeros").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="space-y-5">
      <Link href="/admin/yunkeros" className="text-sm font-semibold text-azul">
        ← Yunkeros
      </Link>
      <h1 className="font-display text-3xl font-extrabold">{(data as Yunkero).nombre}</h1>
      <Aviso error={error} />
      <YunkeroForm action={guardarYunkero.bind(null, id)} yunkero={data as Yunkero} />
      <details className="rounded-3xl bg-white p-4">
        <summary className="cursor-pointer font-bold text-rojo-hondo">Eliminar yunkero</summary>
        <p className="my-3 text-muted">Sus piezas se conservan, pero quedan sin yunkero asignado.</p>
        <form action={eliminarYunkero.bind(null, id)}>
          <button className="w-full rounded-2xl bg-rojo px-4 py-3 font-bold text-white">Sí, eliminar</button>
        </form>
      </details>
    </div>
  );
}
