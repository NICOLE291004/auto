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
