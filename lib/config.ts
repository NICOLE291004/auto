// DATOS DEL NEGOCIO. Los marcados como PROVISIONAL deben confirmarse antes de publicar.

export const NEGOCIO = {
  nombre: "Alex Autopartes",
  ciudad: "Hermosillo, Sonora",
  /** PROVISIONAL: número de WhatsApp en formato internacional, sin "+" ni espacios. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "526621234567",
  /** PROVISIONAL */
  aniosExperiencia: 8,
  /** PROVISIONAL: texto de la garantía. */
  garantia: "Si la pieza no es la que pediste o llega con falla, te la cambiamos.",
};

export const MARCAS = [
  "Nissan",
  "Chevrolet",
  "Volkswagen",
  "Ford",
  "Toyota",
  "Honda",
  "Dodge",
  "Mazda",
  "Kia",
  "Hyundai",
];

export const MODELOS: Record<string, string[]> = {
  Nissan: ["Sentra", "Versa", "Tsuru", "March", "NP300", "Altima"],
  Chevrolet: ["Aveo", "Chevy", "Silverado", "Spark", "Cavalier", "Cheyenne"],
  Volkswagen: ["Jetta", "Golf", "Vento", "Pointer", "Polo", "Tiguan"],
  Ford: ["F-150", "Focus", "Fiesta", "Ranger", "Explorer", "Escape"],
  Toyota: ["Corolla", "Camry", "Hilux", "Tacoma", "RAV4", "Yaris"],
  Honda: ["Civic", "Accord", "CR-V", "Fit", "City", "Odyssey"],
  Dodge: ["Ram", "Attitude", "Journey", "Neon", "Charger", "Durango"],
  Mazda: ["Mazda 3", "Mazda 6", "CX-5", "CX-7", "Mazda 2"],
  Kia: ["Rio", "Forte", "Sportage", "Sorento", "Soul"],
  Hyundai: ["Accent", "Elantra", "Tucson", "Santa Fe", "i10"],
};

export const PIEZAS_COMUNES = [
  "Faro",
  "Calavera",
  "Defensa",
  "Salpicadera",
  "Cofre",
  "Puerta",
  "Espejo",
  "Motor",
  "Transmisión",
  "Alternador",
];
