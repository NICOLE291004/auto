import { IconEntrega, IconEscudo, IconRayo } from "./icons";

const SELLOS = [
  { icon: IconEscudo, texto: "Garantía en tu pieza" },
  { icon: IconEntrega, texto: "Envíos a todo México" },
  { icon: IconRayo, texto: "Respuesta rápida por WhatsApp" },
];

export function TrustBadges({ dark = false }: { dark?: boolean }) {
  return (
    <ul
      className={`flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium ${
        dark ? "text-white/90" : "text-muted"
      }`}
    >
      {SELLOS.map(({ icon: Icon, texto }) => (
        <li key={texto} className="flex items-center gap-1.5">
          <Icon width={18} height={18} className={dark ? "text-senal" : "text-azul"} />
          {texto}
        </li>
      ))}
    </ul>
  );
}
