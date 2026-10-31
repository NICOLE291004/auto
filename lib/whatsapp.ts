import { NEGOCIO } from "./config";

export function waLink(texto: string) {
  return `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(texto)}`;
}

export type PedidoResumen = {
  marca: string;
  modelo: string;
  anio: string;
  pieza: string;
  nombre: string;
  ubicacion: string;
};

export function mensajePedido(p: PedidoResumen) {
  return [
    "Hola, quiero solicitar una pieza:",
    `• Vehículo: ${p.marca} ${p.modelo} ${p.anio}`,
    `• Pieza: ${p.pieza}`,
    `• Nombre: ${p.nombre}`,
    `• Zona: ${p.ubicacion}`,
  ].join("\n");
}

export function mensajePrecio(pieza: { marca: string; modelo: string; anios: string; pieza: string }) {
  return `Hola, me interesa esta pieza: ${pieza.pieza} para ${pieza.marca} ${pieza.modelo} ${pieza.anios}. ¿Cuál es el precio y si sigue disponible?`;
}

/** Chat directo con un cliente. Acepta 10 dígitos (México) o número con lada internacional. */
export function waCliente(numero: string, texto?: string) {
  const digitos = numero.replace(/\D/g, "");
  const completo = digitos.length === 10 ? `52${digitos}` : digitos;
  return `https://wa.me/${completo}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;
}

/** Primer mensaje con huecos para que llegue útil desde el botón flotante y el pie de página. */
export const PLANTILLA_WHATSAPP = ["Hola, busco una pieza:", "• Vehículo (marca, modelo y año): ", "• Pieza: "].join("\n");

/** "526621191235" -> "662 119 1235" (últimos 10 dígitos, para mostrarlo en el sitio). */
export function telefonoLegible(numero: string) {
  const d = numero.replace(/\D/g, "").slice(-10);
  return d.length === 10 ? `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : numero;
}
