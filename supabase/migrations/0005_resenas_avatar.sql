-- Foto de perfil opcional del cliente que deja la reseña (se muestra como un círculo pequeño).
-- Usa el mismo bucket público 'resenas' de la migración 0004.

alter table public.resenas add column avatar_url text;

create or replace view public.resenas_publicas as
  select id, nombre_publico, estrellas, comentario, pieza, enviada_en, foto_url, avatar_url
  from public.resenas
  where estado = 'aprobada';
