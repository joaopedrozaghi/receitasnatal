import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { copy } from "@/content/copy.ptBR";
import { story } from "@/content/story.ptBR";
import { ChefPhotos } from "@/components/sections/Chef";
import { OfferShell } from "@/components/offer/OfferShell";
import { OfferCta } from "@/components/offer/OfferBits";
import { Footer } from "@/components/sections/Closing";
import { SubpageHeader } from "@/components/SubpageHeader";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import { Rich } from "@/components/ui/Rich";

export const metadata: Metadata = {
  title: story.meta.title,
  description: story.meta.description,
  alternates: { canonical: "/sobre" },
  openGraph: { title: story.meta.title, description: story.meta.description },
};

export default function AboutPage() {
  const real = siteConfig.chef.mode === "real";
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

        <section className="container-page max-w-2xl py-14 sm:py-20">
          <div className="space-y-6">
            {story.short.map((p, i) => (
              <Reveal key={i}>
                <p className="text-lg leading-[1.75]">
                  <Rich text={p} />
                </p>
              </Reveal>
            ))}
          </div>
          {extra ? (
            <Reveal className="relative mx-auto mt-12 max-w-sm">
              <div className="relative aspect-[4/5] overflow-hidden rounded-arch shadow-lift">
                <Image
                  src={extra.src}
                  alt={extra.alt}
                  fill
                  sizes="(min-width: 640px) 384px, 90vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ) : null}
          <p className="mt-12 text-center font-display text-4xl italic text-berry">
            {story.character.closing}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <OfferCta href="/#oferta" block>
              {copy.about.offerButton}
            </OfferCta>
            <Link
              href="/#roseli"
              className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-pine underline decoration-gold decoration-2 underline-offset-4 hover:text-berry"
            >
              ← {copy.about.back}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </OfferShell>
  );
}
