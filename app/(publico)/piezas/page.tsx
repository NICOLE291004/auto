import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { PiezaCard } from "@/components/PiezaCard";
import { MARCAS } from "@/lib/config";
import { getPiezasPublicas, rangoAnios } from "@/lib/piezas";
import { slugify } from "@/lib/slug";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Piezas disponibles | Autopartes usadas en Hermosillo",
  description:
    "Piezas usadas listas para consultar: faros, defensas, cofres y más. Autopartes usadas en Hermosillo con envíos a todo México. Pregunta el precio por WhatsApp.",
  alternates: { canonical: "/piezas" },
};

export default async function CatalogoPage() {
  const piezas = await getPiezasPublicas();
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl font-extrabold leading-none tracking-tight sm:text-6xl">
          Piezas disponibles
        </h1>
        <p className="mt-3 max-w-xl text-lg text-muted">
          Pregunta el precio de la pieza que te interese y te contestamos al momento.
        </p>

        <nav aria-label="Marcas" className="mt-6 flex flex-wrap gap-2">
          {MARCAS.map((m) => (
            <Link
              key={m}
              href={`/piezas/${slugify(m)}`}
              className="rounded-full border-2 border-linea px-4 py-2 text-[15px] font-semibold hover:border-azul hover:bg-niebla"
            >
              {m}
            </Link>
          ))}
        </nav>

        {piezas.length > 0 ? (
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {piezas.map((p) => (
              <PiezaCard key={p.id} p={{ ...p, anios: rangoAnios(p) }} />
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-3xl bg-niebla p-8">
            <h2 className="font-display text-2xl font-bold">Ahora mismo no hay piezas publicadas</h2>
            <p className="mt-2 text-muted">
              Dinos qué pieza necesitas y la conseguimos. Te respondemos por WhatsApp.
            </p>
            <Link
              href="/solicitar"
              className="mt-5 inline-flex rounded-2xl bg-rojo px-6 py-4 text-lg font-bold text-white hover:bg-rojo-hondo"
            >
              Solicita tu pieza
            </Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
