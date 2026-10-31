-- Alex Autopartes: esquema inicial.
-- Ejecutar en el SQL Editor de Supabase (o con `supabase db push`).

-- ---------- Utilidades ----------

-- Debe coincidir con lib/slug.ts
create or replace function public.slugify(t text) returns text
language sql immutable as $$
  select trim(both '-' from regexp_replace(
    translate(lower(coalesce(t, '')), 'áàäâéèëêíìïîóòöôúùüûñ', 'aaaaeeeeiiiioooouuuun'),
    '[^a-z0-9]+', '-', 'g'))
$$;

-- ---------- Tipos ----------

create type public.pedido_estado as enum ('nuevo', 'cotizado', 'vendido', 'perdido');
create type public.pedido_origen as enum
  ('anuncio', 'marketplace', 'google', 'taller', 'cliente_antiguo', 'sitio_web');
create type public.pieza_estado as enum ('activa', 'pendiente_revision', 'vendida');

-- ---------- Administradores (solo 2) ----------

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid())
$$;

-- ---------- Yunkeros (privado) ----------

create table public.yunkeros (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  whatsapp text,
  especialidad text,
  notas text,
  created_at timestamptz not null default now()
);

-- ---------- Pedidos ----------

create table public.pedidos (
  id uuid primary key default gen_random_uuid(),
  marca text not null,
  modelo text not null,
  anio int,
  pieza text not null,
  marca_slug text generated always as (public.slugify(marca)) stored,
  modelo_slug text generated always as (public.slugify(modelo)) stored,
  pieza_slug text generated always as (public.slugify(pieza)) stored,
  foto_path text,                       -- ruta en el bucket privado "pedidos"
  cliente_nombre text not null,
  cliente_whatsapp text not null,
  ubicacion text,
  estado public.pedido_estado not null default 'nuevo',
  origen public.pedido_origen not null default 'sitio_web',
  precio_venta numeric(10, 2),
  costo_yunkero numeric(10, 2),
  ganancia numeric(10, 2) generated always as (precio_venta - costo_yunkero) stored,
  notas text,
  created_at timestamptz not null default now()
);
create index pedidos_estado_idx on public.pedidos (estado, created_at desc);
create index pedidos_match_idx on public.pedidos (marca_slug, modelo_slug);

-- ---------- Piezas (inventario virtual) ----------

create table public.piezas (
  id uuid primary key default gen_random_uuid(),
  marca text not null,
  modelo text not null,
  anio_desde int not null,
  anio_hasta int not null,
  pieza text not null,
  marca_slug text generated always as (public.slugify(marca)) stored,
  modelo_slug text generated always as (public.slugify(modelo)) stored,
  pieza_slug text generated always as (public.slugify(pieza)) stored,
  foto_url text,
  precio_yunkero numeric(10, 2),        -- privado, solo referencia para el panel
  yunkero_id uuid references public.yunkeros (id) on delete set null,
  estado public.pieza_estado not null default 'activa',
  publicada_en timestamptz not null default now(),
  expira_en timestamptz not null default (now() + interval '10 days'),
  created_at timestamptz not null default now(),
  check (anio_hasta >= anio_desde)
);
create index piezas_vigentes_idx on public.piezas (estado, expira_en);
create index piezas_match_idx on public.piezas (marca_slug, modelo_slug);

-- Vista pública: SOLO campos seguros y SOLO piezas vigentes.
-- Nunca expone yunkero, precio_yunkero ni notas.
create view public.piezas_publicas as
  select id, marca, marca_slug, modelo, modelo_slug,
         anio_desde, anio_hasta, pieza, foto_url, publicada_en
  from public.piezas
  where estado = 'activa' and expira_en > now();

-- ---------- Seguridad (RLS) ----------

alter table public.admins   enable row level security;
alter table public.yunkeros enable row level security;
alter table public.pedidos  enable row level security;
alter table public.piezas   enable row level security;

create policy "admins leen admins" on public.admins for select using (public.is_admin());
create policy "admins todo yunkeros" on public.yunkeros for all
  using (public.is_admin()) with check (public.is_admin());
create policy "admins todo pedidos" on public.pedidos for all
  using (public.is_admin()) with check (public.is_admin());
create policy "admins todo piezas" on public.piezas for all
  using (public.is_admin()) with check (public.is_admin());

-- El público (anon) solo puede leer la vista. Los pedidos del sitio se insertan
-- desde el servidor con la service role key, nunca desde el navegador.
revoke all on public.yunkeros, public.pedidos, public.piezas, public.admins from anon;
grant select on public.piezas_publicas to anon, authenticated;

-- ---------- Storage ----------

insert into storage.buckets (id, name, public) values
  ('piezas', 'piezas', true),     -- fotos del catálogo (lectura pública)
  ('pedidos', 'pedidos', false)   -- fotos que suben los clientes (privado)
on conflict (id) do nothing;

create policy "admins suben fotos de piezas" on storage.objects for all
  using (bucket_id = 'piezas' and public.is_admin())
  with check (bucket_id = 'piezas' and public.is_admin());
create policy "admins ven fotos de pedidos" on storage.objects for select
  using (bucket_id = 'pedidos' and public.is_admin());
