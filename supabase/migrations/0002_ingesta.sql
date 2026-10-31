-- Fase 3 (preparación): bandeja de mensajes entrantes de yunkeros.
-- Todavía nada escribe aquí; el webhook y la extracción con IA la usarán.
-- Las fichas que salgan de aquí se crean como piezas con estado 'pendiente_revision',
-- que no se muestran al público ni cuentan para coincidencias hasta que un admin las apruebe.

create type public.ingesta_estado as enum ('recibido', 'extraido', 'revisado', 'descartado', 'error');

create table public.ingesta_mensajes (
  id uuid primary key default gen_random_uuid(),
  fuente text not null default 'whatsapp',
  wa_message_id text unique,              -- idempotencia: Meta reenvía webhooks
  de_numero text not null,                -- número del yunkero, solo dígitos
  yunkero_id uuid references public.yunkeros (id) on delete set null,
  tipo text not null,                     -- text | image | ...
  texto text,
  media_id text,                          -- id del archivo en la API de WhatsApp
  extraccion jsonb,                       -- resultado de la IA (ver lib/ai/types.ts)
  pieza_id uuid references public.piezas (id) on delete set null,
  estado public.ingesta_estado not null default 'recibido',
  error text,
  created_at timestamptz not null default now()
);
create index ingesta_estado_idx on public.ingesta_mensajes (estado, created_at desc);

alter table public.ingesta_mensajes enable row level security;
create policy "admins todo ingesta" on public.ingesta_mensajes for all
  using (public.is_admin()) with check (public.is_admin());
revoke all on public.ingesta_mensajes from anon;
