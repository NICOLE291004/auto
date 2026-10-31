import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Bricolage_Grotesque, Instrument_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});
// Letras condensadas tipo letrero para los nombres de las empresas.
const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});
const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100"),
  title: "Autopartes usadas en Hermosillo | Alex Autopartes",
  description:
    "Te conseguimos la pieza que buscas, rápido y con garantía. Autopartes usadas desde Hermosillo, Sonora, con envíos a todo México, garantía y respuesta rápida por WhatsApp.",
};

export const viewport: Viewport = {
  themeColor: "#1448e0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-MX"
      className={`${bricolage.variable} ${instrument.variable} ${mono.variable} ${barlow.variable}`}
    >
      <body className="min-h-dvh">
        {children}
      </body>
    </html>
  );
}
