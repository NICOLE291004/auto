import { describe, expect, it } from "vitest";
import { slugify } from "../lib/slug";
import { mensajePedido, mensajePrecio, waLink } from "../lib/whatsapp";
import { pedidoSchema } from "../lib/validators";
import { MARCAS, MODELOS } from "../lib/config";
import { rangoAnios } from "../lib/piezas";

describe("slugify", () => {
  it("quita acentos y espacios", () => {
    expect(slugify("Volkswagen")).toBe("volkswagen");
    expect(slugify("Transmisión")).toBe("transmision");
    expect(slugify("Mazda 3")).toBe("mazda-3");
    expect(slugify("F-150")).toBe("f-150");
    expect(slugify("  Santa  Fe ")).toBe("santa-fe");
    expect(slugify("Ñandú")).toBe("nandu");
  });

  it("no genera slugs repetidos dentro de una marca", () => {
    for (const marca of MARCAS) {
      const slugs = (MODELOS[marca] ?? []).map(slugify);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });
});

describe("WhatsApp", () => {
  it("codifica el texto en la URL", () => {
    const url = waLink("Hola, ¿precio?");
    expect(url).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(decodeURIComponent(url.split("text=")[1])).toBe("Hola, ¿precio?");
  });

  it("el mensaje del pedido incluye vehículo, pieza y datos del cliente", () => {
    const m = mensajePedido({
      marca: "Nissan",
      modelo: "Sentra",
      anio: "2015",
      pieza: "Faro",
      nombre: "Luis",
      ubicacion: "Centro",
    });
    expect(m).toContain("Nissan Sentra 2015");
    expect(m).toContain("Faro");
    expect(m).toContain("Luis");
    expect(m).toContain("Centro");
  });

  it("el mensaje de 'Pregunta el precio' describe la pieza", () => {
    const m = mensajePrecio({ marca: "Toyota", modelo: "Corolla", anios: "2009–2013", pieza: "Calavera" });
    expect(m).toContain("Calavera");
    expect(m).toContain("Toyota Corolla 2009–2013");
  });
});

describe("pedidoSchema", () => {
  const base = {
    marca: "Nissan",
    modelo: "Sentra",
    anio: "2015",
    pieza: "Faro derecho",
    nombre: "Luis Pérez",
    whatsapp: "662 111 2233",
    ubicacion: "Centro",
  };

  it("acepta un pedido válido y limpia el teléfono", () => {
    const r = pedidoSchema.parse(base);
    expect(r.whatsapp).toBe("6621112233");
    expect(r.anio).toBe(2015);
  });

  it("rechaza teléfonos cortos, años absurdos y campos vacíos", () => {
    expect(pedidoSchema.safeParse({ ...base, whatsapp: "12345" }).success).toBe(false);
    expect(pedidoSchema.safeParse({ ...base, anio: "1800" }).success).toBe(false);
    expect(pedidoSchema.safeParse({ ...base, pieza: "   " }).success).toBe(false);
  });
});

describe("rangoAnios", () => {
  it("muestra un año o un rango", () => {
    expect(rangoAnios({ anio_desde: 2015, anio_hasta: 2015 })).toBe("2015");
    expect(rangoAnios({ anio_desde: 2013, anio_hasta: 2019 })).toBe("2013–2019");
  });
});
