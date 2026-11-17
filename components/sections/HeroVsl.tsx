import Link from "next/link";
import { copy } from "@/content/copy.ptBR";
import { t } from "@/lib/offer";
import { HeroPriceLine, OfferCta } from "@/components/offer/OfferBits";
import { VslPlayer } from "@/components/offer/VslPlayer";
import { Icon } from "@/components/ui/Icon";
import { Title } from "@/components/ui/Rich";
import { SiteLogo } from "@/components/sections/Hero";

/**
 * Topo da página de vendas centrado na VSL: título curto, o vídeo grande, o botão e o preço.
 * Celular: título → vídeo → botão. Computador: texto à esquerda, vídeo à direita.
 */
export function HeroVsl() {
  const h = copy.heroVsl;
  return (
    <section id="topo" className="relative overflow-hidden bg-pine-deep text-snow">
      <header className="container-page relative flex items-center justify-center py-5 sm:justify-between">
        <SiteLogo />
        <span className="hidden text-sm text-snow/70 sm:block">{t(h.edition)}</span>
      </header>

      <div className="container-page relative grid gap-8 pb-14 pt-2 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pb-24 lg:pt-6">
        <div className="text-center lg:col-span-7 lg:row-start-1 lg:text-left">
          <Title
            as="h1"
            tone="dark"
            text={h.title}
            className="text-[2.15rem] leading-[1.04] tracking-[-0.02em] sm:text-[3.2rem] lg:text-[3.7rem]"
          />
          <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-snow/85 sm:text-lg lg:mx-0 lg:max-w-xl">
            {t(h.sub)}
          </p>

          {/* no computador o botão fica ao lado do vídeo; no celular, logo abaixo dele */}
          <div className="mt-8 hidden lg:block">
            <Cta />
          </div>
        </div>

        <div className="lg:col-span-5 lg:row-start-1">
          <div className="mx-auto w-full max-w-[460px] lg:mr-0">
            <VslPlayer src="/videos/vsl.mp4" poster="/videos/vsl-capa.webp" label={h.videoLabel} />
          </div>
        </div>

        <div className="lg:hidden">
          <Cta />
        </div>
      </div>
    </section>
  );
}

function Cta() {
  const h = copy.heroVsl;
  return (
    <div className="flex flex-col items-center gap-4 lg:items-start">
      <OfferCta block className="w-full sm:w-auto">
        {h.cta}
      </OfferCta>
      <HeroPriceLine />
      <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-snow/80 lg:justify-start">
        {copy.hero.trust.map((item) => (
          <li key={item} className="flex items-center gap-1.5">
            <Icon name="check" className="h-4 w-4 text-gold" strokeWidth={2.6} />
            {t(item)}
          </li>
        ))}
      </ul>
      <Link
        href="/sobre"
        className="mt-1 inline-flex items-center gap-1 text-sm text-snow/75 underline decoration-gold/60 underline-offset-4 transition-colors hover:text-gold"
      >
        {copy.hero.chefLink}
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
