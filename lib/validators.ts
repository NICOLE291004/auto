import { z } from "zod";

const texto = (max: number) => z.string().trim().min(1).max(max);

export const pedidoSchema = z.object({
  marca: texto(40),
  modelo: texto(60),
  anio: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1),
  pieza: texto(120),
  nombre: texto(80),
  whatsapp: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().regex(/^\d{10,15}$/, "WhatsApp inválido")),
  ubicacion: texto(80),
});

export type PedidoInput = z.infer<typeof pedidoSchema>;

export const FOTO_MAX_BYTES = 5 * 1024 * 1024;
export const FOTO_TIPOS = ["image/jpeg", "image/png", "image/webp", "image/heic"];
