import type { MetadataRoute } from "next";
import { combinacionesCuradas, siteUrl } from "@/lib/catalogo";
import { MARCAS } from "@/lib/config";
import { slugify } from "@/lib/slug";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: base, priority: 1 },
    { url: `${base}/piezas`, priority: 0.9 },
    { url: `${base}/solicitar`, priority: 0.8 },
    ...MARCAS.map((m) => ({ url: `${base}/piezas/${slugify(m)}`, priority: 0.7 })),
    ...combinacionesCuradas().map((c) => ({
      url: `${base}/piezas/${c.marca}/${c.modelo}`,
      priority: 0.6,
    })),
  ];
}
