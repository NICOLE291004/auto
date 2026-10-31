import { NextResponse, type NextRequest } from "next/server";
import { firmaValida, verificarSuscripcion } from "@/lib/whatsapp-cloud/firma";
import { extraerMensajes } from "@/lib/whatsapp-cloud/mensajes";
import { procesarMensajes } from "@/lib/whatsapp-cloud/procesar";

// Webhook de WhatsApp Cloud API. Sin las variables de entorno responde 503 y no hace nada.

/** Meta llama aquí una vez para verificar el webhook al registrarlo. */
export async function GET(request: NextRequest) {
  const token = process.env.WHATSAPP_VERIFY_TOKEN;
  if (!token) return new NextResponse("Webhook no configurado", { status: 503 });
  const challenge = verificarSuscripcion(request.nextUrl.searchParams, token);
  if (challenge === null) return new NextResponse("Verificación rechazada", { status: 403 });
  return new NextResponse(challenge, { status: 200 });
}

/** Meta envía aquí cada mensaje. Se valida la firma antes de leer nada. */
export async function POST(request: NextRequest) {
  const secreto = process.env.WHATSAPP_APP_SECRET;
  if (!secreto) return new NextResponse("Webhook no configurado", { status: 503 });

  const cuerpo = await request.text();
  if (!firmaValida(cuerpo, request.headers.get("x-hub-signature-256"), secreto)) {
    return new NextResponse("Firma inválida", { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(cuerpo);
  } catch {
    return new NextResponse("JSON inválido", { status: 400 });
  }

  await procesarMensajes(extraerMensajes(payload));
  // Meta reintenta si no recibe 200 rápido.
  return new NextResponse("ok", { status: 200 });
}
