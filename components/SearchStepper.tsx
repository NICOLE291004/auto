"use client";

import { useState, useTransition } from "react";
import { crearPedido } from "@/app/solicitar/actions";
import { MARCAS, MODELOS, PIEZAS_COMUNES } from "@/lib/config";
import { mensajePedido, waLink } from "@/lib/whatsapp";
import { TrustBadges } from "./TrustBadges";
import { IconAtras, IconCamara, IconCheck, IconFlecha, IconWhatsApp } from "./icons";

type Datos = {
  marca: string;
  modelo: string;
  anio: string;
  pieza: string;
  nombre: string;
  whatsapp: string;
  ubicacion: string;
};

const VACIO: Datos = { marca: "", modelo: "", anio: "", pieza: "", nombre: "", whatsapp: "", ubicacion: "" };
const TOTAL = 5;
const ANIOS = Array.from({ length: 2027 - 1985 }, (_, i) => String(2026 - i));

const PASOS = [
  { titulo: "¿De qué marca es tu vehículo?", campo: "marca" },
  { titulo: "¿Qué modelo es?", campo: "modelo" },
  { titulo: "¿De qué año?", campo: "anio" },
  { titulo: "¿Qué pieza necesitas?", campo: "pieza" },
  { titulo: "¿A dónde te respondemos?", campo: "contacto" },
] as const;

const inputCls =
  "w-full rounded-2xl border-2 border-linea bg-white px-4 py-3.5 text-lg font-medium text-ink placeholder:text-muted/60 focus:border-azul focus:outline-none";
const chipCls =
  "rounded-full border-2 border-linea bg-white px-4 py-2 text-[15px] font-semibold text-ink transition-colors hover:border-azul hover:bg-niebla active:bg-niebla";
const botonCls =
  "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rojo px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-rojo-hondo disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto";

