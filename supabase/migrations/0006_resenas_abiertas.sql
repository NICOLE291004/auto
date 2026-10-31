-- Reseñas que el cliente escribe directo en el sitio (sin enlace único).
-- Siguen pasando por aprobación: entran como 'pendiente' y solo se publican si un admin las aprueba.
--  - pedido_id ahora es opcional (estas reseñas no vienen de un pedido registrado).
--  - contacto: WhatsApp del cliente, PRIVADO, solo para que el admin confirme la compra. Nunca sale en la vista pública.
--  - fuente: 'enlace' (la pidió el admin desde un pedido) o 'sitio' (la escribió el cliente en la página).

alter table public.resenas alter column pedido_id drop not null;
alter table public.resenas add column contacto text;
alter table public.resenas add column fuente text not null default 'enlace'
  check (fuente in ('enlace', 'sitio'));
