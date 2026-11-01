import type { Metadata } from "next";
import { privacy } from "@/content/legal.ptBR";
import { t } from "@/lib/offer";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: privacy.title,
  description: t(privacy.description),
  alternates: { canonical: "/privacidade" },
};

export default function Page() {
  return <LegalPage doc={privacy} />;
}
