import Link from "next/link";
import { Logo } from "@/components/Logo";
import { NEGOCIO } from "@/lib/config";
import { getPiezasPublicas } from "@/lib/piezas";
import { waLink } from "@/lib/whatsapp";
import { PLANTILLA_WHATSAPP } from "@/lib/whatsapp";

export async function SiteHeader({ solicitarHref = "/solicitar" }: { solicitarHref?: string }) {
  // El enlace a "Piezas disponibles" solo aparece cuando hay piezas vigentes; vacío se leería como negocio abandonado.
  const hayPiezas = (await getPiezasPublicas({ limite: 1 })).length > 0;
  return (
    <header className="sticky top-0 z-40 border-b border-linea bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-3 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <Logo className="h-9 w-auto shrink-0 sm:h-11" />
            <span className="whitespace-nowrap font-display text-lg font-extrabold tracking-tight sm:text-xl">
              <span className="text-rojo">Alex</span> <span className="text-azul">Autopartes</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-5">
            {hayPiezas && (
              <Link href="/piezas" className="hidden px-2 text-[15px] font-semibold text-muted hover:text-ink sm:inline">
                Piezas disponibles
              </Link>
            )}
            <Link href={solicitarHref} className="whitespace-nowrap rounded-xl bg-rojo px-3 py-2.5 text-sm font-bold text-white hover:bg-rojo-hondo sm:px-4 sm:text-[15px]">
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
          <p>
            Autopartes usadas con envíos a todo México.{" "}
            <a href={waLink(PLANTILLA_WHATSAPP)} target="_blank" rel="noopener" className="font-bold text-azul underline">
              Escríbenos por WhatsApp
            </a>
          </p>
        </div>
      </footer>
  );
}
