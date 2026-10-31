"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { IconAtras, IconFlecha } from "./icons";

/**
 * Fila horizontal controlada por la persona: flechas izquierda y derecha, o deslizar con el dedo o el mouse.
 * No se mueve sola. Los elementos de la lista llegan como children (<li>).
 */
export function PistaConFlechas({ children, etiqueta }: { children: React.ReactNode; etiqueta: string }) {
  const pista = useRef<HTMLUListElement>(null);
  const [puedeIr, setPuedeIr] = useState({ atras: false, adelante: true });

  const medir = useCallback(() => {
    const el = pista.current;
    if (!el) return;
    setPuedeIr({
      atras: el.scrollLeft > 4,
      adelante: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [medir]);

  function mover(direccion: 1 | -1) {
    const el = pista.current;
    if (!el) return;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direccion * el.clientWidth * 0.8, behavior: reducido ? "auto" : "smooth" });
  }

  const boton =
    "flex h-12 w-12 items-center justify-center rounded-full border-2 border-linea bg-white text-ink transition-colors enabled:hover:border-azul enabled:hover:text-azul disabled:cursor-not-allowed disabled:opacity-35";

  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <button type="button" onClick={() => mover(-1)} disabled={!puedeIr.atras} aria-label="Ver las anteriores" className={boton}>
          <IconAtras width={22} height={22} />
        </button>
        <button type="button" onClick={() => mover(1)} disabled={!puedeIr.adelante} aria-label="Ver más" className={boton}>
          <IconFlecha width={22} height={22} />
        </button>
      </div>
      <ul
        ref={pista}
        onScroll={medir}
        aria-label={etiqueta}
        className="-mx-4 flex scroll-px-4 snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (hijo) => hijo)}
      </ul>
    </div>
  );
}
