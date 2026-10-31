import Link from "next/link";
import { SearchStepper } from "@/components/SearchStepper";
import { TrustBadges } from "@/components/TrustBadges";
import { PhotoSlot } from "@/components/PhotoSlot";
import {
  IconBuscar,
  IconCheck,
  IconEntrega,
  IconEscudo,
  IconEstrella,
  IconFlecha,
  IconRed,
  IconWhatsApp,
} from "@/components/icons";
import { NEGOCIO } from "@/lib/config";
import { mensajePrecio, waLink } from "@/lib/whatsapp";

const PASOS = [
  {
    icon: IconBuscar,
    titulo: "Dinos qué pieza buscas",
    texto: "Marca, modelo, año y pieza. Si tienes una foto, mejor. Te toma menos de un minuto.",
  },
  {
    icon: IconRed,
    titulo: "Localizamos tu pieza",
    texto: "Con nuestra red de proveedores ubicamos la pieza que necesitas.",
  },
  {
    icon: IconEntrega,
    titulo: "Te confirmamos y te la entregamos",
    texto: "Te mandamos foto, precio y disponibilidad por WhatsApp. Tú decides. Enviamos a todo México; en Hermosillo también entregamos en persona.",
  },
];

// Datos de ejemplo. En la Fase 1 vienen de la vista pública de Supabase.
const PIEZAS = [
  { marca: "Nissan", modelo: "Sentra", anios: "2013–2019", pieza: "Faro derecho" },
  { marca: "Chevrolet", modelo: "Aveo", anios: "2012–2017", pieza: "Cofre" },
  { marca: "Toyota", modelo: "Corolla", anios: "2009–2013", pieza: "Calavera izquierda" },
  { marca: "Volkswagen", modelo: "Jetta", anios: "2011–2018", pieza: "Defensa delantera" },
];

const RESENAS = [
  { nombre: "Nombre del cliente", texto: "Texto de la reseña real: qué pieza pidió y cómo fue el trato.", pieza: "Pieza y vehículo" },
  { nombre: "Nombre del cliente", texto: "Texto de la reseña real: qué pieza pidió y cómo fue el trato.", pieza: "Pieza y vehículo" },
  { nombre: "Nombre del cliente", texto: "Texto de la reseña real: qué pieza pidió y cómo fue el trato.", pieza: "Pieza y vehículo" },
];

