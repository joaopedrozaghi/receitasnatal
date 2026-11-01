import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/app/AuthShell";
import { LoginForm } from "@/components/app/AuthForms";
import { getCurrentUser } from "@/lib/app/session";

export const metadata: Metadata = { title: "Entrar" };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getCurrentUser()) redirect("/app");
  const { next } = await searchParams;
  return (
    <AuthShell title="Que bom te ver de novo" subtitle="Entre com o e-mail da compra e a sua senha.">
      <LoginForm next={next} />
    </AuthShell>
  );
}
