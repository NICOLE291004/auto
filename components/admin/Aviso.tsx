const OK: Record<string, string> = {
  creado: "Pedido guardado.",
  guardado: "Cambios guardados.",
  creada: "Pieza publicada. Vence en 10 días.",
  guardada: "Pieza actualizada.",
  renovada: "Pieza renovada por 10 días más.",
  vendida: "Pieza marcada como vendida.",
  eliminada: "Pieza eliminada.",
  eliminado: "Yunkero eliminado.",
};

const ERRORES: Record<string, string> = {
  datos: "Revisa los datos: hay un campo vacío o con formato incorrecto.",
  guardar: "No se pudo guardar. Intenta de nuevo.",
  foto: "La foto debe ser JPG, PNG o WebP de máximo 5 MB.",
};

export function Aviso({ ok, error }: { ok?: string; error?: string }) {
  if (error) {
    return (
      <p role="alert" className="mb-4 rounded-2xl bg-rojo/10 px-4 py-3 font-semibold text-rojo-hondo">
        {ERRORES[error] ?? "Ocurrió un error."}
      </p>
    );
  }
  if (ok && OK[ok]) {
    return (
      <p role="status" className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 font-semibold text-emerald-800">
        {OK[ok]}
      </p>
    );
  }
  return null;
}
