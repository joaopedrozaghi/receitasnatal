import type { Metadata } from "next";
import { AuthShell } from "@/components/app/AuthShell";
import { ActivateForm } from "@/components/app/AuthForms";

export const metadata: Metadata = { title: "Ativar acesso" };
export const dynamic = "force-dynamic";

export default async function ActivatePage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams;
  return (
    <AuthShell
      title="Ative o seu acesso"
      subtitle="Use o código de 6 números que enviamos para o e-mail da compra e crie a sua senha."
    >
      <ActivateForm initialEmail={email?.slice(0, 160)} />
    </AuthShell>
  );
}
