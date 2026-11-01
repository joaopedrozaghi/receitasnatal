import Link from "next/link";
import { SiteLogo } from "@/components/sections/Hero";

/** Cabeçalho das páginas internas (/sobre e legais): voltar para a página e ir direto à oferta. */
export function SubpageHeader({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const dark = tone === "dark";
  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur ${
        dark ? "border-white/10 bg-pine-deep/90" : "border-cocoa/10 bg-ivory/90"
      }`}
    >
      <div className="container-page flex min-h-[64px] items-center justify-between gap-3">
        <Link
          href="/"
          className={`inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold ${
            dark ? "text-snow hover:text-gold-light" : "text-cocoa hover:text-berry"
          }`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H6M11 6l-6 6 6 6" />
          </svg>
          Voltar
        </Link>
        <Link href="/" aria-label="Página inicial" className="hidden sm:block">
          <SiteLogo tone={dark ? "dark" : "light"} />
        </Link>
        <Link
          href="/#oferta"
          className="inline-flex min-h-[44px] items-center rounded-full bg-berry px-5 text-sm font-bold uppercase tracking-wide text-white shadow-cta transition hover:bg-berry-hover"
        >
          Ver a oferta
        </Link>
      </div>
    </header>
  );
}
