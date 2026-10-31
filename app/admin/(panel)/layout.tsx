import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getCoincidencias } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { db } = await requireAdmin();
  const coincidencias = await getCoincidencias(db);
  return <AdminShell coincidencias={coincidencias.length}>{children}</AdminShell>;
}
