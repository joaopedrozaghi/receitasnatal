import type { Metadata } from "next";
import { terms } from "@/content/legal.ptBR";
import { t } from "@/lib/offer";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: terms.title,
  description: t(terms.description),
  alternates: { canonical: "/termos" },
};

export default function Page() {
  return <LegalPage doc={terms} />;
}
