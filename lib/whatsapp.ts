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
