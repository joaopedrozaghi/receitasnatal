import Image from "next/image";
import { copy } from "@/content/copy.ptBR";
import { Reveal } from "@/components/ui/Reveal";
import { Title } from "@/components/ui/Rich";
import { ScreensCarousel } from "@/components/sections/ScreensCarousel";

/**
 * Provas com fotos, logo abaixo da VSL: panetones das receitas do app e as telas reais do app.
 * Depoimentos de clientes (com foto) entram em siteConfig.testimonials e aparecem na seção seguinte.
 */
export function Proof() {
  const c = copy.proof;
  return (
    <section id="provas" className="section bg-ivory">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
          <Title text={c.title} className="h2" />
          <p className="mt-4 text-lg leading-relaxed text-cocoa">{c.sub}</p>
        </Reveal>

        {/* panetones das receitas do app */}
        <Reveal className="mx-auto mt-14 max-w-2xl text-center lg:mx-0 lg:text-left">
          <h3 className="font-display text-[1.75rem] leading-tight text-cocoa sm:text-[2.2rem]">
            {c.galleryTitle}
          </h3>
          <p className="mt-3 text-lg leading-relaxed text-cocoa">{c.gallerySub}</p>
        </Reveal>
        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-8">
          {c.gallery.map((g, i) => (
            <Reveal as="li" key={g.src} delay={(i % 4) * 70}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-pine-soft">
                <Image
                  src={g.src}
                  alt={g.name}
                  fill
                  sizes="(min-width: 1024px) 300px, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.04]"
                />
              </div>
              <p className="mt-2.5 text-center text-[15px] font-semibold leading-snug text-cocoa lg:text-left">
                {g.name}
              </p>
            </Reveal>
          ))}
        </ul>
        <p className="mt-5 text-center text-xs text-cocoa-muted lg:text-left">{c.galleryNote}</p>

        {/* telas reais do app */}
        <Reveal className="mx-auto mt-20 max-w-2xl text-center lg:mx-0 lg:text-left">
          <h3 className="font-display text-[1.75rem] leading-tight text-cocoa sm:text-[2.2rem]">
            {c.screensTitle}
          </h3>
          <p className="mt-3 text-lg leading-relaxed text-cocoa">{c.screensSub}</p>
        </Reveal>
        <ScreensCarousel screens={c.screens} />
      </div>
    </section>
  );
}
