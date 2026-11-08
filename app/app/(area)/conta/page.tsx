import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/app/PageHeader";
import { AccountPanel } from "@/components/app/AccountPanel";

export const metadata: Metadata = { title: "Ajustes" };

export default function AccountPage() {
  return (
    <>
      <PageHeader back="/app/mais" title="Ajustes" />
      <Container className="py-6">
        <AccountPanel />
      </Container>
    </>
  );
}
