import type { Extraccion } from "./types";

/**
 * Convierte una extracción en los valores que precargan la ficha de pieza.
 * Los campos vacíos quedan como "" para que el formulario los pida a la persona.
 */
export function extraccionAFicha(e: Extraccion) {
  return {
    pieza: e.pieza ?? "",
    marca: e.marca ?? "",
    modelo: e.modelo ?? "",
    anio_desde: e.anio_desde ?? "",
    anio_hasta: e.anio_hasta ?? "",
    precio_yunkero: e.precio_yunkero ?? "",
  };
}

/** Una ficha puede publicarse sin más datos solo si trae lo mínimo que exige la tabla piezas. */
export function fichaCompleta(e: Extraccion): boolean {
  return Boolean(e.pieza && e.marca && e.modelo && e.anio_desde !== null && e.anio_hasta !== null);
}
