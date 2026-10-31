-- Foto opcional en las reseñas.
-- Las fotos se suben desde el servidor con nombres aleatorios al bucket público 'resenas';
-- la vista pública solo expone la URL de las reseñas aprobadas.

alter table public.resenas add column foto_url text;

create or replace view public.resenas_publicas as
  select id, nombre_publico, estrellas, comentario, pieza, enviada_en, foto_url
  from public.resenas
  where estado = 'aprobada';

insert into storage.buckets (id, name, public) values ('resenas', 'resenas', true)
on conflict (id) do nothing;

create policy "admins gestionan fotos de reseñas" on storage.objects for all
  using (bucket_id = 'resenas' and public.is_admin())
  with check (bucket_id = 'resenas' and public.is_admin());
