import type { Metadata } from "next";
import { SearchStepper } from "@/components/SearchStepper";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Solicita tu pieza | Alex Autopartes",
  description: "Dinos marca, modelo, año y pieza. Te respondemos por WhatsApp con envíos a todo México.",
  alternates: { canonical: "/solicitar" },
};

export default async function SolicitarPage({
  searchParams,
}: {
  searchParams: Promise<{ marca?: string; modelo?: string }>;
}) {
  const { marca, modelo } = await searchParams;
  return (
    <>
      <SiteHeader />
      <main className="px-3 py-6 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-2xl rounded-[2rem] bg-azul px-4 pb-8 pt-10 sm:px-10">
          <h1 className="mb-6 font-display text-4xl font-extrabold leading-none tracking-tight text-white sm:text-5xl">
            ¿Qué pieza buscas?
          </h1>
          <SearchStepper inicial={{ marca, modelo }} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
