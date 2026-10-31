import Image from "next/image";
import { IconWhatsApp } from "./icons";
import { PhotoSlot } from "./PhotoSlot";
import { mensajePrecio, waLink } from "@/lib/whatsapp";

export type PiezaCardData = {
  marca: string;
  modelo: string;
  anios: string;
  pieza: string;
  foto_url?: string | null;
};

/** Tarjeta pública. Nunca muestra precio ni datos del yunkero. */
export function PiezaCard({ p, className = "reveal" }: { p: PiezaCardData; className?: string }) {
  return (
    <li className={`lift overflow-hidden rounded-3xl bg-white ${className}`}>
      {p.foto_url ? (
        <div className="relative aspect-[4/3] bg-niebla">
          <Image
            src={p.foto_url}
            alt={`${p.pieza} ${p.marca} ${p.modelo} ${p.anios}`}
            fill
            sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <PhotoSlot label={`${p.pieza} ${p.marca} ${p.modelo}`} className="aspect-[4/3]" />
      )}
      <div className="p-5">
        <p className="font-mono text-[11px] uppercase tracking-widest text-azul">
          {p.marca} · {p.anios}
        </p>
        <h3 className="mt-1 font-display text-2xl font-bold leading-tight">{p.pieza}</h3>
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
  );
}