export function SearchStepper({ inicial }: { inicial?: { marca?: string; modelo?: string } }) {
  const conVehiculo = Boolean(inicial?.marca && inicial?.modelo);
  const [paso, setPaso] = useState(conVehiculo ? 2 : inicial?.marca ? 1 : 0);
  const [d, setD] = useState<Datos>({ ...VACIO, marca: inicial?.marca ?? "", modelo: inicial?.modelo ?? "" });
  const [foto, setFoto] = useState<File | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviando, iniciarEnvio] = useTransition();

  const set = (k: keyof Datos, v: string) => setD((p) => ({ ...p, [k]: v }));
  const siguiente = () => setPaso((p) => Math.min(p + 1, TOTAL - 1));

  const elegir = (k: keyof Datos, v: string) => {
    set(k, v);
    setTimeout(siguiente, 140);
  };

  const listo =
    paso === 0 ? d.marca.trim() :
    paso === 1 ? d.modelo.trim() :
    paso === 2 ? d.anio :
    paso === 3 ? d.pieza.trim() :
    d.nombre.trim() && d.whatsapp.replace(/\D/g, "").length >= 10 && d.ubicacion.trim();

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!listo) return;
    if (paso < TOTAL - 1) return siguiente();
    setError(null);
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    fd.set("marca", d.marca);
    fd.set("modelo", d.modelo);
    fd.set("anio", d.anio);
    fd.set("pieza", d.pieza);
    if (foto) fd.set("foto", foto);
    iniciarEnvio(async () => {
      const r = await crearPedido(fd);
      if (r.ok) setEnviado(true);
      else setError(r.error);
    });
  }

  return (
    <div
      id="buscador"
      className="relative scroll-mt-24 rounded-[1.75rem] bg-white p-5 text-ink shadow-[0_30px_60px_-30px_rgba(5,15,50,0.7)] sm:p-8"
    >
      {/* Orificio de etiqueta: guiño a la etiqueta de pieza de mostrador */}
      <span aria-hidden className="absolute right-6 top-0 h-5 w-5 -translate-y-1/2 rounded-full bg-azul ring-4 ring-white" />

      {enviado ? (
        <Exito d={d} />
      ) : (
        <form onSubmit={enviar} noValidate>
          <div className="mb-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted">
            <span>Tu pedido</span>
            <span aria-live="polite">Paso {paso + 1} de {TOTAL}</span>
          </div>
          <div
            className="mb-6 h-2 overflow-hidden rounded-full bg-niebla"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={TOTAL}
            aria-valuenow={paso + 1}
            aria-label="Progreso de tu pedido"
          >
            <div
              className="h-full rounded-full bg-azul transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${((paso + 1) / TOTAL) * 100}%` }}
            />
          </div>

          <div key={paso} className="paso min-h-[240px]">
            <h2 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">
              {PASOS[paso].titulo}
            </h2>

            {paso === 0 && (
              <div className="mt-5 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {MARCAS.map((m) => (
                    <button key={m} type="button" className={chipCls} onClick={() => elegir("marca", m)}>
                      {m}
                    </button>
                  ))}
                </div>
                <input
                  className={inputCls}
                  placeholder="¿Otra marca? Escríbela"
                  value={d.marca}
                  onChange={(e) => set("marca", e.target.value)}
                  aria-label="Marca"
                  autoComplete="off"
                />
              </div>
            )}

            {paso === 1 && (
              <div className="mt-5 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(MODELOS[d.marca] ?? []).map((m) => (
                    <button key={m} type="button" className={chipCls} onClick={() => elegir("modelo", m)}>
                      {m}
                    </button>
                  ))}
                </div>
                <input
                  className={inputCls}
                  placeholder={`Modelo de tu ${d.marca || "vehículo"}`}
                  value={d.modelo}
                  onChange={(e) => set("modelo", e.target.value)}
                  aria-label="Modelo"
                  autoComplete="off"
                  autoFocus
                />
              </div>
            )}

            {paso === 2 && (
              <div className="mt-5">
                <select
                  className={inputCls}
                  value={d.anio}
                  onChange={(e) => set("anio", e.target.value)}
                  aria-label="Año"
                >
                  <option value="">Elige el año</option>
                  {ANIOS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <p className="mt-3 text-sm text-muted">Si no estás seguro, elige el más cercano.</p>
              </div>
            )}

            {paso === 3 && (
              <div className="mt-5 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {PIEZAS_COMUNES.map((p) => (
                    <button key={p} type="button" className={chipCls} onClick={() => elegir("pieza", p)}>
                      {p}
                    </button>
                  ))}
                </div>
                <input
                  className={inputCls}
                  placeholder="¿Otra pieza? Descríbela (ej. faro derecho)"
                  value={d.pieza}
                  onChange={(e) => set("pieza", e.target.value)}
                  aria-label="Pieza"
                  autoComplete="off"
                />
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-linea p-3 text-[15px] font-semibold text-azul hover:bg-niebla">
                  <IconCamara width={22} height={22} />
                  {foto ? `Foto lista: ${foto.name}` : "Agregar foto (opcional)"}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            )}

            {paso === 4 && (
              <div className="mt-5 grid gap-3">
                <input type="text" name="sitio_web" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
                <input
                  className={inputCls}
                  placeholder="Tu nombre"
                  value={d.nombre}
                  onChange={(e) => set("nombre", e.target.value)}
                  aria-label="Nombre"
                  name="nombre"
                  autoComplete="name"
                  autoFocus
                />
                <input
                  className={inputCls}
                  placeholder="Tu WhatsApp (10 dígitos)"
                  value={d.whatsapp}
                  onChange={(e) => set("whatsapp", e.target.value)}
                  aria-label="WhatsApp"
                  name="whatsapp"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                />
                <input
                  className={inputCls}
                  placeholder="Colonia o ciudad"
                  value={d.ubicacion}
                  onChange={(e) => set("ubicacion", e.target.value)}
                  aria-label="Colonia o ciudad"
                  name="ubicacion"
                  autoComplete="address-level2"
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {paso > 0 && (
                <button
                  type="button"
                  onClick={() => setPaso((p) => p - 1)}
                  className="inline-flex items-center gap-1.5 rounded-xl px-2 py-2 text-[15px] font-semibold text-muted hover:text-ink"
                >
                  <IconAtras width={18} height={18} /> Atrás
                </button>
              )}
            </div>
            <button type="submit" className={botonCls} disabled={!listo || enviando}>
              {enviando ? "Enviando…" : paso === TOTAL - 1 ? "Enviar mi pedido" : "Continuar"}
              <IconFlecha width={20} height={20} />
            </button>
          </div>
          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-rojo/10 px-4 py-3 text-[15px] font-semibold text-rojo-hondo">
              {error}
            </p>
          )}
          <div className="mt-5 border-t border-linea pt-4">
            <TrustBadges />
          </div>
        </form>
      )}
    </div>
  );
}

function Exito({ d }: { d: Datos }) {
  return (
    <div className="paso text-center sm:text-left">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-azul text-white sm:mx-0">
        <IconCheck width={30} height={30} />
      </span>
      <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight">
        Listo, {d.nombre.split(" ")[0]}. Ya tenemos tu pedido.
      </h2>
      <p className="mt-2 text-lg text-muted">
        {d.pieza} para {d.marca} {d.modelo} {d.anio}. Toca el botón para mandarnos el resumen
        por WhatsApp y empezar la búsqueda ahora.
      </p>
      <a
        href={waLink(mensajePedido(d))}
        target="_blank"
        rel="noopener"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-wa px-6 py-4 text-lg font-bold text-white hover:brightness-95 sm:w-auto"
      >
        <IconWhatsApp width={24} height={24} /> Abrir WhatsApp con mi pedido
      </a>
      <div className="mt-5 border-t border-linea pt-4">
        <TrustBadges />
      </div>
    </div>
  );
}
