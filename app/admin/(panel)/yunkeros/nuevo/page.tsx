import { Aviso } from "@/components/admin/Aviso";
import { YunkeroForm } from "@/components/admin/YunkeroForm";
import { guardarYunkero } from "../actions";

export default async function NuevoYunkeroPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="mb-4 font-display text-3xl font-extrabold">Nuevo yunkero</h1>
      <Aviso error={error} />
      <YunkeroForm action={guardarYunkero.bind(null, null)} />
    </div>
  );
}
