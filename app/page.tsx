import { siteConfig } from "@/config/site.config";
import { getOfferState, t } from "@/lib/offer";
import { siteUrl } from "@/lib/seo";
import { copy } from "@/content/copy.ptBR";
import { OfferShell } from "@/components/offer/OfferShell";
import { StickyCta } from "@/components/offer/OfferBits";
import { Hero } from "@/components/sections/Hero";
import { AppShowcase, Desire, Gallery, Marquee, Menu, Pain } from "@/components/sections/Body";
import { Chef } from "@/components/sections/Chef";
import { Audience, Bonus, Income, Testimonials } from "@/components/sections/Value";
import { Faq, FinalCta, Footer, Guarantee, Offer, getFaqItems } from "@/components/sections/Closing";

// Página estática regenerada a cada minuto (a fase de preço também é recalculada no navegador).
export const revalidate = 60;

const STICKY_HIDE_ON = ["oferta", "rodape"];

function JsonLd() {
  const offer = getOfferState(Date.now());
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: siteConfig.brand.fullName,
      description: t(copy.meta.description),
      image: `${siteUrl()}${siteConfig.chef.photoHero.src}`,
      brand: { "@type": "Brand", name: siteConfig.brand.name },
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        price: offer.price.toFixed(2),
        availability: "https://schema.org/InStock",
        url: siteUrl(),
        ...(offer.endsAt ? { priceValidUntil: new Date(offer.endsAt).toISOString().slice(0, 10) } : {}),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: getFaqItems().map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      })),
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const below = [
  Pain,
  Gallery,
  Menu,
  AppShowcase,
  Desire,
  Chef,
  Bonus,
  Income,
  Audience,
  Testimonials,
  Offer,
  Guarantee,
  Faq,
  FinalCta,
];

export default function Home() {
  return (
    <OfferShell>
      <JsonLd />
      <main id="conteudo">
        <Hero />
        <Marquee />
        {below.map((Section, i) => (
          <div key={i} className="cv-auto">
            <Section />
          </div>
        ))}
      </main>
      <Footer />
      <StickyCta heroId="topo" hideOnIds={STICKY_HIDE_ON} />
    </OfferShell>
  );
}
