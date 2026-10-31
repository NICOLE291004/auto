"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { yunkeroSchema } from "@/lib/admin/schemas";

export async function guardarYunkero(id: string | null, formData: FormData) {
  const { db } = await requireAdmin();
  const volver = id ? `/admin/yunkeros/${id}` : "/admin/yunkeros/nuevo";
  const r = yunkeroSchema.safeParse(Object.fromEntries(formData));
  if (!r.success) redirect(`${volver}?error=datos`);

  const { error } = id
    ? await db.from("yunkeros").update(r.data).eq("id", id)
    : await db.from("yunkeros").insert(r.data);
  if (error) {
    console.error("guardarYunkero:", error.message);
    redirect(`${volver}?error=guardar`);
  }
  revalidatePath("/admin", "layout");
  redirect("/admin/yunkeros?ok=guardado");
}

export async function eliminarYunkero(id: string) {
  const { db } = await requireAdmin();
  // Las piezas asociadas quedan sin yunkero (on delete set null).
  const { error } = await db.from("yunkeros").delete().eq("id", id);
  if (error) redirect(`/admin/yunkeros/${id}?error=guardar`);
  revalidatePath("/admin", "layout");
  redirect("/admin/yunkeros?ok=eliminado");
}
