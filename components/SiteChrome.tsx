import Link from "next/link";
import { NEGOCIO } from "@/lib/config";

export function SiteHeader({ solicitarHref = "/solicitar" }: { solicitarHref?: string }) {
  return (
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
            <Link href={solicitarHref} className="rounded-xl bg-rojo px-4 py-2.5 text-[15px] font-bold text-white hover:bg-rojo-hondo">
              Solicita tu pieza
            </Link>
          </nav>
        </div>
      </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-linea">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 pb-24 text-sm text-muted sm:flex-row sm:justify-between sm:px-6">
          <p className="font-bold text-ink">{NEGOCIO.nombre} · {NEGOCIO.ciudad}</p>
          <p>Autopartes usadas con envíos a todo México.</p>
        </div>
      </footer>
  );
}
