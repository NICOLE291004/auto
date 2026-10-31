import { IconCamara } from "./icons";

/** Marcador de foto real. Sustituir por <Image> cuando haya foto. */
export function PhotoSlot({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Espacio para foto: ${label}`}
      className={`foto-slot flex flex-col items-center justify-center gap-2 text-azul ${className}`}
    >
      <IconCamara width={30} height={30} />
      <span className="px-4 text-center font-mono text-[11px] uppercase tracking-wider">
        Foto real · {label}
      </span>
    </div>
  );
}
