"use server";

import { redirect } from "next/navigation";
import { supabaseSesion } from "@/lib/supabase/server";

export async function iniciarSesion(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const db = await supabaseSesion();
  if (!db) redirect("/admin/login?error=config");

  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error) redirect("/admin/login?error=credenciales");

  const { data: esAdmin } = await db.rpc("is_admin");
  if (esAdmin !== true) {
    await db.auth.signOut();
    redirect("/admin/login?error=permiso");
  }
  redirect("/admin");
}

export async function cerrarSesion() {
  const db = await supabaseSesion();
  await db?.auth.signOut();
  redirect("/admin/login");
}
