# Alex Autopartes

Sitio de Alex Autopartes (Hermosillo, Sonora; envíos a todo México). Next.js (App Router) + TypeScript + Tailwind + Supabase.

Estado: **Fase 1 (sitio público)** y **Fase 2 (panel admin)** listas. Fase 3 (IA/webhook) pendiente.

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

## Panel de administración (`/admin`)

Solo pueden entrar 2 administradores. Para darlos de alta:

1. En Supabase → **Authentication → Providers → Email**, desactiva **Allow new users to sign up**.
2. En **Authentication → Users → Add user**, crea las 2 cuentas (correo + contraseña, marca *Auto confirm*).
3. En el **SQL Editor**, autorízalas (cambia los correos):

```sql
insert into public.admins (user_id, email)
select id, email from auth.users where email in ('uno@correo.com', 'dos@correo.com');
```

Quien tenga cuenta pero no esté en `admins` no ve nada: el login la rechaza y las políticas RLS bloquean las tablas.

Qué hay en el panel:

- **Inicio:** pedidos de la semana, tasa de cierre (vendidos ÷ pedidos recibidos del periodo), ganancia total y ventas por origen.
- **Pedidos:** filtro por estado, captura rápida desde el celular, origen, precio de venta, costo del yunkero y ganancia calculada.
- **Piezas:** alta con foto, yunkero (privado) y `precio_yunkero` opcional. Vencen a los 10 días y se pueden renovar.
- **Yunkeros:** privados.
- **Coincidencias:** pedidos abiertos (nuevo o cotizado) con una pieza vigente de la misma marca, modelo, año y tipo de pieza.
  Se calculan al abrir el panel, así que una pieza nueva dispara la alerta de inmediato (lógica en `lib/matching.ts`).

## Desplegar en Vercel

1. Sube el repo a GitHub e impórtalo en Vercel.
2. Agrega en **Environment Variables** las mismas variables de `.env.example`.
3. Despliega. Después fija `NEXT_PUBLIC_SITE_URL` al dominio real y vuelve a desplegar.

## Datos provisionales

Revisa `lib/config.ts` antes de publicar: número de WhatsApp, años de experiencia y texto de garantía. En
`app/page.tsx` quedan reseñas de ejemplo y marcadores de foto (`PhotoSlot`) por reemplazar con material real.

## Estructura

```
app/(publico)/  sitio público (home, /solicitar, /piezas, /piezas/[marca]/[modelo])
app/admin/      panel (login y páginas protegidas); proxy.ts hace la revisión rápida de sesión
app/            sitemap y robots
components/     UI (buscador por pasos, tarjetas, encabezado)
lib/            config, slug, WhatsApp, validación, acceso a datos, expiración, coincidencias y estadísticas
supabase/       migraciones y seed
tests/          pruebas (Vitest)
```

## SEO

Las páginas `/piezas/[marca]/[modelo]` se generan para las combinaciones de `lib/config.ts` (`MARCAS` y `MODELOS`) y
también se crean bajo demanda para marcas y modelos que aparezcan en piezas publicadas. Para agregar un modelo,
edita `MODELOS`.
