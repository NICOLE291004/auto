import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Vista previa que aparece al compartir el enlace en WhatsApp, Facebook, etc. (1200x630).
export const alt = "Alex Autopartes: te conseguimos la pieza que buscas. Envíos a todo México.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const svg = await readFile(join(process.cwd(), "public", "logo.svg"), "utf-8");
  const logo = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#1448e0",
          padding: 64,
          gap: 56,
        }}
      >
        <div
          style={{
            width: 360,
            height: 360,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            borderRadius: 48,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" width={300} height={245} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", color: "#ffffff", width: 656 }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: 1, opacity: 0.9 }}>
            ALEX AUTOPARTES
          </div>
          <div style={{ display: "flex", fontSize: 66, fontWeight: 800, lineHeight: 1.08, marginTop: 14 }}>
            Te conseguimos la pieza que buscas.
          </div>
          <div style={{ display: "flex", fontSize: 32, marginTop: 24, opacity: 0.92 }}>
            Autopartes usadas desde Hermosillo, Sonora
          </div>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 30,
              padding: "12px 26px",
              background: "#e4162b",
              border: "4px solid #ffffff",
              borderRadius: 16,
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            ENVÍOS A TODO MÉXICO
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
