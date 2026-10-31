import { CLIENTES } from "@/lib/config";

/**
 * Pasarela de empresas que nos compran piezas. Corre sola con CSS (sin JavaScript), se detiene al pasar el cursor
 * y, si la persona prefiere menos movimiento, se muestra quieta y en varias filas.
 */
export function EmpresasQueCompran() {
  const tarjeta =
    "mr-4 shrink-0 rounded-2xl border-2 border-linea bg-white px-6 py-4 font-display text-xl font-extrabold uppercase tracking-wide text-ink";
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
          {CLIENTES.map((nombre) => (
            <li key={nombre} className={tarjeta}>
              {nombre}
            </li>
          ))}
          {/* Segunda copia para que el recorrido se repita sin saltos; se oculta a lectores de pantalla */}
          {CLIENTES.map((nombre) => (
            <li key={`copia-${nombre}`} aria-hidden className={`${tarjeta} pasarela-copia`}>
              {nombre}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
