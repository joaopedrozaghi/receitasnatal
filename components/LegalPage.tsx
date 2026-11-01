import Link from "next/link";
import { legalWarning, type LegalDoc } from "@/content/legal.ptBR";
import { t } from "@/lib/offer";
import { Footer } from "@/components/sections/Closing";
import { SiteLogo } from "@/components/sections/Hero";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <main id="conteudo" className="container-page max-w-3xl pb-20">
        <header className="py-5">
          <Link href="/">
            <SiteLogo tone="light" />
          </Link>
        </header>
        <p
          role="note"
          className="mt-4 rounded-2xl border border-berry/30 bg-berry/5 p-4 text-sm font-semibold text-berry-hover"
        >
          {legalWarning}
        </p>
        <h1 className="mt-8 text-4xl sm:text-5xl">{t(doc.title)}</h1>
        <p className="mt-3 text-sm text-cocoa-muted">Última atualização: {doc.updatedAt}</p>
        {doc.sections.map((s) => (
          <section key={s.heading} className="mt-10">
            <h2 className="text-2xl">{t(s.heading)}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i} className="mt-4 leading-relaxed">
                {t(p)}
              </p>
            ))}
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
