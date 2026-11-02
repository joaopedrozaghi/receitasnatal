import type { Metadata } from "next";
import Image from "next/image";
import { cronograma, packaging, substitutions } from "@/content/recipes/guides";
import { Container, PageHeader } from "@/components/app/PageHeader";
import { Checklist } from "@/components/app/Tools";

export const metadata: Metadata = { title: "Bônus" };

export default function BonusPage() {
  return (
    <>
      <PageHeader
        back="/app/mais"
        title="Seus bônus"
        subtitle="Cronograma da ceia, guia de substituições e guia de embalagem."
      />
      <Container className="space-y-14 py-8">
        <section id="cronograma" className="scroll-mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-berry">Bônus 1</p>
          <h2 className="mt-1 text-3xl">Cronograma da Ceia em 72 horas</h2>
          <p className="mt-2 text-cocoa-muted">Marque o que já fez. Fica salvo neste aparelho.</p>
          <div className="mt-5">
            <Checklist storageKey="cronograma" groups={cronograma} />
          </div>
        </section>

        <section id="substituicoes" className="scroll-mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-berry">Bônus 2</p>
          <h2 className="mt-1 text-3xl">Guia de Substituições</h2>
          <ul className="mt-5 divide-y divide-cocoa/10 rounded-3xl bg-white shadow-soft">
            {substitutions.map((s) => (
              <li key={s.from} className="grid gap-1 p-5 sm:grid-cols-2 sm:gap-6">
                <span className="font-semibold text-cocoa">{s.from}</span>
                <span>
                  → {s.to}
                  {s.note ? <span className="mt-1 block text-sm text-cocoa-muted">{s.note}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section id="embalagem" className="scroll-mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-berry">Bônus 3</p>
          <h2 className="mt-1 text-3xl">Guia de Embalagem e Apresentação</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {packaging.map((p) => (
              <li
                key={p.title}
                className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-cocoa/5"
              >
                {p.photo ? (
                  <span className="relative block h-40">
                    <Image
                      src={p.photo}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 400px, 92vw"
                      className="object-cover"
                    />
                  </span>
                ) : null}
                <span className="block p-5">
                  <span className="block font-display text-xl text-cocoa">{p.title}</span>
                  <span className="mt-1 block text-[15px] leading-relaxed">{p.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
