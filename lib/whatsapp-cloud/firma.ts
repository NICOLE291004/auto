import { createHmac, timingSafeEqual } from "node:crypto";

/** Verifica la cabecera X-Hub-Signature-256 que Meta firma con el App Secret sobre el cuerpo crudo. */
export function firmaValida(cuerpoCrudo: string, cabecera: string | null, appSecret: string): boolean {
  if (!cabecera?.startsWith("sha256=")) return false;
  const esperada = createHmac("sha256", appSecret).update(cuerpoCrudo, "utf8").digest();
  const recibida = Buffer.from(cabecera.slice("sha256=".length), "hex");
  return recibida.length === esperada.length && timingSafeEqual(recibida, esperada);
}

/** Respuesta al GET de verificación del webhook: devuelve el challenge solo si el token coincide. */
export function verificarSuscripcion(
  params: URLSearchParams,
  tokenEsperado: string,
): string | null {
  if (params.get("hub.mode") !== "subscribe") return null;
  if (params.get("hub.verify_token") !== tokenEsperado) return null;
  return params.get("hub.challenge");
}
