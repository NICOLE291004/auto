import Image from "next/image";

/** Logo de Alex Autopartes (public/logo.svg). El alto define el tamaño; el ancho sigue la proporción del dibujo. */
export function Logo({ className = "h-11 w-auto" }: { className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt=""
      width={998}
      height={815}
      unoptimized
      className={className}
      priority
    />
  );
}
