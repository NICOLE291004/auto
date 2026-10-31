import { Campo, Guardar, inputCls } from "./ui";
import { MARCAS } from "@/lib/config";
import type { Pieza, Yunkero } from "@/lib/admin/data";

export function PiezaForm({
  action,
  pieza,
  yunkeros,
}: {
  action: (formData: FormData) => Promise<void>;
  pieza?: Pieza;
  yunkeros: Pick<Yunkero, "id" | "nombre">[];
}) {
  const anioActual = new Date().getFullYear();
  return (
    <form action={action} className="space-y-4">
      <Campo etiqueta={pieza?.foto_url ? "Cambiar foto (opcional)" : "Foto"}>
        <input
          className={inputCls}
          type="file"
          name="foto"
          accept="image/jpeg,image/png,image/webp"
        />
      </Campo>
      <Campo etiqueta="Pieza">
        <input className={inputCls} name="pieza" placeholder="Faro derecho" defaultValue={pieza?.pieza} required />
      </Campo>
      <div className="grid grid-cols-2 gap-3">
        <Campo etiqueta="Marca">
          <input className={inputCls} name="marca" list="marcas" defaultValue={pieza?.marca} required />
          <datalist id="marcas">
            {MARCAS.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </Campo>
        <Campo etiqueta="Modelo">
          <input className={inputCls} name="modelo" defaultValue={pieza?.modelo} required />
        </Campo>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Campo etiqueta="Año desde">
          <input
            className={inputCls}
            name="anio_desde"
            type="number"
            inputMode="numeric"
            min={1950}
            max={anioActual + 1}
            defaultValue={pieza?.anio_desde}
            required
          />
        </Campo>
        <Campo etiqueta="Año hasta">
          <input
            className={inputCls}
            name="anio_hasta"
            type="number"
            inputMode="numeric"
            min={1950}
            max={anioActual + 1}
            defaultValue={pieza?.anio_hasta}
            required
          />
        </Campo>
      </div>
      <div className="rounded-3xl bg-niebla p-4">
        <p className="mb-3 text-sm font-bold text-muted">Privado: no se muestra en el sitio</p>
        <div className="space-y-3">
          <Campo etiqueta="Yunkero">
            <select className={inputCls} name="yunkero_id" defaultValue={pieza?.yunkero_id ?? ""}>
              <option value="">Sin yunkero</option>
              {yunkeros.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.nombre}
                </option>
              ))}
            </select>
          </Campo>
          <Campo etiqueta="Precio del yunkero (referencia, opcional)">
            <input
              className={inputCls}
              name="precio_yunkero"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              defaultValue={pieza?.precio_yunkero ?? ""}
            />
          </Campo>
        </div>
      </div>
      <Guardar>{pieza ? "Guardar cambios" : "Publicar pieza"}</Guardar>
    </form>
  );
}
