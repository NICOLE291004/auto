import { IconWhatsApp } from "./icons";
import { PLANTILLA_WHATSAPP, waLink } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  return (
    <a
      href={waLink(PLANTILLA_WHATSAPP)}
      target="_blank"
      rel="noopener"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-wa px-4 py-3.5 font-semibold text-white shadow-[0_10px_30px_-8px_rgba(11,27,63,0.55)] transition-transform hover:scale-105 active:scale-95 md:bottom-6 md:right-6"
    >
      <IconWhatsApp width={28} height={28} />
      <span className="hidden pr-1 md:inline">Escríbenos</span>
    </a>
  );
}
