import { describe, expect, it } from "vitest";
import { calcularExpiracion, diasRestantes, estaVigente, DIAS_VIGENCIA } from "../lib/expiry";
import { buscarCoincidencias, coincide, mismaPieza, palabrasClave, type PedidoAbierto, type PiezaVigente } from "../lib/matching";
import { calcularStats, rangoDesde } from "../lib/stats";
import { pedidoEdicionSchema, pedidoNuevoSchema, piezaSchema, yunkeroSchema } from "../lib/admin/schemas";

const DIA = 24 * 60 * 60 * 1000;

describe("expiración", () => {
  const publicada = new Date("2026-03-01T12:00:00Z");

  it("vence a los 10 días de publicada", () => {
    expect(DIAS_VIGENCIA).toBe(10);
    expect(calcularExpiracion(publicada).toISOString()).toBe("2026-03-11T12:00:00.000Z");
  });

  it("es vigente justo antes de vencer y deja de serlo al vencer", () => {
    const expira = calcularExpiracion(publicada);
    const p = { estado: "activa", expira_en: expira };
    expect(estaVigente(p, new Date(expira.getTime() - 1))).toBe(true);
    expect(estaVigente(p, expira)).toBe(false);
    expect(estaVigente(p, new Date(expira.getTime() + DIA))).toBe(false);
  });

  it("una pieza vendida o pendiente nunca es vigente", () => {
    const expira = calcularExpiracion(publicada);
    const antes = new Date(publicada.getTime() + DIA);
    expect(estaVigente({ estado: "vendida", expira_en: expira }, antes)).toBe(false);
    expect(estaVigente({ estado: "pendiente_revision", expira_en: expira }, antes)).toBe(false);
  });

  it("cuenta los días restantes sin bajar de 0", () => {
    const expira = calcularExpiracion(publicada);
    expect(diasRestantes(expira, publicada)).toBe(10);
    expect(diasRestantes(expira, new Date(publicada.getTime() + 9.5 * DIA))).toBe(1);
    expect(diasRestantes(expira, new Date(expira.getTime() + 5 * DIA))).toBe(0);
  });
});

describe("coincidencias", () => {
  const pedido: PedidoAbierto = {
    id: "p1",
    marca_slug: "nissan",
    modelo_slug: "sentra",
    anio: 2015,
    pieza: "Faro",
  };
  const pieza: PiezaVigente = {
    id: "z1",
    marca_slug: "nissan",
    modelo_slug: "sentra",
    anio_desde: 2013,
    anio_hasta: 2019,
    pieza: "Faro derecho",
  };

  it("coincide con misma marca, modelo, año en rango y tipo de pieza", () => {
    expect(coincide(pedido, pieza)).toBe(true);
  });

  it("no coincide si cambia la marca, el modelo o el año fuera de rango", () => {
    expect(coincide({ ...pedido, marca_slug: "toyota" }, pieza)).toBe(false);
    expect(coincide({ ...pedido, modelo_slug: "versa" }, pieza)).toBe(false);
    expect(coincide({ ...pedido, anio: 2012 }, pieza)).toBe(false);
    expect(coincide({ ...pedido, anio: 2020 }, pieza)).toBe(false);
  });

  it("los extremos del rango de años sí coinciden", () => {
    expect(coincide({ ...pedido, anio: 2013 }, pieza)).toBe(true);
    expect(coincide({ ...pedido, anio: 2019 }, pieza)).toBe(true);
  });

  it("sin año en el pedido no se descarta por año", () => {
    expect(coincide({ ...pedido, anio: null }, pieza)).toBe(true);
  });

  it("no coincide con otro tipo de pieza", () => {
    expect(coincide({ ...pedido, pieza: "Defensa" }, pieza)).toBe(false);
  });

  it("compara tipos de pieza sin acentos, plurales ni mayúsculas", () => {
    expect(palabrasClave("Faros Delanteros")).toEqual(["faro", "delantero"]);
    expect(mismaPieza("Transmisión", "transmision automatica")).toBe(true);
    expect(mismaPieza("FARO", "faros")).toBe(true);
    expect(mismaPieza("faro derecho", "faro izquierdo")).toBe(false);
    expect(mismaPieza("", "faro")).toBe(false);
  });

  it("agrupa por pedido y omite los pedidos sin piezas", () => {
    const otro = { ...pedido, id: "p2", marca_slug: "ford" };
    const res = buscarCoincidencias([pedido, otro], [pieza, { ...pieza, id: "z2", pieza: "Faro izquierdo" }]);
    expect(res).toHaveLength(1);
    expect(res[0].pedido.id).toBe("p1");
    expect(res[0].piezas.map((z) => z.id)).toEqual(["z1", "z2"]);
  });
});

