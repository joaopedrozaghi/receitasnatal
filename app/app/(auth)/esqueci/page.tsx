import type { Metadata } from "next";
import { AuthShell } from "@/components/app/AuthShell";
import { ResetForm } from "@/components/app/AuthForms";

export const metadata: Metadata = { title: "Nova senha" };
export const dynamic = "force-dynamic";

export default function ForgotPage() {
  return (
    <AuthShell
      title="Criar uma nova senha"
      subtitle="Enviamos um código para o seu e-mail para confirmar que é você."
    >
      <ResetForm />
    </AuthShell>
  );
}
