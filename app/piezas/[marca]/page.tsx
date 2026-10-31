import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoPieza } from "@/components/SeoPieza";
import { resolverMarca } from "@/lib/catalogo";
import { MARCAS, MODELOS } from "@/lib/config";
import { getPiezasPublicas } from "@/lib/piezas";
import { slugify } from "@/lib/slug";

export const revalidate = 300;

type Props = { params: Promise<{ marca: string }> };

export function generateStaticParams() {
  return MARCAS.map((m) => ({ marca: slugify(m) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { marca: slug } = await params;
  const marca = await resolverMarca(slug);
  if (!marca) return {};
  return {
    title: `Autopartes usadas ${marca} en Hermosillo | Alex Autopartes`,
    description: `Piezas usadas para ${marca} en Hermosillo, Sonora: te las conseguimos con garantía y envíos a todo México. Pregunta por WhatsApp.`,
    alternates: { canonical: `/piezas/${slug}` },
  };
}

export default async function MarcaPage({ params }: Props) {
  const { marca: slug } = await params;
  const marca = await resolverMarca(slug);
  if (!marca) notFound();
  const piezas = await getPiezasPublicas({ marcaSlug: slug });
  return (
    <SeoPieza
      titulo={marca}
      marca={marca}
      marcaSlug={slug}
      piezas={piezas}
      modelosRelacionados={(MODELOS[marca] ?? []).map((m) => ({
        nombre: m,
        href: `/piezas/${slug}/${slugify(m)}`,
      }))}
    />
  );
}
