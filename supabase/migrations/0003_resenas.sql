-- Reseñas con enlace único y aprobación.
-- Flujo: el admin pide la reseña de un pedido vendido -> se crea una fila 'solicitada' con un token secreto ->
-- el cliente abre /resena/<token> y la envía (pasa a 'pendiente') -> el admin la aprueba o rechaza.
-- Solo las 'aprobada' se ven en el sitio, a través de la vista resenas_publicas.

create type public.resena_estado as enum ('solicitada', 'pendiente', 'aprobada', 'rechazada');

create table public.resenas (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null unique references public.pedidos (id) on delete cascade, -- una reseña por pedido
  token text not null unique
    default (replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '')),
  pieza text not null,                  -- "Faro derecho · Nissan Sentra 2015"
  nombre_sugerido text not null,        -- "Luis P." (el cliente lo puede cambiar)
  nombre_publico text,                  -- como aparecerá en el sitio
  estrellas smallint check (estrellas between 1 and 5),
  comentario text,
  estado public.resena_estado not null default 'solicitada',
  enviada_en timestamptz,
  created_at timestamptz not null default now()
);
create index resenas_estado_idx on public.resenas (estado, created_at desc);

alter table public.resenas enable row level security;
create policy "admins todo resenas" on public.resenas for all
  using (public.is_admin()) with check (public.is_admin());
revoke all on public.resenas from anon;

-- Vista pública: solo reseñas aprobadas y sin datos del cliente (sin WhatsApp, token ni pedido).
create view public.resenas_publicas as
  select id, nombre_publico, estrellas, comentario, pieza, enviada_en
  from public.resenas
  where estado = 'aprobada';

grant select on public.resenas_publicas to anon, authenticated;
