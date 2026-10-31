"use client";

import Link from "next/link";
import { useRef } from "react";
import { PiezaCard, type PiezaCardData } from "./PiezaCard";
import { IconAtras, IconFlecha } from "./icons";

/** Pasarela horizontal de piezas: se desliza con el dedo y tiene flechas en pantallas grandes. */
export function CarruselPiezas({ piezas }: { piezas: PiezaCardData[] }) {
  const pista = useRef<HTMLUListElement>(null);

  function mover(direccion: 1 | -1) {
    const el = pista.current;
    if (!el) return;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direccion * el.clientWidth * 0.8, behavior: reducido ? "auto" : "smooth" });
  }

  const flecha =
    "hidden h-12 w-12 items-center justify-center rounded-full border-2 border-linea bg-white text-ink hover:border-azul hover:text-azul md:flex";

  return (
    <div className="mt-8">
      <div className="mb-4 hidden justify-end gap-2 md:flex">
        <button type="button" onClick={() => mover(-1)} aria-label="Piezas anteriores" className={flecha}>
          <IconAtras width={22} height={22} />
        </button>
        <button type="button" onClick={() => mover(1)} aria-label="Más piezas" className={flecha}>
          <IconFlecha width={22} height={22} />
        </button>
      </div>
      <ul
        ref={pista}
        aria-label="Piezas disponibles"
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {piezas.map((p) => (
          <PiezaCard
            key={`${p.marca}-${p.modelo}-${p.pieza}-${p.anios}`}
            p={p}
            className="w-[78%] shrink-0 snap-start sm:w-[320px]"
          />
        ))}
        <li className="flex w-[60%] shrink-0 snap-start items-center sm:w-[240px]">
          <Link
            href="/piezas"
            className="flex h-full min-h-48 w-full flex-col items-center justify-center gap-3 rounded-3xl bg-azul p-6 text-center font-display text-2xl font-bold text-white hover:bg-azul-hondo"
          >
            Ver todas las piezas
            <IconFlecha width={28} height={28} />
          </Link>
        </li>
      </ul>
    </div>
  );
}
