import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { PiezaCard } from "./PiezaCard";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { TrustBadges } from "./TrustBadges";
import { rangoAnios, type PiezaPublica } from "@/lib/piezas";
import { siteUrl } from "@/lib/catalogo";

type Props = {
  titulo: string; // "Nissan Sentra"
  marca: string;
  modelo?: string;
  marcaSlug: string;
  piezas: PiezaPublica[];
  modelosRelacionados?: { nombre: string; href: string }[];
};

/** Vista compartida de las páginas /piezas/[marca] y /piezas/[marca]/[modelo]. */
export function SeoPieza({ titulo, marca, modelo, marcaSlug, piezas, modelosRelacionados }: Props) {
  const solicitar = `/solicitar?marca=${encodeURIComponent(marca)}${
    modelo ? `&modelo=${encodeURIComponent(modelo)}` : ""
  }`;
  const base = siteUrl();

  const faq = [
    {
      q: `¿Cómo consigo una pieza usada para mi ${titulo}?`,
      a: "Dinos la pieza y el año de tu vehículo en el formulario o por WhatsApp. Te confirmamos disponibilidad y precio.",
    },
    {
      q: "¿Hacen envíos?",
      a: "Sí, enviamos a todo México. En Hermosillo, Sonora, también entregamos en persona.",
    },
    { q: "¿Las piezas tienen garantía?", a: "Sí, tu pieza llega con garantía." },
  ];

  return (
    <>
      <SiteHeader />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: base },
                { "@type": "ListItem", position: 2, name: "Piezas", item: `${base}/piezas` },
                { "@type": "ListItem", position: 3, name: marca, item: `${base}/piezas/${marcaSlug}` },
                ...(modelo ? [{ "@type": "ListItem", position: 4, name: titulo }] : []),
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }}
      />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <nav aria-label="Ruta" className="mb-4 text-sm text-muted">
          <Link href="/piezas" className="hover:text-ink">Piezas</Link> /{" "}
          <Link href={`/piezas/${marcaSlug}`} className="hover:text-ink">{marca}</Link>
          {modelo && <> / <span className="text-ink">{modelo}</span></>}
        </nav>
        <h1 className="font-display text-4xl font-extrabold leading-none tracking-tight sm:text-6xl">
          Autopartes usadas {titulo} en Hermosillo
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          ¿Necesitas una pieza para tu {titulo}? Te la conseguimos, con garantía y envíos a todo México.
          Tú pides en un minuto y nosotros nos encargamos.
        </p>
        <div className="mt-6 flex flex-col items-start gap-3">
          <Link
            href={solicitar}
            className="inline-flex rounded-2xl bg-rojo px-6 py-4 text-lg font-bold text-white hover:bg-rojo-hondo"
          >
            Solicita tu pieza
          </Link>
          <TrustBadges />
        </div>

        {piezas.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-3xl font-extrabold">Piezas disponibles para {titulo}</h2>
            <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {piezas.map((p) => (
                <PiezaCard key={p.id} p={{ ...p, anios: rangoAnios(p) }} />
              ))}
            </ul>
          </section>
        )}

        {modelosRelacionados && modelosRelacionados.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-3xl font-extrabold">Modelos {marca}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {modelosRelacionados.map((m) => (
                <li key={m.href}>
                  <Link
                    href={m.href}
                    className="inline-block rounded-full border-2 border-linea px-4 py-2 font-semibold hover:border-azul hover:bg-niebla"
                  >
                    {m.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-14 max-w-3xl">
          <h2 className="font-display text-3xl font-extrabold">Preguntas frecuentes</h2>
          <dl className="mt-4 space-y-5">
            {faq.map((f) => (
              <div key={f.q}>
                <dt className="font-bold">{f.q}</dt>
                <dd className="mt-1 text-muted">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
