import { z } from "zod";

export type MensajeEntrante = {
  id: string; // wa_message_id, sirve para no procesar dos veces el mismo mensaje
  de: string; // número del remitente, solo dígitos
  tipo: "text" | "image" | "otro";
  texto: string | null; // cuerpo del texto o pie de foto
  mediaId: string | null;
};

const mensajeSchema = z.object({
  id: z.string(),
  from: z.string(),
  type: z.string(),
  text: z.object({ body: z.string() }).optional(),
  image: z.object({ id: z.string(), caption: z.string().optional() }).optional(),
});

const payloadSchema = z.object({
  entry: z
    .array(
      z.object({
        changes: z.array(
          z.object({
            value: z.object({ messages: z.array(mensajeSchema).optional() }).passthrough(),
          }),
        ),
      }),
    )
    .default([]),
});

/** Extrae los mensajes de un POST del webhook. Ignora estados de entrega y payloads que no encajan. */
export function extraerMensajes(payload: unknown): MensajeEntrante[] {
  const r = payloadSchema.safeParse(payload);
  if (!r.success) return [];
  return r.data.entry
    .flatMap((e) => e.changes)
    .flatMap((c) => c.value.messages ?? [])
    .map((m): MensajeEntrante => {
      if (m.type === "text") {
        return { id: m.id, de: m.from.replace(/\D/g, ""), tipo: "text", texto: m.text?.body ?? null, mediaId: null };
      }
      if (m.type === "image") {
        return {
          id: m.id,
          de: m.from.replace(/\D/g, ""),
          tipo: "image",
          texto: m.image?.caption ?? null,
          mediaId: m.image?.id ?? null,
        };
      }
      return { id: m.id, de: m.from.replace(/\D/g, ""), tipo: "otro", texto: null, mediaId: null };
    });
}

/**
 * Compara números por sus últimos 10 dígitos. WhatsApp entrega los de México como 521XXXXXXXXXX
 * (o 52XXXXXXXXXX) y en el panel se guardan a 10 dígitos.
 */
export function mismoNumero(a: string, b: string): boolean {
  const ult = (n: string) => n.replace(/\D/g, "").slice(-10);
  return ult(a).length === 10 && ult(a) === ult(b);
}

export function buscarYunkeroPorNumero<T extends { whatsapp: string | null }>(
  numero: string,
  yunkeros: T[],
): T | null {
  return yunkeros.find((y) => y.whatsapp && mismoNumero(numero, y.whatsapp)) ?? null;
}
