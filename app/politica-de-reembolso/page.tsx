import type { Metadata } from "next";
import { refund } from "@/content/legal.ptBR";
import { t } from "@/lib/offer";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: refund.title,
  description: t(refund.description),
  alternates: { canonical: "/politica-de-reembolso" },
};

export default function Page() {
  return <LegalPage doc={refund} />;
}
