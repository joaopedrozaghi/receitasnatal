import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { copy } from "@/content/copy.ptBR";
import { story, type StoryChapter } from "@/content/story.ptBR";
import { ChefPhotos } from "@/components/sections/Chef";
import { OfferShell } from "@/components/offer/OfferShell";
import { CheckoutCta } from "@/components/offer/OfferBits";
import { Footer } from "@/components/sections/Closing";
import { SubpageHeader } from "@/components/SubpageHeader";
import { Sprig } from "@/components/decor/Ornaments";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import { Rich } from "@/components/ui/Rich";

export const metadata: Metadata = {
  title: story.meta.title,
  description: story.meta.description,
  alternates: { canonical: "/sobre" },
  openGraph: { title: story.meta.title, description: story.meta.description },
};

function Chapter({ chapter }: { chapter: StoryChapter }) {
  return (
    <Reveal>
      <article className="border-t border-cocoa/10 pt-10">
        <h2 className="text-3xl">{chapter.title}</h2>
        {chapter.paragraphs.map((p, i) => (
          <p key={i} className="mt-5 text-lg leading-[1.75]">
            <Rich text={p} />
          </p>
        ))}
        {chapter.beliefs ? (
          <ol className="mt-6 space-y-3">
            {chapter.beliefs.map((b, i) => (
              <li
                key={b.title}
                className="flex gap-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-cocoa/5"
              >
                <span className="font-display text-3xl text-gold-text">0{i + 1}</span>
                <span className="text-lg leading-snug">
                  <strong className="font-semibold text-cocoa">{b.title}</strong> {b.text}
                </span>
              </li>
            ))}
          </ol>
        ) : null}
      </article>
    </Reveal>
  );
}

export default function AboutPage() {
  const real = siteConfig.chef.mode === "real";
  const chapters = real ? story.real.chapters : story.character.chapters;
  const extra = siteConfig.chef.photosAbout[0];

  return (
    <OfferShell>
      <SubpageHeader />
      <main id="conteudo">
        <section className="grain bg-pine-deep text-snow">
          <div className="container-page grid items-center gap-12 pb-16 pt-12 lg:grid-cols-2 lg:pb-24">
            <div>
              <Kicker tone="dark">{story.eyebrow}</Kicker>
              <h1 className="mt-5 text-[2.6rem] leading-[1.04] !text-snow sm:text-6xl">
                {real && story.real.title ? story.real.title : story.title}
              </h1>
              <p className="mt-6 max-w-lg text-xl leading-relaxed text-snow/80">{story.intro}</p>
              <p className="mt-6 font-script text-5xl text-gold-light">{copy.chef.signature}</p>
            </div>
            <div className="mx-auto w-full max-w-[440px] [&_figcaption]:text-snow/70">
              <ChefPhotos priority />
            </div>
          </div>
        </section>

        <section className="container-page max-w-3xl space-y-10 py-16">
          {chapters.map((c, i) => (
            <div key={c.id}>
              <Chapter chapter={c} />
              {i === 2 && extra ? (
                <Reveal className="relative mx-auto mt-10 max-w-md">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-arch shadow-lift">
                    <Image
                      src={extra.src}
                      alt={extra.alt}
                      fill
                      sizes="(min-width: 640px) 448px, 90vw"
                      className="object-cover"
                    />
                  </div>
                </Reveal>
              ) : null}
            </div>
          ))}
          <p className="border-t border-cocoa/10 pt-10 text-center font-display text-4xl italic text-berry">
            {story.character.closing}
          </p>
        </section>

        <section className="bg-white py-16">
          <div className="container-page">
            <Sprig className="mx-auto w-32" />
            <ul className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {story.signatures.map((s) => (
                <li
                  key={s}
                  className="rounded-3xl bg-ivory p-6 text-center font-display text-2xl italic leading-snug text-cocoa"
                >
                  “{s}”
                </li>
              ))}
            </ul>
            <div className="mt-12 flex flex-col items-center gap-4">
              <CheckoutCta block>{copy.hero.cta}</CheckoutCta>
              <Link
                href="/"
                className="inline-flex min-h-[44px] items-center font-semibold text-pine underline decoration-gold decoration-2 underline-offset-4 hover:text-berry"
              >
                ← Voltar para a página do Especial de Natal
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </OfferShell>
  );
}
