import Link from "next/link";
import { notFound } from "next/navigation";
import { Aviso } from "@/components/admin/Aviso";
import { Campo, GananciaLive, Guardar, Opciones, inputCls } from "@/components/admin/ui";
import { IconWhatsApp } from "@/components/icons";
import { requireAdmin } from "@/lib/auth";
import { getCoincidencias, type Pedido } from "@/lib/admin/data";
import { ESTADOS_PEDIDO, etiquetaOrigen } from "@/lib/admin/labels";
import { rangoAnios } from "@/lib/piezas";
import { siteUrl } from "@/lib/catalogo";
import { mensajeResena, urlResena } from "@/lib/resenas";
import { waCliente } from "@/lib/whatsapp";
import { solicitarResena } from "../../resenas/actions";
import { actualizarPedido } from "../actions";

export default async function PedidoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { db } = await requireAdmin();
  const { id } = await params;
  const { ok, error } = await searchParams;

  const { data } = await db.from("pedidos").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const p = data as Pedido;

  const fotoUrl = p.foto_path
    ? (await db.storage.from("pedidos").createSignedUrl(p.foto_path, 3600)).data?.signedUrl
    : null;
  const { data: resenaData } = await db
    .from("resenas")
    .select("token, estado")
    .eq("pedido_id", p.id)
    .maybeSingle();
  const resena = resenaData as { token: string; estado: string } | null;
  const enlaceResena = resena ? urlResena(siteUrl(), resena.token) : null;
  const coincidencias = (await getCoincidencias(db)).find((c) => c.pedido.id === p.id)?.piezas ?? [];

  return (
    <div className="space-y-5">
      <Link href="/admin/pedidos" className="text-sm font-semibold text-azul">
        ← Pedidos
      </Link>
      <div>
        <h1 className="font-display text-3xl font-extrabold leading-tight">{p.pieza}</h1>
        <p className="text-lg text-muted">
          {p.marca} {p.modelo} {p.anio ?? ""} · {etiquetaOrigen(p.origen)}
        </p>
      </div>

      <div className="rounded-3xl bg-white p-4">
        <p className="font-bold">{p.cliente_nombre}</p>
        <p className="text-muted">
          {p.cliente_whatsapp}
          {p.ubicacion ? ` · ${p.ubicacion}` : ""}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={waCliente(p.cliente_whatsapp, `Hola ${p.cliente_nombre}, te escribimos de Alex Autopartes por tu pedido: ${p.pieza} para ${p.marca} ${p.modelo} ${p.anio ?? ""}.`)}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-xl bg-wa px-4 py-2.5 font-bold text-white"
          >
            <IconWhatsApp width={20} height={20} /> Escribir al cliente
          </a>
          {fotoUrl && (
            <a href={fotoUrl} target="_blank" rel="noopener" className="rounded-xl border-2 border-linea px-4 py-2.5 font-bold">
              Ver foto del cliente
            </a>
          )}
        </div>
      </div>

      {coincidencias.length > 0 && (
        <div className="rounded-3xl bg-rojo/10 p-4">
          <p className="mb-2 font-bold text-rojo-hondo">Piezas vigentes que coinciden</p>
          <ul className="space-y-1">
            {coincidencias.map((z) => (
              <li key={z.id}>
                <Link href={`/admin/piezas/${z.id}`} className="font-semibold underline">
                  {z.pieza} · {z.marca} {z.modelo} {rangoAnios(z)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {p.estado === "vendido" && (
        <div className="rounded-3xl bg-white p-4">
          <p className="font-bold">Reseña del cliente</p>
          {!resena ? (
            <>
              <p className="mb-3 text-muted">Genera un enlace único para que el cliente deje su reseña.</p>
              <form action={solicitarResena.bind(null, p.id)}>
                <button className="w-full rounded-2xl bg-azul px-4 py-3 font-bold text-white hover:bg-azul-hondo">
                  Pedir reseña
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="mb-2 text-muted">
                Estado:{" "}
                {{
                  solicitada: "esperando respuesta del cliente",
                  pendiente: "recibida, falta aprobarla",
                  aprobada: "publicada en el sitio",
                  rechazada: "rechazada",
                }[resena.estado] ?? resena.estado}
              </p>
              {resena.estado === "solicitada" && enlaceResena && (
                <div className="space-y-2">
                  <input readOnly value={enlaceResena} className={inputCls} aria-label="Enlace de reseña" />
                  <a
                    href={waCliente(p.cliente_whatsapp, mensajeResena(p.cliente_nombre, enlaceResena))}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-wa px-4 py-3 font-bold text-white"
                  >
                    <IconWhatsApp width={20} height={20} /> Mandar por WhatsApp
                  </a>
                </div>
              )}
              {resena.estado === "pendiente" && (
                <Link href="/admin/resenas" className="font-bold text-azul underline">
                  Ir a aprobarla
                </Link>
              )}
            </>
          )}
        </div>
      )}

      <Aviso ok={ok} error={error} />
      <form action={actualizarPedido.bind(null, p.id)} className="space-y-5">
        <div>
          <span className="mb-1.5 block text-sm font-bold text-muted">Estado</span>
          <Opciones nombre="estado" opciones={ESTADOS_PEDIDO} inicial={p.estado} />
        </div>
        <GananciaLive venta={p.precio_venta} costo={p.costo_yunkero} />
        <Campo etiqueta="Notas">
          <textarea className={inputCls} name="notas" rows={3} defaultValue={p.notas ?? ""} />
        </Campo>
        <Guardar>Guardar cambios</Guardar>
      </form>
    </div>
  );
}
