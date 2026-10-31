"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";

export const inputCls =
  "w-full rounded-2xl border-2 border-linea bg-white px-4 py-3.5 text-lg text-ink placeholder:text-muted/60 focus:border-azul focus:outline-none";

export function Campo({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-muted">{etiqueta}</span>
      {children}
    </label>
  );
}

export function Guardar({
  children = "Guardar",
  variante = "rojo",
}: {
  children?: React.ReactNode;
  variante?: "rojo" | "ink";
}) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className={`w-full rounded-2xl px-6 py-4 text-lg font-bold text-white transition-colors disabled:opacity-50 ${
        variante === "rojo" ? "bg-rojo hover:bg-rojo-hondo" : "bg-ink hover:bg-azul"
      }`}
    >
      {pending ? "Guardando…" : children}
    </button>
  );
}

/** Opciones tipo botón con radio nativo, fáciles de tocar con el pulgar. */
export function Opciones({
  nombre,
  opciones,
  inicial,
  requerido = false,
}: {
  nombre: string;
  opciones: readonly { value: string; label: string }[];
  inicial?: string;
  requerido?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((o, i) => (
        <label key={o.value}>
          <input
            type="radio"
            name={nombre}
            value={o.value}
            defaultChecked={o.value === inicial}
            required={requerido && i === 0}
            className="peer sr-only"
          />
          <span className="block cursor-pointer rounded-full border-2 border-linea bg-white px-4 py-2.5 text-[15px] font-semibold peer-checked:border-azul peer-checked:bg-azul peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-azul">
            {o.label}
          </span>
        </label>
      ))}
    </div>
  );
}

const mxn = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

/** Ganancia en vivo mientras se escriben precio de venta y costo. */
export function GananciaLive({ venta, costo }: { venta?: number | null; costo?: number | null }) {
  const [v, setV] = useState(venta?.toString() ?? "");
  const [c, setC] = useState(costo?.toString() ?? "");
  const g = v !== "" && c !== "" ? Number(v) - Number(c) : null;
  return (
    <div className="space-y-3">
      <Campo etiqueta="Precio de venta">
        <input
          className={inputCls}
          name="precio_venta"
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          value={v}
          onChange={(e) => setV(e.target.value)}
        />
      </Campo>
      <Campo etiqueta="Costo del yunkero">
        <input
          className={inputCls}
          name="costo_yunkero"
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          value={c}
          onChange={(e) => setC(e.target.value)}
        />
      </Campo>
      <p className="rounded-2xl bg-niebla px-4 py-3 text-lg font-bold">
        Ganancia:{" "}
        <span className={g !== null && g < 0 ? "text-rojo" : "text-azul"}>
          {g === null ? "—" : mxn.format(g)}
        </span>
      </p>
    </div>
  );
}
