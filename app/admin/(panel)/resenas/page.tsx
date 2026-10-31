import Image from "next/image";
import Link from "next/link";
import { Aviso } from "@/components/admin/Aviso";
import { IconEstrella } from "@/components/icons";
import { requireAdmin } from "@/lib/auth";
import { aprobarResena, rechazarResena } from "./actions";

type Fila = {
  id: string;
  pedido_id: string;
  pieza: string;
  nombre_publico: string | null;
  nombre_sugerido: string;
  estrellas: number | null;
  comentario: string | null;
  estado: "solicitada" | "pendiente" | "aprobada" | "rechazada";
  enviada_en: string | null;
  foto_url: string | null;
};

const TITULOS = {
  pendiente: "Por aprobar",
  aprobada: "Publicadas en el sitio",
  solicitada: "Enlace enviado, sin respuesta",
  rechazada: "Rechazadas",
} as const;

export default async function ResenasPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { db } = await requireAdmin();
  const { ok, error } = await searchParams;
  const { data } = await db.from("resenas").select("*").order("created_at", { ascending: false });
  const filas = (data ?? []) as Fila[];

  const boton = "rounded-xl px-4 py-2.5 font-bold";
  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-extrabold">Reseñas</h1>
      <p className="mb-4 text-muted">
        Tú decides cuáles se publican. El enlace se pide desde un pedido marcado como vendido.
      </p>
      <Aviso ok={ok === "aprobada" ? "resena_aprobada" : ok === "rechazada" ? "resena_rechazada" : ok} error={error} />

      {filas.length === 0 && (
        <p className="rounded-3xl bg-white p-6 text-muted">
          Aún no hay reseñas. Abre un pedido vendido y toca “Pedir reseña”.
        </p>
      )}

      {(Object.keys(TITULOS) as (keyof typeof TITULOS)[]).map((estado) => {
        const lista = filas.filter((f) => f.estado === estado);
        if (lista.length === 0) return null;
        return (
          <section key={estado} className="mb-6">
            <h2 className="mb-2 font-display text-xl font-bold">
              {TITULOS[estado]} ({lista.length})
            </h2>
            <ul className="space-y-3">
              {lista.map((r) => (
                <li key={r.id} className="rounded-3xl bg-white p-4">
                  {r.foto_url && (
                    <a href={r.foto_url} target="_blank" rel="noopener" className="mb-3 block">
                      <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-niebla">
                        <Image src={r.foto_url} alt={`Foto de ${r.pieza}`} fill sizes="(min-width:768px) 600px, 100vw" className="object-cover" />
                      </span>
                    </a>
                  )}
                  {r.estrellas && (
                    <div className="flex gap-0.5 text-senal-hondo" aria-label={`${r.estrellas} de 5 estrellas`}>
                      {Array.from({ length: r.estrellas }).map((_, k) => (
                        <IconEstrella key={k} />
                      ))}
                    </div>
                  )}
                  {r.comentario && <p className="mt-2 text-lg leading-snug">{r.comentario}</p>}
                  <p className="mt-2 font-bold">{r.nombre_publico ?? r.nombre_sugerido}</p>
                  <p className="text-sm text-muted">
                    <Link href={`/admin/pedidos/${r.pedido_id}`} className="underline">
                      {r.pieza}
                    </Link>
                  </p>
                  {estado === "pendiente" && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <form action={aprobarResena.bind(null, r.id)}>
                        <button className={`${boton} w-full bg-azul text-white hover:bg-azul-hondo`}>Aprobar</button>
                      </form>
                      <form action={rechazarResena.bind(null, r.id)}>
                        <button className={`${boton} w-full border-2 border-linea hover:border-rojo`}>Rechazar</button>
                      </form>
                    </div>
                  )}
                  {estado === "aprobada" && (
                    <form action={rechazarResena.bind(null, r.id)} className="mt-3">
                      <button className={`${boton} border-2 border-linea hover:border-rojo`}>Quitar del sitio</button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
