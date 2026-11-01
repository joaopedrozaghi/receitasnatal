import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/app/PageHeader";
import { AccountPanel } from "@/components/app/AccountPanel";

export const metadata: Metadata = { title: "Minha conta" };

export default function AccountPage() {
  return (
    <>
      <PageHeader back="/app/mais" title="Minha conta" />
      <Container className="py-6">
        <AccountPanel />
      </Container>
    </>
  );
}
