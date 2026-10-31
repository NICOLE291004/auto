import { Aviso } from "@/components/admin/Aviso";
import { Campo, Guardar, Opciones, inputCls } from "@/components/admin/ui";
import { MARCAS } from "@/lib/config";
import { ORIGENES } from "@/lib/admin/labels";
import { crearPedidoAdmin } from "../actions";

export default async function NuevoPedidoPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-extrabold">Nuevo pedido</h1>
      <p className="mb-4 text-muted">Captura rápida: lo esencial para no perder al cliente.</p>
      <Aviso error={error} />
      <form action={crearPedidoAdmin} className="space-y-4">
        <Campo etiqueta="Pieza">
          <input className={inputCls} name="pieza" placeholder="Faro derecho" required autoFocus />
        </Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo etiqueta="Marca">
            <input className={inputCls} name="marca" list="marcas" placeholder="Nissan" required />
            <datalist id="marcas">
              {MARCAS.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </Campo>
          <Campo etiqueta="Modelo">
            <input className={inputCls} name="modelo" placeholder="Sentra" required />
          </Campo>
        </div>
        <Campo etiqueta="Año">
          <input className={inputCls} name="anio" type="number" inputMode="numeric" placeholder="2015" />
        </Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo etiqueta="Nombre del cliente">
            <input className={inputCls} name="nombre" autoComplete="off" required />
          </Campo>
          <Campo etiqueta="WhatsApp">
            <input className={inputCls} name="whatsapp" type="tel" inputMode="tel" placeholder="10 dígitos" required />
          </Campo>
        </div>
        <div>
          <span className="mb-1.5 block text-sm font-bold text-muted">¿De dónde llegó?</span>
          <Opciones nombre="origen" opciones={ORIGENES} requerido />
        </div>
        <Campo etiqueta="Colonia o ciudad (opcional)">
          <input className={inputCls} name="ubicacion" />
        </Campo>
        <Campo etiqueta="Notas (opcional)">
          <textarea className={inputCls} name="notas" rows={2} />
        </Campo>
        <Guardar>Guardar pedido</Guardar>
      </form>
    </div>
  );
}
