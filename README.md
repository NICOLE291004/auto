# Alex Autopartes

Sitio de Alex Autopartes (Hermosillo, Sonora; envíos a todo México). Next.js (App Router) + TypeScript + Tailwind + Supabase.

Estado: **Fase 1 (sitio público)** lista. Fase 2 (panel admin) y Fase 3 (IA/webhook) pendientes.

## Correrlo en local

```bash
npm install
cp .env.example .env.local   # llena los valores
npm run dev                  # http://localhost:3000
npm test                     # pruebas
npm run build                # verifica que compile
```

Sin Supabase configurado el sitio funciona: el catálogo sale vacío y los pedidos no se guardan, pero el cliente
igual puede continuar por WhatsApp.

## Configurar Supabase

1. Crea un proyecto en supabase.com.
2. En **SQL Editor** ejecuta [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql). Crea tablas,
   la vista pública, las políticas RLS y los buckets `piezas` (público) y `pedidos` (privado).
3. Opcional, solo desarrollo: ejecuta `supabase/seed.sql` para ver piezas de ejemplo.
4. Copia la URL, la `anon key` y la `service_role key` a `.env.local` (ver `.env.example`).

### Privacidad del yunkero

El sitio público **solo** lee la vista `piezas_publicas`, que no incluye yunkero, `precio_yunkero` ni notas. El rol
`anon` no tiene acceso a las tablas. Los pedidos del sitio se guardan desde el servidor con la service role key.

## Desplegar en Vercel

1. Sube el repo a GitHub e impórtalo en Vercel.
2. Agrega en **Environment Variables** las mismas variables de `.env.example`.
3. Despliega. Después fija `NEXT_PUBLIC_SITE_URL` al dominio real y vuelve a desplegar.

## Datos provisionales

Revisa `lib/config.ts` antes de publicar: número de WhatsApp, años de experiencia y texto de garantía. En
`app/page.tsx` quedan reseñas de ejemplo y marcadores de foto (`PhotoSlot`) por reemplazar con material real.

## Estructura

```
app/            páginas (home, /solicitar, /piezas, /piezas/[marca]/[modelo]), sitemap y robots
components/     UI (buscador por pasos, tarjetas, encabezado)
lib/            config, slug, WhatsApp, validación, acceso a datos
supabase/       migraciones y seed
tests/          pruebas (Vitest)
```

## SEO

Las páginas `/piezas/[marca]/[modelo]` se generan para las combinaciones de `lib/config.ts` (`MARCAS` y `MODELOS`) y
también se crean bajo demanda para marcas y modelos que aparezcan en piezas publicadas. Para agregar un modelo,
edita `MODELOS`.
