import { Logo } from "@/components/Logo";
import Link from "next/link";
import { cerrarSesion } from "@/app/admin/login/actions";
import { IconCampana, IconEntrega, IconEstrella, IconGente, IconLista, IconPanel } from "@/components/icons";

const ITEMS = [
  { href: "/admin", label: "Inicio", icon: IconPanel },
  { href: "/admin/pedidos", label: "Pedidos", icon: IconLista },
  { href: "/admin/piezas", label: "Piezas", icon: IconEntrega },
  { href: "/admin/yunkeros", label: "Yunkeros", icon: IconGente },
  { href: "/admin/coincidencias", label: "Coincid.", icon: IconCampana },
  { href: "/admin/resenas", label: "Reseñas", icon: IconEstrella },
] as const;

export function AdminShell({
  children,
  coincidencias,
  resenasPendientes,
}: {
  children: React.ReactNode;
  coincidencias: number;
  resenasPendientes: number;
}) {
  return (
    <div className="min-h-dvh bg-niebla/60 pb-24 md:pb-0 md:pl-56">
      <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-linea bg-white md:inset-y-0 md:left-0 md:right-auto md:w-56 md:border-r md:border-t-0">
        <div className="hidden items-center gap-2.5 p-5 md:flex">
          <Logo className="h-11 w-auto" />
          <span className="font-display text-lg font-extrabold">Panel <span className="text-rojo">Alex</span></span>
        </div>
        <nav className="flex md:flex-col md:px-3">
          {ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="relative flex flex-1 flex-col items-center gap-0.5 px-1 py-2.5 text-[11px] font-semibold text-muted hover:text-azul md:flex-none md:flex-row md:gap-3 md:rounded-xl md:px-3 md:py-3 md:text-base md:hover:bg-niebla"
            >
              <Icon width={22} height={22} />
              {label}
              {(() => {
                const n = href === "/admin/coincidencias" ? coincidencias : href === "/admin/resenas" ? resenasPendientes : 0;
                return n > 0 ? (
                  <span className="absolute right-[18%] top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rojo px-1 text-[11px] font-bold text-white md:static md:ml-auto">
                    {n}
                  </span>
                ) : null;
              })()}
            </Link>
          ))}
        </nav>
        <form action={cerrarSesion} className="hidden p-3 md:absolute md:bottom-0 md:block md:w-full">
          <button className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-muted hover:bg-niebla">
            Cerrar sesión
          </button>
        </form>
      </aside>
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6">
        <div className="mb-4 flex justify-end md:hidden">
          <form action={cerrarSesion}>
            <button className="text-sm font-semibold text-muted">Cerrar sesión</button>
          </form>
        </div>
        {children}
      </div>
    </div>
  );
}
