import { Aviso } from "@/components/admin/Aviso";
import { PiezaForm } from "@/components/admin/PiezaForm";
import { requireAdmin } from "@/lib/auth";
import { crearPieza } from "../actions";

export default async function NuevaPiezaPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { db } = await requireAdmin();
  const { error } = await searchParams;
  const { data: yunkeros } = await db.from("yunkeros").select("id, nombre").order("nombre");
  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-extrabold">Nueva pieza</h1>
      <p className="mb-4 text-muted">Se publica hoy y vence automáticamente en 10 días.</p>
      <Aviso error={error} />
      <PiezaForm action={crearPieza} yunkeros={yunkeros ?? []} />
    </div>
  );
}
