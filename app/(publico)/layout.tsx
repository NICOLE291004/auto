import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export default function PublicoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <WhatsAppFloat />
    </>
  );
}