describe("estadísticas del dashboard", () => {
  const ahora = new Date("2026-03-31T12:00:00Z");
  const hace = (dias: number) => new Date(ahora.getTime() - dias * DIA).toISOString();
  const origenes = ["anuncio", "marketplace", "google"];
  const pedidos = [
    { estado: "vendido", origen: "anuncio", ganancia: 500, created_at: hace(1) },
    { estado: "vendido", origen: "anuncio", ganancia: 300, created_at: hace(3) },
    { estado: "vendido", origen: "google", ganancia: 200, created_at: hace(20) },
    { estado: "perdido", origen: "marketplace", ganancia: null, created_at: hace(2) },
    { estado: "nuevo", origen: "marketplace", ganancia: null, created_at: hace(1) },
    { estado: "cotizado", origen: "anuncio", ganancia: null, created_at: hace(60) },
  ];

  it("cuenta los pedidos de la semana", () => {
    expect(calcularStats(pedidos, rangoDesde("mes", ahora), origenes, ahora).pedidosSemana).toBe(4);
  });

  it("calcula tasa de cierre y ganancia del periodo", () => {
    const s = calcularStats(pedidos, rangoDesde("mes", ahora), origenes, ahora);
    expect(s.totalPedidos).toBe(5);
    expect(s.vendidos).toBe(3);
    expect(s.perdidos).toBe(1);
    expect(s.tasaCierre).toBeCloseTo(3 / 5);
    expect(s.gananciaTotal).toBe(1000);
  });

  it("el rango 'todo' incluye pedidos antiguos", () => {
    const s = calcularStats(pedidos, null, origenes, ahora);
    expect(s.totalPedidos).toBe(6);
  });

  it("agrupa las ventas por origen, de más a menos", () => {
    const s = calcularStats(pedidos, rangoDesde("mes", ahora), origenes, ahora);
    expect(s.ventasPorOrigen).toEqual([
      { origen: "anuncio", ventas: 2, ganancia: 800 },
      { origen: "google", ventas: 1, ganancia: 200 },
      { origen: "marketplace", ventas: 0, ganancia: 0 },
    ]);
  });

  it("sin pedidos no divide entre cero", () => {
    const s = calcularStats([], rangoDesde("semana", ahora), origenes, ahora);
    expect(s.tasaCierre).toBe(0);
    expect(s.gananciaTotal).toBe(0);
  });
});

describe("validación del panel", () => {
  it("acepta la captura rápida de un pedido y limpia el teléfono", () => {
    const r = pedidoNuevoSchema.parse({
      pieza: "Faro",
      marca: "Nissan",
      modelo: "Sentra",
      anio: "",
      nombre: "Luis",
      whatsapp: "(662) 111-2233",
      ubicacion: "",
      origen: "marketplace",
      notas: "",
    });
    expect(r.whatsapp).toBe("6621112233");
    expect(r.anio).toBeNull();
    expect(r.ubicacion).toBeNull();
  });

  it("rechaza un origen que no existe", () => {
    const r = pedidoNuevoSchema.safeParse({
      pieza: "Faro", marca: "Nissan", modelo: "Sentra", nombre: "Luis", whatsapp: "6621112233", origen: "radio",
    });
    expect(r.success).toBe(false);
  });

  it("la edición del pedido acepta dinero vacío como null", () => {
    const r = pedidoEdicionSchema.parse({ estado: "vendido", precio_venta: "1500", costo_yunkero: "", notas: "" });
    expect(r.precio_venta).toBe(1500);
    expect(r.costo_yunkero).toBeNull();
  });

  it("la pieza exige que el año final no sea menor al inicial", () => {
    const base = { pieza: "Faro", marca: "Nissan", modelo: "Sentra", precio_yunkero: "", yunkero_id: "" };
    expect(piezaSchema.safeParse({ ...base, anio_desde: "2015", anio_hasta: "2013" }).success).toBe(false);
    const ok = piezaSchema.parse({ ...base, anio_desde: "2013", anio_hasta: "2019" });
    expect(ok.yunkero_id).toBeNull();
    expect(ok.precio_yunkero).toBeNull();
  });

  it("el yunkero puede guardarse sin WhatsApp pero no con uno inválido", () => {
    expect(yunkeroSchema.parse({ nombre: "Don Pepe", whatsapp: "", especialidad: "", notas: "" }).whatsapp).toBeNull();
    expect(yunkeroSchema.safeParse({ nombre: "Don Pepe", whatsapp: "123" }).success).toBe(false);
  });
});
