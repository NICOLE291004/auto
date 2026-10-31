"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type FotoGaleria = { src: string; alt: string };

const CADA_MS = 4500;
const PAUSA_TRAS_TOCAR_MS = 9000;

/**
 * Pasarela de fotos reales: avanza sola, se desliza con el dedo y tiene puntos para elegir.
 * No avanza sola si la persona prefiere menos movimiento. Todas las fotos son cuadradas y del mismo tamaño (public/fotos).
 */
export function GaleriaEquipo({ fotos, className = "" }: { fotos: FotoGaleria[]; className?: string }) {
  const pista = useRef<HTMLUListElement>(null);
  const [actual, setActual] = useState(0);
  const pausado = useRef(false);
  const temporizador = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reducido = useRef(false);

  const irA = useCallback(
    (i: number) => {
      const el = pista.current;
      if (!el) return;
      const destino = ((i % fotos.length) + fotos.length) % fotos.length;
      el.scrollTo({ left: destino * el.clientWidth, behavior: reducido.current ? "auto" : "smooth" });
    },
    [fotos.length],
  );

  useEffect(() => {
    reducido.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducido.current || fotos.length < 2) return;
    const id = setInterval(() => {
      if (document.hidden || pausado.current) return;
      const el = pista.current;
      if (!el) return;
      irA(Math.round(el.scrollLeft / el.clientWidth) + 1);
    }, CADA_MS);
    return () => {
      clearInterval(id);
      clearTimeout(temporizador.current);
    };
  }, [fotos.length, irA]);

  // Si la persona toca o pasa el cursor, deja de avanzar sola por un rato.
  const pausar = () => {
    pausado.current = true;
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => {
      pausado.current = false;
    }, PAUSA_TRAS_TOCAR_MS);
  };

  return (
    <div className={`relative overflow-hidden rounded-[2rem] bg-niebla ${className}`} onPointerDown={pausar} onMouseEnter={pausar} onFocus={pausar}>
      <ul
        ref={pista}
        aria-label="Fotos de nuestro trabajo"
        onScroll={(e) => {
          const el = e.currentTarget;
          setActual(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {fotos.map((f, i) => (
          <li key={f.src} className="relative h-full w-full shrink-0 snap-center" aria-hidden={i !== actual}>
            <Image
              src={f.src}
              alt={f.alt}
              fill
              sizes="(min-width:768px) 40vw, 100vw"
              className="object-cover"
              priority={i === 0}
            />
          </li>
        ))}
      </ul>
      {fotos.length > 1 && (
        <div className="absolute bottom-4 left-4 flex gap-2">
          {fotos.map((f, i) => (
            <button
              key={f.src}
              type="button"
              onClick={() => {
                pausar();
                irA(i);
              }}
              aria-label={`Ver foto ${i + 1} de ${fotos.length}`}
              aria-current={i === actual}
              className={`h-2.5 rounded-full transition-all ${i === actual ? "w-6 bg-azul" : "w-2.5 bg-white/90 ring-1 ring-ink/20"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
