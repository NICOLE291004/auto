import Image from "next/image";
import { CLIENTES, type Cliente } from "@/lib/config";

function Tarjeta({ c, copia = false }: { c: Cliente; copia?: boolean }) {
  const base = "mr-4 shrink-0 rounded-2xl border-2 border-linea bg-white text-ink" + (copia ? " pasarela-copia" : "");
  if (!c.imagen) {
    return (
      <li aria-hidden={copia || undefined} className={`${base} flex w-64 items-center justify-center px-4 py-5 text-center font-display text-lg font-extrabold uppercase leading-tight tracking-wide`}>
        {c.nombre}
      </li>
    );
  }
  const logo = c.tipo === "logo";
  return (
    <li aria-hidden={copia || undefined} className={`${base} w-52 p-3`}>
      <div className={`relative h-28 w-full overflow-hidden rounded-xl ${logo ? "bg-white" : "bg-niebla"}`}>
        <Image
          src={c.imagen}
          alt={copia ? "" : c.nombre}
          fill
          sizes="208px"
          className={logo ? "object-contain p-2" : "object-cover"}
        />
      </div>
      <p className="mt-3 text-center font-display text-base font-extrabold uppercase leading-tight tracking-wide">{c.nombre}</p>
    </li>
  );
}

/**
 * Pasarela de empresas que nos compran piezas. Corre sola con CSS (sin JavaScript), se detiene al pasar el cursor
 * y, si la persona prefiere menos movimiento, se muestra quieta y en varias filas.
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
      <div className="pasarela mt-8 overflow-hidden">
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
