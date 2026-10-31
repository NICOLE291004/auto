# Fase 3: IA y WhatsApp (arquitectura preparada)

Objetivo: que las publicaciones de los yunkeros se conviertan en fichas de pieza sin capturarlas a mano.
**Lo de abajo está preparado, pero el procesamiento NO está activo.** Nada de esto afecta al sitio ni al panel.

## Flujo previsto

```
Yunkero ── mensaje privado ──► WhatsApp Cloud API (coexistencia)
                                      │ POST firmado
                                      ▼
                       /api/webhooks/whatsapp   (app/api/webhooks/whatsapp/route.ts)
                         1. valida la firma  ✔ hecho
                         2. extrae mensajes  ✔ hecho (lib/whatsapp-cloud/mensajes.ts)
                         3. procesarMensajes  ✖ pendiente (lib/whatsapp-cloud/procesar.ts)
                                      │
                    ┌─────────────────┴───────────────────┐
                    ▼                                     ▼
          guarda en ingesta_mensajes             asocia yunkero por número
          (idempotente por wa_message_id)        ✔ hecho (buscarYunkeroPorNumero)
                    │
                    ▼
          Extractor (API de Claude)  ✖ pendiente (lib/ai/extraer.ts)
          texto o foto ─► JSON validado con extraccionSchema ✔ hecho
                    │
                    ▼
          pieza con estado 'pendiente_revision'   (no pública, no entra a coincidencias)
                    │
                    ▼
          un admin la revisa en el panel, completa y publica ✖ pendiente (vista de revisión)
```

La segunda entrada del mismo objetivo, **pegar texto o subir foto en el panel** para precargar la ficha, reutiliza el
mismo `Extractor` y `extraccionAFicha`; solo falta el formulario.

## Qué ya existe

| Pieza | Dónde |
|---|---|
| Tabla `ingesta_mensajes` (RLS solo admins) | `supabase/migrations/0002_ingesta.sql` |
| Esquema y tipos de la extracción | `lib/ai/types.ts` |
| Prompt, validación y normalización del JSON | `lib/ai/extraer.ts` |
| Extracción → valores de la ficha, y chequeo de ficha completa | `lib/ai/ficha.ts` |
| Verificación de firma `X-Hub-Signature-256` y del GET de suscripción | `lib/whatsapp-cloud/firma.ts` |
| Lectura del payload (texto, foto con pie, otros) | `lib/whatsapp-cloud/mensajes.ts` |
| Ruta del webhook (503 si no hay variables, 401 con firma mala) | `app/api/webhooks/whatsapp/route.ts` |
| Estado `pendiente_revision` en piezas | `supabase/migrations/0001_init.sql` |
| Pruebas | `tests/fase3.test.ts` |

## Qué falta para activarlo

1. **Meta:** crear la app, el número en modo coexistencia y registrar el webhook con la URL
   `https://TU-DOMINIO/api/webhooks/whatsapp` y el `WHATSAPP_VERIFY_TOKEN`. Suscribir el campo `messages`.
2. **Variables:** llenar `WHATSAPP_VERIFY_TOKEN` y `WHATSAPP_APP_SECRET` (ya validan la firma) y, al activar el
   procesamiento, `WHATSAPP_ACCESS_TOKEN` y `ANTHROPIC_API_KEY`.
3. **`procesarMensajes`:** guardar en `ingesta_mensajes`, descargar la foto, llamar al extractor, crear la pieza
   `pendiente_revision`. Usar la service role (`lib/supabase/admin.ts`), porque el webhook no tiene sesión.
4. **`extractor.extraer`:** llamar a la API de Claude con `PROMPT_EXTRACCION`, pedir salida estructurada y pasarla por
   `validarExtraccion`. Para foto, enviar la imagen en base64.
5. **Panel:** pantalla de revisión de piezas pendientes (lista, editar con `PiezaForm`, publicar o descartar).
6. **Ejecución en segundo plano:** responder 200 a Meta de inmediato y procesar después (por ejemplo con `after()` de
   Next.js o una cola), porque la extracción con IA puede tardar más que el tiempo que Meta espera.

## Decisiones tomadas

- **Nada se publica solo.** Toda ficha creada por IA entra como `pendiente_revision` y requiere a una persona.
- **Idempotencia:** Meta reenvía webhooks; `wa_message_id` es único, así que un mensaje repetido no duplica fichas.
- **La IA puede dejar campos vacíos.** Es preferible un `null` a un dato inventado; la persona completa al revisar.
- **Privacidad:** los números y mensajes de yunkeros viven en tablas sin acceso para el público.
- **Mensajes de los yunkeros que no son piezas** (saludos, audios) se guardan como `tipo: otro` o se descartan; no
  generan fichas.
