import { MARCAS, MODELOS } from "./config";
import { slugify } from "./slug";
import { getPiezasPublicas } from "./piezas";

/** Nombre legible de una marca a partir de su slug (lista curada o piezas publicadas). */
export async function resolverMarca(slug: string): Promise<string | null> {
  const curada = MARCAS.find((m) => slugify(m) === slug);
  if (curada) return curada;
  const [p] = await getPiezasPublicas({ marcaSlug: slug, limite: 1 });
  return p?.marca ?? null;
}

export async function resolverModelo(marca: string, slug: string): Promise<string | null> {
  const curado = (MODELOS[marca] ?? []).find((m) => slugify(m) === slug);
  if (curado) return curado;
  const [p] = await getPiezasPublicas({ marcaSlug: slugify(marca), modeloSlug: slug, limite: 1 });
  return p?.modelo ?? null;
}

/** Todas las combinaciones marca/modelo curadas, para generateStaticParams y sitemap. */
export function combinacionesCuradas() {
  return MARCAS.flatMap((marca) =>
    (MODELOS[marca] ?? []).map((modelo) => ({
      marca: slugify(marca),
      modelo: slugify(modelo),
      marcaNombre: marca,
      modeloNombre: modelo,
    })),
  );
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100").replace(/\/$/, "");
}