const btnSenal =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-rojo px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-rojo-hondo";

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-linea bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-azul font-display text-lg font-extrabold text-white">
              A
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">
              Alex <span className="text-azul">Autopartes</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-5">
            <Link href="/piezas" className="hidden px-2 text-[15px] font-semibold text-muted hover:text-ink sm:inline">
              Piezas disponibles
            </Link>
            <a href="#buscador" className="rounded-xl bg-rojo px-4 py-2.5 text-[15px] font-bold text-white hover:bg-rojo-hondo">
              Solicita tu pieza
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="px-3 pt-3 sm:px-6 sm:pt-6">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-azul px-5 pb-10 pt-12 sm:px-12 sm:pb-14 sm:pt-16">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.16]"
              style={{
                backgroundImage: "radial-gradient(#fff 1.2px, transparent 1.2px)",
                backgroundSize: "22px 22px",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-rojo"
            />
            <div className="relative grid items-end gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
              <div className="text-white">
                <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-3">
                  <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest">
                    <span className="h-2 w-2 rounded-full bg-white" /> Desde Hermosillo, Sonora
                  </p>
                  <p className="-rotate-3 rounded-lg border-2 border-white bg-rojo px-3 py-1.5 font-display text-base font-extrabold uppercase tracking-wide shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)]">
                    Envíos a todo México
                  </p>
                </div>
                <h1 className="font-display text-[clamp(2.9rem,9vw,5.6rem)] font-extrabold leading-[0.95] tracking-tight">
                  ¿Qué pieza <span className="underline decoration-white decoration-[6px] underline-offset-[10px]">buscas?</span>
                </h1>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-white/90 sm:text-xl">
                  Te conseguimos la pieza que buscas, con garantía. Tú pides en un minuto,
                  nosotros nos encargamos de todo y te la enviamos.
                </p>
                <p className="mt-4 max-w-md font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                  Tú tranquilo. <span className="text-senal">Nosotros nos encargamos de tus piezas.</span>
                </p>
                <div className="mt-6 hidden lg:block">
                  <TrustBadges dark />
                </div>
              </div>

              <SearchStepper />
            </div>
          </div>
        </section>

        {/* CIFRAS */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <dl className="grid grid-cols-3 gap-4 text-center sm:gap-8">
            {[
              [`+${NEGOCIO.aniosExperiencia}`, "años consiguiendo piezas"],
              ["100%", "por WhatsApp, sin vueltas"],
              ["Todo México", "envíos a cualquier estado"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="font-display text-3xl font-extrabold text-azul sm:text-5xl">{n}</dt>
                <dd className="mt-1 text-[13px] leading-snug text-muted sm:text-base">{l}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
          <h2 className="reveal max-w-xl font-display text-4xl font-extrabold leading-none tracking-tight sm:text-6xl">
            Así de simple.
          </h2>
          <p className="reveal mt-3 max-w-lg text-lg text-muted">
            Pides en un minuto, te confirmamos por WhatsApp y la recibes. Sin vueltas.
          </p>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {PASOS.map(({ icon: Icon, titulo, texto }, i) => (
              <li key={titulo} className="reveal rounded-3xl border-2 border-linea p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-niebla text-azul">
                    <Icon width={28} height={28} />
                  </span>
                  <span className="font-display text-5xl font-extrabold text-rojo">{i + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold leading-tight">{titulo}</h3>
                <p className="mt-2 leading-relaxed text-muted">{texto}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col items-start gap-3">
            <a href="#buscador" className={btnSenal}>
              Solicita tu pieza <IconFlecha width={20} height={20} />
            </a>
            <TrustBadges />
          </div>
        </section>

        {/* PIEZAS DISPONIBLES */}
        <section className="bg-niebla py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="reveal font-display text-4xl font-extrabold leading-none tracking-tight sm:text-6xl">
                  Piezas disponibles
                </h2>
                <p className="reveal mt-3 max-w-lg text-lg text-muted">
                  Piezas listas para consultar. Pregunta el precio y te contestamos al momento.
                </p>
              </div>
              <Link href="/piezas" className="hidden shrink-0 items-center gap-1.5 font-bold text-azul hover:underline sm:inline-flex">
                Ver todas <IconFlecha width={18} height={18} />
              </Link>
            </div>

            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PIEZAS.map((p) => (
                <li key={p.pieza} className="reveal lift overflow-hidden rounded-3xl bg-white">
                  <PhotoSlot label={`${p.pieza} ${p.marca} ${p.modelo}`} className="aspect-[4/3]" />
                  <div className="p-5">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-azul">
                      {p.marca} · {p.anios}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-bold leading-tight">
                      {p.pieza}
                    </h3>
                    <p className="text-muted">{p.modelo}</p>
                    <p className="mt-3 inline-block rounded-full bg-niebla px-3 py-1 text-xs font-semibold text-muted">
                      Disponibilidad por confirmar
                    </p>
                    <a
                      href={waLink(mensajePrecio(p))}
                      target="_blank"
                      rel="noopener"
                      className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 font-bold text-white hover:bg-azul"
                    >
                      <IconWhatsApp width={20} height={20} /> Pregunta el precio
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/piezas" className="mt-6 inline-flex items-center gap-1.5 font-bold text-azul sm:hidden">
              Ver todas <IconFlecha width={18} height={18} />
            </Link>
          </div>
        </section>

        {/* GARANTÍA */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="reveal grid items-center gap-8 rounded-[2rem] bg-ink p-7 text-white sm:p-12 lg:grid-cols-[auto_1fr_auto]">
            <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rojo text-white">
              <IconEscudo width={44} height={44} />
            </span>
            <div>
              <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-5xl">
                Tu pieza llega con garantía.
              </h2>
              <p className="mt-3 max-w-xl text-lg text-white/80">{NEGOCIO.garantia}</p>
            </div>
            <ul className="space-y-2 text-white/90">
              {["Atención directa por WhatsApp", "Te mandamos foto de tu pieza", "Un equipo que da la cara"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <IconCheck width={20} height={20} className="shrink-0 text-senal" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* QUIÉNES SOMOS */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 sm:px-6 sm:pb-20 md:grid-cols-[0.85fr_1fr]">
          <div className="reveal relative">
            <PhotoSlot label="el equipo Alex en el mostrador o taller" className="aspect-[4/5] rounded-[2rem]" />
            <div className="absolute -bottom-5 right-4 rounded-2xl bg-azul px-5 py-3 text-white shadow-xl sm:-right-4">
              <p className="font-display text-4xl font-extrabold leading-none">+{NEGOCIO.aniosExperiencia}</p>
              <p className="text-sm text-white/85">años de experiencia</p>
            </div>
          </div>
          <div className="reveal">
            <p className="font-mono text-[11px] uppercase tracking-widest text-azul">Quiénes somos</p>
            <h2 className="mt-2 font-display text-4xl font-extrabold leading-none tracking-tight sm:text-5xl">
              Somos Alex Autopartes, tu equipo de confianza.
            </h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
              <p>
                Llevamos años en esto y sabemos que comprar una pieza usada da desconfianza. Por eso
                trabajamos de frente: te explicamos cada paso, te mandamos fotos y
                respondemos por WhatsApp cuando nos necesites.
              </p>
              <p>
                Nos preocupamos por tus piezas como si fueran nuestras. Tú dinos qué necesitas y
                déjalo en manos del equipo Alex.
              </p>
              <p className="rounded-xl border border-dashed border-azul px-3 py-2 font-mono text-xs uppercase tracking-wider text-azul">
                Texto provisional · reemplazar con la historia real del equipo
              </p>
            </div>
          </div>
        </section>

        {/* RESEÑAS */}
        <section className="bg-niebla py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="reveal font-display text-4xl font-extrabold leading-none tracking-tight sm:text-5xl">
              Lo dicen quienes ya compraron.
            </h2>
            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {RESENAS.map((r, i) => (
                <li key={i} className="reveal rounded-3xl bg-white p-6">
                  <p className="mb-3 inline-block rounded-md border border-dashed border-azul px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-azul">
                    Reseña de ejemplo · reemplazar
                  </p>
                  <div className="flex gap-0.5 text-senal-hondo">
                    {Array.from({ length: 5 }).map((_, k) => <IconEstrella key={k} />)}
                  </div>
                  <p className="mt-3 text-lg leading-relaxed">{r.texto}</p>
                  <p className="mt-4 font-bold">{r.nombre}</p>
                  <p className="text-sm text-muted">{r.pieza}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <h2 className="reveal mx-auto max-w-2xl font-display text-4xl font-extrabold leading-none tracking-tight sm:text-6xl">
            Dinos qué necesitas. Nosotros la encontramos.
          </h2>
          <div className="mt-8 flex flex-col items-center gap-4">
            <a href="#buscador" className={btnSenal}>
              Solicita tu pieza <IconFlecha width={20} height={20} />
            </a>
            <TrustBadges />
          </div>
        </section>
      </main>

      <footer className="border-t border-linea">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 pb-24 text-sm text-muted sm:flex-row sm:justify-between sm:px-6">
          <p className="font-bold text-ink">{NEGOCIO.nombre} · {NEGOCIO.ciudad}</p>
          <p>Autopartes usadas con envíos a todo México.</p>
        </div>
      </footer>
    </>
  );
}
