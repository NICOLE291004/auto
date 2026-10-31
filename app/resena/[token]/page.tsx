import type { Metadata } from "next";
import { Fragment } from "react";
import { Guardar, inputCls } from "@/components/admin/ui";
import { FotoOpcional } from "@/components/FotoOpcional";
import { IconCheck, IconEstrella } from "@/components/icons";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { supabaseServicio } from "@/lib/supabase/admin";
import { enviarResena } from "./actions";

export const metadata: Metadata = {
  title: "Tu reseña | Alex Autopartes",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type Resena = { estado: string; pieza: string; nombre_sugerido: string };

export default async function ResenaPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { token } = await params;
  const { ok, error } = await searchParams;

  const db = supabaseServicio();
  const { data } = db
    ? await db.from("resenas").select("estado, pieza, nombre_sugerido").eq("token", token).maybeSingle()
    : { data: null };
  const resena = data as Resena | null;

  let contenido: React.ReactNode;
  if (!resena) {
    contenido = (
      <>
        <h1 className="font-display text-3xl font-extrabold">Este enlace no es válido</h1>
        <p className="mt-3 text-lg text-muted">Pídenos por WhatsApp que te mandemos uno nuevo.</p>
      </>
    );
  } else if (ok || resena.estado !== "solicitada") {
    contenido = (
      <>
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-azul text-white">
          <IconCheck width={30} height={30} />
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold">¡Gracias por tu reseña!</h1>
        <p className="mt-3 text-lg text-muted">Nos ayuda mucho a seguir mejorando.</p>
      </>
    );
  } else {
    contenido = (
      <form action={enviarResena.bind(null, token)} className="space-y-5">
        <div>
          <h1 className="font-display text-3xl font-extrabold leading-tight">¿Cómo te fue con tu pieza?</h1>
          <p className="mt-2 text-muted">{resena.pieza}</p>
        </div>
        {error && (
          <p role="alert" className="rounded-2xl bg-rojo/10 px-4 py-3 font-semibold text-rojo-hondo">
            {error === "datos"
              ? "Elige las estrellas y cuéntanos un poco más (mínimo 10 letras)."
              : error === "foto"
                ? "La foto debe ser JPG, PNG o WebP de máximo 5 MB."
                : "No pudimos guardar tu reseña. Intenta de nuevo."}
          </p>
        )}
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-muted">Tu calificación</legend>
          <div className="estrellas">
            {[5, 4, 3, 2, 1].map((n) => (
              <Fragment key={n}>
                <input type="radio" name="estrellas" id={`e${n}`} value={n} required />
                <label htmlFor={`e${n}`} title={`${n} ${n === 1 ? "estrella" : "estrellas"}`}>
                  <span className="sr-only">{n} {n === 1 ? "estrella" : "estrellas"}</span>
                  <IconEstrella width={44} height={44} />
                </label>
              </Fragment>
            ))}
          </div>
        </fieldset>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-muted">Tu comentario</span>
          <textarea
            className={inputCls}
            name="comentario"
            rows={4}
            maxLength={500}
            required
            placeholder="¿Qué pieza pediste y cómo fue el trato?"
          />
        </label>
        <FotoOpcional etiqueta="Agregar foto de tu pieza (opcional)" />
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-muted">Nombre que aparecerá en el sitio</span>
          <input className={inputCls} name="nombre" maxLength={40} required defaultValue={resena.nombre_sugerido} />
          <span className="mt-1 block text-sm text-muted">No publicamos tu teléfono. Puedes usar solo tu nombre.</span>
        </label>
        <div>
          <FotoOpcional nombre="avatar" etiqueta="Agregar tu foto de perfil (opcional)" />
          <span className="mt-1 block text-sm text-muted">
            Se verá en un círculo pequeño junto a tu nombre. Si la subes, aceptas que aparezca en el sitio.
          </span>
        </div>
        <Guardar>Enviar reseña</Guardar>
      </form>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-lg rounded-3xl border-2 border-linea bg-white p-6 sm:p-8">{contenido}</div>
      </main>
      <SiteFooter />
    </>
  );
}
