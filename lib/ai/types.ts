import { z } from "zod";

/**
 * Datos que la IA extrae de la publicación de un yunkero (texto o foto).
 * Todo es opcional: lo que no se pueda leer queda en null y lo completa la persona al revisar.
 */
export const extraccionSchema = z.object({
  pieza: z.string().trim().min(1).nullable(),
  marca: z.string().trim().min(1).nullable(),
  modelo: z.string().trim().min(1).nullable(),
  anio_desde: z.number().int().min(1950).max(2100).nullable(),
  anio_hasta: z.number().int().min(1950).max(2100).nullable(),
  precio_yunkero: z.number().min(0).nullable(),
  notas: z.string().nullable(),
  /** 0 a 1: qué tan seguro está el modelo de lo extraído. Sirve para ordenar la cola de revisión. */
  confianza: z.number().min(0).max(1),
});

export type Extraccion = z.infer<typeof extraccionSchema>;

export type EntradaExtraccion =
  | { tipo: "texto"; texto: string }
  | { tipo: "imagen"; base64: string; mediaType: "image/jpeg" | "image/png" | "image/webp"; textoAcompanante?: string };

/** Contrato que implementará la integración con la API de Claude. */
export interface Extractor {
  extraer(entrada: EntradaExtraccion): Promise<Extraccion>;
}
