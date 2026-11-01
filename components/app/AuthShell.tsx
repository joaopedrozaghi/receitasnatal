import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site.config";

/** Moldura das telas de entrada (login, ativação, senha). */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="grain flex min-h-[100dvh] flex-col bg-pine-deep lg:flex-row">
      <aside className="relative hidden flex-1 overflow-hidden lg:block">
        <Image
          src="/images/receitas/panetones-trufados.jpg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-deep via-pine-deep/30 to-transparent" />
        <div className="absolute inset-x-12 bottom-12 text-snow">
          <p className="font-display text-5xl leading-tight">
            Massa boa não tem pressa. <em className="text-gold-light">Mas tem método.</em>
          </p>
          <p className="mt-4 font-script text-4xl text-gold-light">{siteConfig.chef.name}</p>
        </div>
      </aside>

      <main id="conteudo" className="flex flex-1 flex-col items-center justify-center px-5 py-10">
        <Link href="/app" className="mb-8 font-display text-[1.6rem] text-snow">
          Receitinhas <span className="italic text-gold">da Rô</span>
        </Link>
        <div className="w-full max-w-md rounded-[2rem] bg-ivory p-7 shadow-lift sm:p-9">
          <h1 className="text-[2rem] leading-tight">{title}</h1>
          {subtitle ? <p className="mt-2 text-[15px] leading-relaxed text-cocoa-muted">{subtitle}</p> : null}
          <div className="mt-7">{children}</div>
        </div>
        <p className="mt-6 text-center text-xs text-snow/60">
          Precisa de ajuda? Escreva para{" "}
          <a href={`mailto:${siteConfig.brand.supportEmail}`} className="underline">
            {siteConfig.brand.supportEmail}
          </a>
        </p>
      </main>
    </div>
  );
}
