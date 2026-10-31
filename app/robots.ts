import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/catalogo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/resena"] },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
