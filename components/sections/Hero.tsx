import { siteConfig } from "@/config/site.config";
import { copy } from "@/content/copy.ptBR";
import { t } from "@/lib/offer";
import { ArchPhoto, ChefAvatar } from "@/components/chef/ChefPhotos";
import { CtaLink } from "@/components/ui/CtaButton";
import { IPhone } from "@/components/phone/IPhone";
import { HomeScreen } from "@/components/phone/Screens";
import { OrangeSlice, Sprig, Star } from "@/components/decor/Ornaments";
import { Icon } from "@/components/ui/Icon";
import { Kicker } from "@/components/ui/Kicker";
import { Title } from "@/components/ui/Rich";

export function SiteLogo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span
      className={`font-display text-[1.4rem] leading-none ${tone === "dark" ? "text-snow" : "text-cocoa"}`}
    >
      Receitinhas <span className="italic text-gold">da Rô</span>
    </span>
  );
}

export function Hero() {
  const h = copy.hero;
  const { photoHero } = siteConfig.chef;
  return (
    <section id="topo" className="grain relative overflow-hidden bg-pine-deep text-snow">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_80%_30%,rgba(212,162,76,0.22)_0%,transparent_70%),radial-gradient(40%_40%_at_0%_100%,rgba(200,16,46,0.18)_0%,transparent_70%)]"
      />
      <header className="container-page relative flex items-center justify-between py-5">
        <SiteLogo />
        <Kicker tone="dark" className="hidden sm:inline-flex">
          {t(h.eyebrow)}
        </Kicker>
      </header>

      <div className="container-page relative grid items-center gap-14 pb-20 pt-2 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-4">
        <div className="lg:col-span-7">
          <p className="inline-flex items-center gap-2.5 rounded-full bg-white/10 py-1 pl-1 pr-4 text-sm font-semibold text-snow ring-1 ring-white/15">
            <ChefAvatar size={30} className="ring-2 ring-gold/70" />
            {h.pill}
          </p>
          <Title
            as="h1"
            tone="dark"
            text={h.headlines[siteConfig.hero.headline]}
            className="mt-6 text-[2.35rem] leading-[1.03] tracking-[-0.015em] sm:text-[3.4rem] lg:text-[3.7rem]"
          />
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-snow/80 sm:text-lg">{t(h.sub)}</p>

          <div className="mt-7">
            {/* primeiro mostra as receitas; o checkout vem depois da explicação */}
            <CtaLink href="#receitas" block>
              {h.cta}
            </CtaLink>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[460px] lg:col-span-5 lg:max-w-none">
          <Sprig className="absolute -top-8 right-6 z-10 w-32 rotate-6" />
          <OrangeSlice className="absolute -left-2 top-1/3 z-10 hidden w-14 sm:block" />
          <ArchPhoto
            src={photoHero.src}
            alt={photoHero.alt}
            sizes="(min-width: 1024px) 400px, 75vw"
            objectPosition="50% 35%"
            className="ml-auto aspect-[4/5] w-[78%] ring-4 ring-gold/30"
          />
          <IPhone
            label="Tela inicial do app Especial de Natal"
            className="absolute -bottom-10 left-0 w-[46%] -rotate-[5deg] motion-safe:animate-float"
          >
            <HomeScreen />
          </IPhone>
          <div className="absolute right-0 top-[58%] flex items-center gap-3 rounded-2xl bg-white px-3.5 py-3 text-cocoa shadow-lift sm:-right-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-berry-soft text-berry">
              <Icon name="flame" className="h-5 w-5" strokeWidth={2} />
            </span>
            <span>
              <span className="block text-sm font-bold">{h.floatingCard.title}</span>
              <span className="block text-xs text-cocoa-muted">{h.floatingCard.meta}</span>
            </span>
          </div>
          <Star className="absolute -right-2 bottom-4 h-6 w-6" />
        </div>
      </div>
    </section>
  );
}
