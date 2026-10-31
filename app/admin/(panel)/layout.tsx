import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getCoincidencias } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { db } = await requireAdmin();
  const [coincidencias, { count: pendientes }] = await Promise.all([
    getCoincidencias(db),
    db.from("resenas").select("*", { count: "exact", head: true }).eq("estado", "pendiente"),
  ]);
  return (
    <AdminShell coincidencias={coincidencias.length} resenasPendientes={pendientes ?? 0}>
      {children}
    </AdminShell>
  );
}
