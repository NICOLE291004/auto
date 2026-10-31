import { extraccionSchema, type Extraccion, type Extractor } from "./types";

/** Instrucciones para el modelo. Se usarán tal cual cuando se conecte la API de Claude. */
export const PROMPT_EXTRACCION = `Eres un asistente de una tienda de autopartes usadas en México.
Recibirás el texto o la foto de una publicación de un yonke con una pieza a la venta.
Devuelve SOLO un JSON con estos campos:
pieza, marca, modelo, anio_desde, anio_hasta, precio_yunkero, notas, confianza.
- pieza: tipo de pieza en español (ej. "Faro derecho").
- marca y modelo del vehículo compatible (ej. "Nissan", "Sentra").
- anio_desde y anio_hasta: rango de años compatible. Si solo hay un año, repítelo en ambos.
- precio_yunkero: número en pesos mexicanos, sin símbolo. null si no aparece.
- notas: detalles útiles (lado, color, estado). null si no hay.
- confianza: número de 0 a 1.
Si un dato no se puede leer con certeza, usa null. No inventes datos.`;

export class IAnoConfigurada extends Error {
  constructor() {
    super("La extracción con IA todavía no está conectada (Fase 3).");
    this.name = "IAnoConfigurada";
  }
}

/** Valida y normaliza lo que devuelva el modelo. Lanza si no cumple el esquema. */
export function validarExtraccion(crudo: unknown): Extraccion {
  const e = extraccionSchema.parse(crudo);
  // Si solo viene un extremo del rango, el otro se iguala.
  if (e.anio_desde !== null && e.anio_hasta === null) return { ...e, anio_hasta: e.anio_desde };
  if (e.anio_hasta !== null && e.anio_desde === null) return { ...e, anio_desde: e.anio_hasta };
  return e;
}

/**
 * Punto de entrada para extraer una ficha. Hoy no hace nada: en la Fase 3 aquí se llamará a la
 * API de Claude con PROMPT_EXTRACCION y la entrada, y el resultado pasará por validarExtraccion.
 */
export const extractor: Extractor = {
  async extraer(): Promise<Extraccion> {
    throw new IAnoConfigurada();
  },
};
