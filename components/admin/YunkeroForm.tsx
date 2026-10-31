import { Campo, Guardar, inputCls } from "./ui";
import type { Yunkero } from "@/lib/admin/data";

export function YunkeroForm({
  action,
  yunkero,
}: {
  action: (formData: FormData) => Promise<void>;
  yunkero?: Yunkero;
}) {
  return (
    <form action={action} className="space-y-4">
      <Campo etiqueta="Nombre">
        <input className={inputCls} name="nombre" defaultValue={yunkero?.nombre} required autoFocus={!yunkero} />
      </Campo>
      <Campo etiqueta="WhatsApp">
        <input
          className={inputCls}
          name="whatsapp"
          type="tel"
          inputMode="tel"
          placeholder="10 dígitos"
          defaultValue={yunkero?.whatsapp ?? ""}
        />
      </Campo>
      <Campo etiqueta="Especialidad">
        <input
          className={inputCls}
          name="especialidad"
          placeholder="Nissan, motores, carrocería…"
          defaultValue={yunkero?.especialidad ?? ""}
        />
      </Campo>
      <Campo etiqueta="Notas">
        <textarea className={inputCls} name="notas" rows={3} defaultValue={yunkero?.notas ?? ""} />
      </Campo>
      <Guardar>Guardar yunkero</Guardar>
    </form>
  );
}
