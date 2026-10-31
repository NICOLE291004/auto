import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { extractor, IAnoConfigurada, validarExtraccion } from "../lib/ai/extraer";
import { extraccionAFicha, fichaCompleta } from "../lib/ai/ficha";
import { firmaValida, verificarSuscripcion } from "../lib/whatsapp-cloud/firma";
import { buscarYunkeroPorNumero, extraerMensajes, mismoNumero } from "../lib/whatsapp-cloud/mensajes";
import { GET, POST } from "../app/api/webhooks/whatsapp/route";

const firmar = (cuerpo: string, secreto: string) =>
  "sha256=" + createHmac("sha256", secreto).update(cuerpo).digest("hex");

describe("extracción con IA (esquema y ficha)", () => {
  const base = {
    pieza: "Faro derecho",
    marca: "Nissan",
    modelo: "Sentra",
    anio_desde: 2013,
    anio_hasta: 2019,
    precio_yunkero: 800,
    notas: null,
    confianza: 0.9,
  };

  it("acepta una extracción completa", () => {
    expect(validarExtraccion(base)).toEqual(base);
  });

  it("si solo viene un extremo del rango de años, iguala el otro", () => {
    expect(validarExtraccion({ ...base, anio_hasta: null }).anio_hasta).toBe(2013);
    expect(validarExtraccion({ ...base, anio_desde: null }).anio_desde).toBe(2019);
  });

  it("rechaza respuestas fuera de esquema", () => {
    expect(() => validarExtraccion({ ...base, confianza: 3 })).toThrow();
    expect(() => validarExtraccion({ ...base, anio_desde: 1800 })).toThrow();
    expect(() => validarExtraccion({ pieza: "Faro" })).toThrow();
  });

  it("los datos faltantes quedan vacíos en la ficha y la ficha incompleta no se publica sola", () => {
    const parcial = validarExtraccion({ ...base, modelo: null, anio_desde: null, anio_hasta: null });
    expect(extraccionAFicha(parcial)).toMatchObject({ modelo: "", anio_desde: "", pieza: "Faro derecho" });
    expect(fichaCompleta(parcial)).toBe(false);
    expect(fichaCompleta(validarExtraccion(base))).toBe(true);
  });

  it("el extractor aún no está conectado y lo dice con claridad", async () => {
    await expect(extractor.extraer({ tipo: "texto", texto: "faro sentra" })).rejects.toBeInstanceOf(IAnoConfigurada);
  });
});

describe("firma y verificación del webhook", () => {
  it("acepta la firma correcta y rechaza las demás", () => {
    const cuerpo = '{"a":1}';
    expect(firmaValida(cuerpo, firmar(cuerpo, "secreto"), "secreto")).toBe(true);
    expect(firmaValida(cuerpo, firmar(cuerpo, "otro"), "secreto")).toBe(false);
    expect(firmaValida('{"a":2}', firmar(cuerpo, "secreto"), "secreto")).toBe(false);
    expect(firmaValida(cuerpo, null, "secreto")).toBe(false);
    expect(firmaValida(cuerpo, "sha256=zzzz", "secreto")).toBe(false);
    expect(firmaValida(cuerpo, "abc", "secreto")).toBe(false);
  });

  it("devuelve el challenge solo con modo y token correctos", () => {
    const p = (o: Record<string, string>) => new URLSearchParams(o);
    expect(verificarSuscripcion(p({ "hub.mode": "subscribe", "hub.verify_token": "t", "hub.challenge": "123" }), "t")).toBe("123");
    expect(verificarSuscripcion(p({ "hub.mode": "subscribe", "hub.verify_token": "x", "hub.challenge": "123" }), "t")).toBeNull();
    expect(verificarSuscripcion(p({ "hub.mode": "unsubscribe", "hub.verify_token": "t", "hub.challenge": "123" }), "t")).toBeNull();
  });
});

