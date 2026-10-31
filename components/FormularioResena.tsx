"use client";

import { Fragment, useActionState, useState } from "react";
import { enviarResenaAbierta, type ResultadoResena } from "@/app/(publico)/resenas/actions";
import { Guardar, inputCls } from "./admin/ui";
import { FotoOpcional } from "./FotoOpcional";
import { IconCheck, IconEstrella } from "./icons";

/** Botón "Escribir reseña" que despliega el formulario en la misma página. */
export function FormularioResena({ sinResenas }: { sinResenas: boolean }) {
  const [abierto, setAbierto] = useState(false);
  const [resultado, enviar] = useActionState<ResultadoResena, FormData>(enviarResenaAbierta, null);

  if (resultado?.ok) {
    return (
      <div className="mt-6 max-w-xl rounded-3xl bg-white p-6 sm:p-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-azul text-white">
          <IconCheck width={30} height={30} />
        </span>
        <h3 className="mt-4 font-display text-3xl font-extrabold">¡Gracias por tu reseña!</h3>
        <p className="mt-2 text-lg text-muted">Nos ayuda mucho a seguir mejorando.</p>
      </div>
    );
  }

  return (
    <div className={sinResenas ? "mt-5" : "mt-10"}>
      {!abierto && (
        <div className={sinResenas ? "" : "text-center"}>
          {sinResenas && (
            <p className="mb-5 max-w-lg text-lg text-muted">Cuéntanos cómo te fue con tu pieza.</p>
          )}
          <button
            type="button"
            onClick={() => setAbierto(true)}
            aria-expanded={false}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rojo px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-rojo-hondo"
          >
            <IconEstrella width={22} height={22} /> Escribir reseña
          </button>
        </div>
      )}

      {abierto && (
        <form action={enviar} className="paso max-w-xl space-y-5 rounded-3xl bg-white p-5 sm:p-8">
          <h3 className="font-display text-3xl font-extrabold leading-tight">¿Cómo te fue con tu pieza?</h3>
          {resultado && !resultado.ok && (
            <p role="alert" className="rounded-2xl bg-rojo/10 px-4 py-3 font-semibold text-rojo-hondo">
              {resultado.error}
            </p>
          )}
          {/* Honeypot anti-bots: las personas no lo ven */}
          <input type="text" name="sitio_web" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

          <fieldset>
            <legend className="mb-2 text-sm font-bold text-muted">Tu calificación</legend>
            <div className="estrellas">
              {[5, 4, 3, 2, 1].map((n) => (
                <Fragment key={n}>
                  <input type="radio" name="estrellas" id={`rs${n}`} value={n} required />
                  <label htmlFor={`rs${n}`} title={`${n} ${n === 1 ? "estrella" : "estrellas"}`}>
                    <span className="sr-only">
                      {n} {n === 1 ? "estrella" : "estrellas"}
                    </span>
                    <IconEstrella width={44} height={44} />
                  </label>
                </Fragment>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-muted">Tu comentario</span>
            <textarea className={inputCls} name="comentario" rows={4} maxLength={500} required placeholder="¿Qué pieza pediste y cómo fue el trato?" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-muted">¿Qué pieza compraste? (opcional)</span>
            <input className={inputCls} name="pieza" maxLength={80} placeholder="Faro derecho Nissan Sentra 2015" />
          </label>
          <FotoOpcional etiqueta="Agregar foto de tu pieza (opcional)" />
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-muted">Nombre que aparecerá en el sitio</span>
            <input className={inputCls} name="nombre" maxLength={40} required placeholder="Luis P." autoComplete="given-name" />
            <span className="mt-1 block text-sm text-muted">Puedes poner solo tu nombre y la inicial de tu apellido.</span>
          </label>
          <div>
            <FotoOpcional nombre="avatar" etiqueta="Agregar tu foto de perfil (opcional)" />
            <span className="mt-1 block text-sm text-muted">
              Se verá en un círculo pequeño junto a tu nombre. Si la subes, aceptas que aparezca en el sitio.
            </span>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-muted">Tu WhatsApp</span>
            <input className={inputCls} name="whatsapp" type="tel" inputMode="tel" required placeholder="10 dígitos" autoComplete="tel" />
            <span className="mt-1 block text-sm text-muted">No se publica. Solo lo usamos para confirmar tu compra.</span>
          </label>
          <Guardar>Enviar reseña</Guardar>
        </form>
      )}
    </div>
  );
}
