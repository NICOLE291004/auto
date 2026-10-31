import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { supabaseSesion } from "./supabase/server";

/**
 * Verifica sesión Y que el usuario esté en la tabla admins. Úsalo en cada layout/página/acción del panel:
 * proxy.ts solo hace una revisión rápida y no basta como autorización.
 */
export const requireAdmin = cache(async () => {
  const db = await supabaseSesion();
  if (!db) redirect("/admin/login?error=config");
  const { data } = await db.auth.getUser();
  if (!data.user) redirect("/admin/login");
  const { data: esAdmin } = await db.rpc("is_admin");
  if (esAdmin !== true) {
    await db.auth.signOut();
    redirect("/admin/login?error=permiso");
  }
  return { db, user: data.user };
});
