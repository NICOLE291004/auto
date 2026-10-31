import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel | Alex Autopartes",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
