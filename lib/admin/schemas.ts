import { z } from "zod";
import { ESTADOS_PEDIDO, ORIGENES } from "./labels";

const texto = (max: number) => z.string().trim().min(1).max(max);
const textoOpcional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .transform((v) => v ?? null);

/** "" -> null; si no, número >= 0. */
const dinero = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
  z.number().min(0).max(10_000_000).nullable(),
);

const anio = z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1);
const anioOpcional = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
  anio.nullable(),
);

const whatsapp = z
  .string()
  .transform((v) => v.replace(/\D/g, ""))
  .pipe(z.string().regex(/^\d{10,15}$/, "WhatsApp inválido"));

const origenes = ORIGENES.map((o) => o.value) as [string, ...string[]];
const estados = ESTADOS_PEDIDO.map((e) => e.value) as [string, ...string[]];

/** Captura rápida de un pedido. */
export const pedidoNuevoSchema = z.object({
  pieza: texto(120),
  marca: texto(40),
  modelo: texto(60),
  anio: anioOpcional,
  nombre: texto(80),
  whatsapp,
  ubicacion: textoOpcional(80),
  origen: z.enum(origenes),
  notas: textoOpcional(1000),
});

/** Edición de un pedido: estado, dinero y notas. */
export const pedidoEdicionSchema = z.object({
  estado: z.enum(estados),
  precio_venta: dinero,
  costo_yunkero: dinero,
  notas: textoOpcional(1000),
});

export const piezaSchema = z
  .object({
    pieza: texto(120),
    marca: texto(40),
    modelo: texto(60),
    anio_desde: anio,
    anio_hasta: anio,
    precio_yunkero: dinero,
    yunkero_id: z.preprocess((v) => (v === "" ? null : v), z.string().uuid().nullable()),
  })
  .refine((p) => p.anio_hasta >= p.anio_desde, { message: "El año final no puede ser menor al inicial" });

export const yunkeroSchema = z.object({
  nombre: texto(80),
  whatsapp: z
    .string()
    .trim()
    .max(30)
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v === "" || /^\d{10,15}$/.test(v), "WhatsApp inválido")
    .transform((v) => (v === "" ? null : v)),
  especialidad: textoOpcional(120),
  notas: textoOpcional(1000),
});
