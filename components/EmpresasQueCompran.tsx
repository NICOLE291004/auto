import Image from "next/image";
import { CLIENTES, type Cliente } from "@/lib/config";

/** Iniciales para las empresas que todavía no tienen logo: "David Munguia Refacciones" -> "DM". */
function iniciales(nombre: string) {
  const palabras = nombre.split(/\s+/).filter((p) => p.length > 2 || /^[A-Z]/.test(p));
  return palabras
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
}

function Tarjeta({ c, copia = false }: { c: Cliente; copia?: boolean }) {
  const base =
    "mr-4 flex w-56 shrink-0 flex-col rounded-3xl border border-linea bg-white p-3 shadow-[0_8px_24px_-16px_rgba(11,27,63,0.35)]" +
    (copia ? " pasarela-copia" : "");
  const nombre = (
    <p className="mt-3 flex flex-1 items-center justify-center px-1 pb-1 text-center font-marca text-[1.35rem] font-semibold uppercase leading-[1.05] tracking-[0.06em] text-ink">
      {c.nombre}
    </p>
  );

  if (!c.imagen) {
    return (
      <li aria-hidden={copia || undefined} className={base}>
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
    <li aria-hidden={copia || undefined} className={base}>
      <div className={`relative h-28 w-full overflow-hidden rounded-2xl ${logo ? "bg-white ring-1 ring-linea" : "bg-niebla"}`}>
        <Image
          src={c.imagen}
          alt={copia ? "" : c.nombre}
          fill
          sizes="224px"
          className={logo ? "object-contain p-2" : "object-cover"}
        />
      </div>
      {nombre}
    </li>
  );
}

/**
 * Pasarela horizontal de empresas que nos compran piezas. Corre sola con CSS (sin JavaScript) y se detiene al pasar
 * el cursor. Si la persona prefiere menos movimiento, no corre sola pero se desliza a mano.
 * Cada empresa puede llevar su logo o una foto de su taller (ver CLIENTES en lib/config.ts).
 */
export function EmpresasQueCompran() {
  return (
    <section className="border-y border-linea bg-white py-12 sm:py-16" aria-labelledby="empresas-titulo">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-widest text-azul">Nos compran piezas</p>
        <h2
          id="empresas-titulo"
          className="mt-2 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
        >
          Empresas que ya confían en nosotros.
        </h2>
      </div>
      <div className="pasarela mt-8">
        <ul className="pasarela-pista" aria-label="Empresas que nos compran piezas">
          {CLIENTES.map((c) => (
            <Tarjeta key={c.nombre} c={c} />
          ))}
          {/* Segunda copia para que el recorrido se repita sin saltos; se oculta a lectores de pantalla */}
          {CLIENTES.map((c) => (
            <Tarjeta key={`copia-${c.nombre}`} c={c} copia />
          ))}
        </ul>
      </div>
    </section>
  );
}
