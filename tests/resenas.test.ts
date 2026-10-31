import { describe, expect, it } from "vitest";
import { descripcionPieza, mensajeResena, nombreSugerido, resenaSchema, urlResena } from "../lib/resenas";

describe("reseñas", () => {
  it("sugiere un nombre público sin apellido completo", () => {
    expect(nombreSugerido("Luis Pérez García")).toBe("Luis P.");
    expect(nombreSugerido("  mario  ")).toBe("Mario");
    expect(nombreSugerido("ANA lópez")).toBe("Ana L.");
    expect(nombreSugerido("")).toBe("Cliente");
  });

  it("describe la pieza con vehículo y año si existe", () => {
    expect(descripcionPieza({ pieza: "faro derecho", marca: "Nissan", modelo: "Sentra", anio: 2015 })).toBe(
      "Faro derecho · Nissan Sentra 2015",
    );
    expect(descripcionPieza({ pieza: "Cofre", marca: "Chevrolet", modelo: "Aveo", anio: null })).toBe(
      "Cofre · Chevrolet Aveo",
    );
  });

  it("arma el enlace sin doble diagonal y el mensaje con el primer nombre", () => {
    const url = urlResena("https://auto-nu.vercel.app/", "abc123");
    expect(url).toBe("https://auto-nu.vercel.app/resena/abc123");
    const m = mensajeResena("Luis Pérez", url);
    expect(m).toContain("Hola Luis,");
    expect(m).toContain(url);
  });

  it("valida estrellas de 1 a 5, comentario con contenido y nombre", () => {
    const ok = { estrellas: "5", comentario: "Muy buen servicio, rápido.", nombre: "Luis P." };
    expect(resenaSchema.parse(ok).estrellas).toBe(5);
    expect(resenaSchema.safeParse({ ...ok, estrellas: "0" }).success).toBe(false);
    expect(resenaSchema.safeParse({ ...ok, estrellas: "6" }).success).toBe(false);
    expect(resenaSchema.safeParse({ ...ok, comentario: "ok" }).success).toBe(false);
    expect(resenaSchema.safeParse({ ...ok, comentario: "x".repeat(501) }).success).toBe(false);
    expect(resenaSchema.safeParse({ ...ok, nombre: " " }).success).toBe(false);
  });
});
