import type { MensajeEntrante } from "./mensajes";

/**
 * FASE 3 (pendiente). Hoy solo registra cuántos mensajes llegaron y no escribe en la base de datos.
 *
 * Flujo previsto por cada mensaje (ver docs/FASE-3.md):
 *  1. Guardar en ingesta_mensajes (wa_message_id único => idempotente) y asociar el yunkero por número.
 *  2. Si es foto: descargar el archivo con la API de WhatsApp (mediaId) y pasarlo a extractor.extraer.
 *     Si es texto: pasar el texto.
 *  3. Validar con validarExtraccion y guardar el resultado en ingesta_mensajes.extraccion.
 *  4. Crear la pieza con estado 'pendiente_revision' (no pública, no cuenta para coincidencias).
 *  5. Un admin la revisa en el panel, completa lo que falte y la publica (vence a los 10 días).
 */
export async function procesarMensajes(mensajes: MensajeEntrante[]): Promise<void> {
  if (mensajes.length === 0) return;
  console.info(`[webhook whatsapp] ${mensajes.length} mensaje(s) recibidos; procesamiento aún no activado.`);
}
