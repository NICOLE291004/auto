import type { NextConfig } from "next";

// Host de Supabase Storage para next/image (fotos de piezas).
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  // Las fotos del celular pasan de 1 MB (límite por defecto de las Server Actions). El código limita a 5 MB.
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
