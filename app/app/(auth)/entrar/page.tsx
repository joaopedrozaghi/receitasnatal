import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import { AuthShell } from "@/components/app/AuthShell";
import { LoginForm } from "@/components/app/AuthForms";
import { isLoggedIn } from "@/lib/app/session";

export const metadata: Metadata = { title: "Entrar" };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await isLoggedIn()) redirect("/app");
  const { next } = await searchParams;
  return (
    <AuthShell
      title="Bem-vinda(o) ao seu Especial de Natal"
      subtitle="Entre com o login e a senha que você recebeu por e-mail."
    >
      <LoginForm next={next} supportEmail={siteConfig.brand.supportEmail} />
    </AuthShell>
  );
}
