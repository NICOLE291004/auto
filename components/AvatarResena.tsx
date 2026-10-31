import Image from "next/image";

/** Círculo pequeño con la cara del cliente; sin foto muestra su inicial. */
export function AvatarResena({
  url,
  nombre,
  className = "h-11 w-11",
}: {
  url: string | null;
  nombre: string;
  className?: string;
}) {
  if (url) {
    return (
      <span className={`relative block shrink-0 overflow-hidden rounded-full bg-niebla ${className}`}>
        <Image src={url} alt="" fill sizes="64px" className="object-cover" />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full bg-azul font-display text-lg font-extrabold text-white ${className}`}
    >
      {nombre.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}
