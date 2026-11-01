import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { copy } from "@/content/copy.ptBR";
import { chefDisclosure, getStaticVars, shouldShowDisclosure, t } from "@/lib/offer";
import { ChefAvatar } from "@/components/chef/ChefPhotos";
import { CheckoutCta, OfferPriceBox } from "@/components/offer/OfferBits";
import { IPhone } from "@/components/phone/IPhone";
import { HomeScreen } from "@/components/phone/Screens";
import { OrangeSlice, Sprig, Star } from "@/components/decor/Ornaments";
import { SiteLogo } from "@/components/sections/Hero";
import { ManageCookiesButton } from "@/components/tracking/CookieBanner";
import { Accordion } from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icon";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import { Title } from "@/components/ui/Rich";

/** Oferta */
export function Offer() {
  const c = copy.offer;
  return (
    <section id="oferta" className="section relative overflow-hidden bg-ivory-deep/60">
      <div className="container-page relative">
        <Reveal className="text-center">
          <Kicker>{c.kicker}</Kicker>
          <Title text={c.title} className="h2 mt-5" />
        </Reveal>
        <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-[2.5rem] bg-white shadow-lift ring-1 ring-cocoa/5 lg:grid lg:grid-cols-[1.05fr_1fr]">
          <div className="grain relative overflow-hidden bg-pine p-7 text-snow sm:p-10">
            <div className="flex items-start gap-6">
              <IPhone label="App Especial de Natal" className="hidden w-[38%] shrink-0 -rotate-3 sm:block">
                <HomeScreen />
              </IPhone>
              <ul className="space-y-4">
                {c.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[16px] font-medium leading-snug">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold text-pine-deep">
                      <Icon name="check" className="h-4 w-4" strokeWidth={2.6} />
                    </span>
                    {t(item)}
                  </li>
                ))}
              </ul>
            </div>
            <Sprig className="absolute -bottom-3 -right-4 w-36 opacity-90" />
          </div>
          <div className="p-7 sm:p-10">
            <OfferPriceBox
              staticVars={getStaticVars()}
              bump={{ enabled: siteConfig.bump.enabled, price: siteConfig.bump.price }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function GuaranteeSeal({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 160 160" className="h-36 w-36 shrink-0 sm:h-40 sm:w-40" role="img" aria-label={label}>
      <defs>
        <path id="seal-circle" d="M80 80 m-58 0 a58 58 0 1 1 116 0 a58 58 0 1 1 -116 0" />
      </defs>
      {Array.from({ length: 24 }).map((_, i) => (
        <circle
          key={i}
          cx={80 + 74 * Math.cos((i * 15 * Math.PI) / 180)}
          cy={80 + 74 * Math.sin((i * 15 * Math.PI) / 180)}
          r="7"
          fill="#D4A24C"
        />
      ))}
      <circle cx="80" cy="80" r="74" fill="#D4A24C" />
      <circle cx="80" cy="80" r="66" fill="none" stroke="#FFF3E0" strokeWidth="1.5" strokeDasharray="2 4" />
      <circle cx="80" cy="80" r="44" fill="#0F3D2E" />
      <text
        fill="#0A2B20"
        fontSize="11.5"
        fontWeight="800"
        letterSpacing="3.2"
        fontFamily="system-ui, sans-serif"
      >
        <textPath href="#seal-circle" startOffset="0">
          {`${label.toUpperCase()} · ${label.toUpperCase()} ·`}
        </textPath>
      </text>
      <text x="80" y="88" textAnchor="middle" fill="#FFF3E0" fontSize="36" fontFamily="Georgia, serif">
        {siteConfig.guarantee.days}
      </text>
      <text
        x="80"
        y="105"
        textAnchor="middle"
        fill="#F2D79B"
        fontSize="10.5"
        fontWeight="700"
        letterSpacing="2.4"
        fontFamily="system-ui, sans-serif"
      >
        {copy.guarantee.sealUnit}
      </text>
    </svg>
  );
}

/** Garantia */
export function Guarantee() {
  const c = copy.guarantee;
  return (
    <section className="py-16 sm:py-24">
      <Reveal className="container-page">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 rounded-[2.5rem] bg-white p-8 text-center shadow-soft ring-1 ring-gold/40 sm:flex-row sm:p-12 sm:text-left">
          <GuaranteeSeal label={t(c.seal)} />
          <div>
            <Title text={t(c.title)} className="text-3xl leading-tight sm:text-4xl" />
            <p className="mt-4 leading-relaxed">{t(c.text)}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function getFaqItems() {
  const items = copy.faq.items.map((i) => ({ q: t(i.q), a: t(i.a) }));
  if (siteConfig.chef.mode === "character") {
    items.push({ q: t(copy.faq.characterItem.q), a: t(copy.faq.characterItem.a) });
  }
  return items;
}

/** FAQ (o JSON-LD FAQPage é gerado na página) */
export function Faq() {
  const c = copy.faq;
  return (
    <section id="faq" className="section bg-white">
      <div className="container-page grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Kicker>{c.kicker}</Kicker>
          <Title text={c.title} className="h2 mt-5" />
          <Sprig className="mt-8 hidden w-40 lg:block" />
        </div>
        <div className="lg:col-span-8">
          <Accordion items={getFaqItems()} />
        </div>
      </div>
    </section>
  );
}

/** CTA final */
export function FinalCta() {
  const c = copy.finalCta;
  return (
    <section className="grain relative overflow-hidden bg-pine-deep text-snow">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(200,16,46,0.28)_0%,transparent_70%)]"
      />
      <OrangeSlice className="absolute -left-6 top-12 w-20 opacity-90" />
      <Sprig className="absolute -right-6 bottom-8 w-44 -rotate-12 opacity-90" />
      <div className="container-page section relative text-center">
        <ChefAvatar size={72} className="mx-auto ring-4 ring-gold/50" />
        <Title text={c.title} tone="dark" className="h2 mx-auto mt-6 max-w-3xl sm:text-6xl" />
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-snow/80">{c.text}</p>
        <div className="mt-10 flex justify-center">
          <CheckoutCta block>{c.cta}</CheckoutCta>
        </div>
        <p className="mt-4 text-sm text-snow/70">{t(c.micro)}</p>
        <Star className="mx-auto mt-10 h-5 w-5" />
      </div>
    </section>
  );
}

/** Rodapé */
export function Footer() {
  const c = copy.footer;
  const showDisclosure = shouldShowDisclosure();
  return (
    <footer id="rodape" className="bg-cocoa pb-28 pt-14 text-snow/75 md:pb-14">
      <div className="container-page grid gap-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <SiteLogo />
          <p className="mt-3 max-w-md text-sm leading-relaxed">{siteConfig.brand.tagline}</p>
          {showDisclosure ? (
            <p data-testid="footer-disclosure" className="mt-4 max-w-md text-sm leading-relaxed">
              {chefDisclosure()}
            </p>
          ) : null}
        </div>
        <nav aria-label="Links do rodapé">
          <ul className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
            {[
              { href: "/sobre", label: c.links.about },
              { href: "/termos", label: c.links.terms },
              { href: "/privacidade", label: c.links.privacy },
              { href: "/politica-de-reembolso", label: c.links.refund },
              { href: `mailto:${siteConfig.brand.supportEmail}`, label: c.links.contact },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex min-h-[44px] items-center hover:text-gold-light hover:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <ManageCookiesButton className="inline-flex min-h-[44px] items-center hover:text-gold-light hover:underline">
                {c.links.cookies}
              </ManageCookiesButton>
            </li>
          </ul>
        </nav>
      </div>
      <div className="container-page mt-10 border-t border-white/10 pt-6 text-xs leading-relaxed text-snow/70">
        <p>{c.disclaimer}</p>
        <p className="mt-2">
          {t(c.company)} · {siteConfig.brand.supportEmail}
        </p>
        <p className="mt-2">
          © {siteConfig.brand.editionYear} {siteConfig.brand.name}
        </p>
      </div>
    </footer>
  );
}
