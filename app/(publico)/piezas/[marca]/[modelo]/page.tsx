import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoPieza } from "@/components/SeoPieza";
import { combinacionesCuradas, resolverMarca, resolverModelo } from "@/lib/catalogo";
import { getPiezasPublicas } from "@/lib/piezas";

export const revalidate = 300;

type Props = { params: Promise<{ marca: string; modelo: string }> };

export function generateStaticParams() {
  return combinacionesCuradas().map(({ marca, modelo }) => ({ marca, modelo }));
}

async function resolver(params: Props["params"]) {
  const { marca: marcaSlug, modelo: modeloSlug } = await params;
  const marca = await resolverMarca(marcaSlug);
  const modelo = marca ? await resolverModelo(marca, modeloSlug) : null;
  return { marca, modelo, marcaSlug, modeloSlug };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { marca, modelo, marcaSlug, modeloSlug } = await resolver(params);
  if (!marca || !modelo) return {};
  return {
    title: `Autopartes usadas ${marca} ${modelo} en Hermosillo | Alex Autopartes`,
    description: `Piezas usadas para ${marca} ${modelo} en Hermosillo, Sonora. Te conseguimos la pieza con garantía y envíos a todo México. Pregunta por WhatsApp.`,
    alternates: { canonical: `/piezas/${marcaSlug}/${modeloSlug}` },
  };
}

export default async function ModeloPage({ params }: Props) {
  const { marca, modelo, marcaSlug, modeloSlug } = await resolver(params);
  if (!marca || !modelo) notFound();
  const piezas = await getPiezasPublicas({ marcaSlug, modeloSlug });
  return (
    <SeoPieza
      titulo={`${marca} ${modelo}`}
      marca={marca}
      modelo={modelo}
      marcaSlug={marcaSlug}
      piezas={piezas}
    />
  );
}
