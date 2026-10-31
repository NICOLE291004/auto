"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import type { Pedido } from "@/lib/admin/data";
import { descripcionPieza, nombreSugerido } from "@/lib/resenas";

function refrescar() {
  revalidatePath("/admin", "layout");
  revalidatePath("/"); // la home muestra las aprobadas
}

/** Crea el enlace único de reseña para un pedido vendido. Si ya existe, no hace nada. */
export async function solicitarResena(pedidoId: string) {
  const { db } = await requireAdmin();
  const { data } = await db.from("pedidos").select("*").eq("id", pedidoId).maybeSingle();
  const p = data as Pedido | null;
  if (!p) redirect("/admin/pedidos");
  if (p.estado !== "vendido") redirect(`/admin/pedidos/${pedidoId}?error=guardar`);

  const { error } = await db.from("resenas").insert({
    pedido_id: p.id,
    pieza: descripcionPieza(p),
    nombre_sugerido: nombreSugerido(p.cliente_nombre),
  });
  // 23505 = ya existía una reseña para este pedido
  if (error && error.code !== "23505") {
    console.error("solicitarResena:", error.message);
    redirect(`/admin/pedidos/${pedidoId}?error=guardar`);
  }
  refrescar();
  redirect(`/admin/pedidos/${pedidoId}?ok=resena`);
}

async function cambiarEstado(id: string, estado: "aprobada" | "rechazada") {
  const { db } = await requireAdmin();
  const { error } = await db.from("resenas").update({ estado }).eq("id", id);
  if (error) redirect("/admin/resenas?error=guardar");
  refrescar();
  redirect(`/admin/resenas?ok=${estado}`);
}

export async function aprobarResena(id: string) {
  return cambiarEstado(id, "aprobada");
}

/** Rechaza una pendiente o retira una ya publicada. */
export async function rechazarResena(id: string) {
  return cambiarEstado(id, "rechazada");
}
