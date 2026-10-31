import Image from "next/image";
import { CLIENTES, type Cliente } from "@/lib/config";
import { PistaConFlechas } from "./PistaConFlechas";

/** Iniciales para las empresas que todavía no tienen logo: "David Munguia Refacciones" -> "DM". */
function iniciales(nombre: string) {
  const palabras = nombre.split(/\s+/).filter((p) => p.length > 2 || /^[A-Z]/.test(p));
  return palabras
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
}

function Tarjeta({ c }: { c: Cliente }) {
  const base =
    "flex w-56 shrink-0 snap-start flex-col rounded-3xl border border-linea bg-white p-3 shadow-[0_8px_24px_-16px_rgba(11,27,63,0.35)]";
  const nombre = (
    <p className="mt-3 flex flex-1 items-center justify-center px-1 pb-1 text-center font-marca text-[1.35rem] font-semibold uppercase leading-[1.05] tracking-[0.06em] text-ink">
      {c.nombre}
    </p>
  );

  if (!c.imagen) {
    return (
      <li className={base}>
        <div className="flex h-28 w-full items-center justify-center rounded-2xl bg-niebla">
          <span aria-hidden className="flex h-16 w-16 items-center justify-center rounded-full bg-azul font-marca text-3xl font-bold tracking-wide text-white">
            {iniciales(c.nombre)}
          </span>
        </div>
        {nombre}
      </li>
    );
  }

  const logo = c.tipo === "logo";
  return (
    <li className={base}>
      <div
        style={c.fondo ? { backgroundColor: c.fondo } : undefined}
        className={`relative h-28 w-full overflow-hidden rounded-2xl ${c.fondo ? "" : logo ? "bg-white ring-1 ring-linea" : "bg-niebla"}`}
      >
        <Image
          src={c.imagen}
          alt={c.nombre}
          fill
          sizes="224px"
          className={logo ? (c.fondo ? "object-contain" : "object-contain p-2") : "object-cover"}
        />
      </div>
      {nombre}
    </li>
  );
}

/**
 * Pasarela horizontal de empresas que confían en nosotros, controlada por la persona con flechas o deslizando.
 * Cada empresa puede llevar su logo o una foto de su taller (ver CLIENTES en lib/config.ts).
 */
export function EmpresasQueCompran() {
  return (
    <section className="border-y border-linea bg-white py-12 sm:py-16" aria-labelledby="empresas-titulo">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-widest text-azul">Trabajamos con</p>
        <h2
          id="empresas-titulo"
          className="mt-2 mb-6 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
        >
          Empresas que ya confían en nosotros.
        </h2>
        <PistaConFlechas etiqueta="Empresas que confían en nosotros">
          {CLIENTES.map((c) => (
            <Tarjeta key={c.nombre} c={c} />
          ))}
        </PistaConFlechas>
      </div>
    </section>
  );
}
