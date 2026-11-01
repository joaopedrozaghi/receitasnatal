import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import { LoginScreen } from "@/components/app/LoginScreen";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <LoginScreen
      codeHashes={siteConfig.app.accessCodeHashes}
      supportEmail={siteConfig.brand.supportEmail}
      next={next?.slice(0, 200)}
    />
  );
}
