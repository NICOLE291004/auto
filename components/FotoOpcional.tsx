"use client";

import { useState } from "react";
import { IconCamara } from "./icons";

/** Campo de foto opcional con el nombre del archivo elegido. */
export function FotoOpcional({
  nombre = "foto",
  etiqueta = "Agregar foto (opcional)",
}: {
  nombre?: string;
  etiqueta?: string;
}) {
  const [archivo, setArchivo] = useState<string | null>(null);
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-linea p-3 text-[15px] font-semibold text-azul hover:bg-niebla">
      <IconCamara width={22} height={22} />
      <span className="min-w-0 truncate">{archivo ? `Foto lista: ${archivo}` : etiqueta}</span>
      <input
        type="file"
        name={nombre}
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => setArchivo(e.target.files?.[0]?.name ?? null)}
      />
    </label>
  );
}