describe("mensajes entrantes", () => {
  const payload = {
    object: "whatsapp_business_account",
    entry: [
      {
        changes: [
          {
            field: "messages",
            value: {
              messages: [
                { id: "wamid.1", from: "5216621112233", type: "text", text: { body: "Faro Sentra 2015, $800" } },
                { id: "wamid.2", from: "5216621112233", type: "image", image: { id: "media1", caption: "Cofre Aveo" } },
                { id: "wamid.3", from: "5216621112233", type: "audio" },
              ],
            },
          },
          { field: "messages", value: { statuses: [{ id: "x", status: "read" }] } },
        ],
      },
    ],
  };

  it("lee texto, foto con pie y otros tipos; ignora estados de entrega", () => {
    const m = extraerMensajes(payload);
    expect(m).toHaveLength(3);
    expect(m[0]).toEqual({ id: "wamid.1", de: "5216621112233", tipo: "text", texto: "Faro Sentra 2015, $800", mediaId: null });
    expect(m[1]).toMatchObject({ tipo: "image", texto: "Cofre Aveo", mediaId: "media1" });
    expect(m[2].tipo).toBe("otro");
  });

  it("un payload raro no rompe nada", () => {
    expect(extraerMensajes(null)).toEqual([]);
    expect(extraerMensajes({ entry: "x" })).toEqual([]);
    expect(extraerMensajes({})).toEqual([]);
  });

  it("empata al yunkero por los últimos 10 dígitos", () => {
    expect(mismoNumero("5216621112233", "6621112233")).toBe(true);
    expect(mismoNumero("526621112233", "(662) 111-2233")).toBe(true);
    expect(mismoNumero("5216621112233", "6621112234")).toBe(false);
    expect(mismoNumero("123", "123")).toBe(false);
    const ys = [{ nombre: "A", whatsapp: null }, { nombre: "B", whatsapp: "6621112233" }];
    expect(buscarYunkeroPorNumero("5216621112233", ys)?.nombre).toBe("B");
    expect(buscarYunkeroPorNumero("5210000000000", ys)).toBeNull();
  });
});

describe("ruta /api/webhooks/whatsapp", () => {
  const original = { ...process.env };
  beforeEach(() => {
    delete process.env.WHATSAPP_VERIFY_TOKEN;
    delete process.env.WHATSAPP_APP_SECRET;
  });
  afterEach(() => {
    process.env = { ...original };
  });

  const url = "http://localhost/api/webhooks/whatsapp";

  it("responde 503 si no está configurada", async () => {
    expect((await GET(new NextRequest(url))).status).toBe(503);
    expect((await POST(new NextRequest(url, { method: "POST", body: "{}" }))).status).toBe(503);
  });

  it("verifica la suscripción con el token correcto y rechaza con otro", async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = "tok";
    const bien = await GET(new NextRequest(`${url}?hub.mode=subscribe&hub.verify_token=tok&hub.challenge=987`));
    expect(bien.status).toBe(200);
    expect(await bien.text()).toBe("987");
    const mal = await GET(new NextRequest(`${url}?hub.mode=subscribe&hub.verify_token=no&hub.challenge=987`));
    expect(mal.status).toBe(403);
  });

  it("rechaza POST sin firma válida y acepta el firmado", async () => {
    process.env.WHATSAPP_APP_SECRET = "s3cret";
    const cuerpo = JSON.stringify({ entry: [] });
    const sinFirma = await POST(new NextRequest(url, { method: "POST", body: cuerpo }));
    expect(sinFirma.status).toBe(401);
    const ok = await POST(
      new NextRequest(url, { method: "POST", body: cuerpo, headers: { "x-hub-signature-256": firmar(cuerpo, "s3cret") } }),
    );
    expect(ok.status).toBe(200);
  });

  it("firma válida con JSON roto devuelve 400", async () => {
    process.env.WHATSAPP_APP_SECRET = "s3cret";
    const cuerpo = "no es json";
    const r = await POST(
      new NextRequest(url, { method: "POST", body: cuerpo, headers: { "x-hub-signature-256": firmar(cuerpo, "s3cret") } }),
    );
    expect(r.status).toBe(400);
  });
});
