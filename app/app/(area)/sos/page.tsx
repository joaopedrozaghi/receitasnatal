import type { Metadata } from "next";
import { sos } from "@/content/recipes/guides";
import { Container, PageHeader } from "@/components/app/PageHeader";

export const metadata: Metadata = { title: "Guia SOS" };

export default function SosPage() {
  return (
    <>
      <PageHeader
        back="/app/mais"
        title="Guia SOS"
        subtitle="Algo saiu diferente? Encontre o problema, entenda a causa e veja como salvar."
      />
      <Container className="space-y-10 py-6">
        {sos.map((section) => (
          <section key={section.title}>
            <h2 className="text-2xl">{section.title}</h2>
            <div className="mt-4 space-y-3">
              {section.items.map((it) => (
                <details
                  key={it.id}
                  id={it.id}
                  className="group rounded-2xl bg-white shadow-soft ring-1 ring-cocoa/5 open:ring-berry/30"
                >
                  <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[17px] font-semibold text-cocoa">
                    {it.problem}
                    <span aria-hidden="true" className="text-xl text-berry transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="space-y-4 px-5 pb-5 text-[15px] leading-relaxed">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-cocoa-muted">
                        Por que acontece
                      </p>
                      <ul className="mt-1 space-y-1">
                        {it.causes.map((c) => (
                          <li key={c}>• {c}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl bg-pine-soft p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-pine">Como salvar</p>
                      <ul className="mt-1 space-y-1 text-cocoa">
                        {it.fix.map((f) => (
                          <li key={f}>• {f}</li>
                        ))}
                      </ul>
                    </div>
                    <p>
                      <strong className="text-gold-text">Da próxima vez: </strong>
                      {it.prevent}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </Container>
    </>
  );
}
