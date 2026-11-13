import Image from "next/image";
import Link from "next/link";
import { siteConfig, type SiteConfig } from "@/config/site.config";
import { copy } from "@/content/copy.ptBR";
import { story } from "@/content/story.ptBR";
import { chefDisclosure, shouldShowDisclosure } from "@/lib/offer";
import { ArchPhoto } from "@/components/chef/ChefPhotos";
import { OfferCta } from "@/components/offer/OfferBits";
import { Star } from "@/components/decor/Ornaments";
import { Kicker } from "@/components/ui/Kicker";
import { Title } from "@/components/ui/Rich";

/**
 * Conteúdo da seção. Em mode "real" (Roseli) usa a história de copy.chef; credenciais
 * comprováveis (story.real.credentials) aparecem só se forem preenchidas.
 */
export function getChefContent(cfg: SiteConfig = siteConfig) {
  const c = copy.chef;
  return {
    title: c.title,
    paragraphs: [c.p1, c.p2],
    beliefs: [...c.beliefs],
    credentials: cfg.chef.mode === "real" ? story.real.credentials : [],
    disclosure: shouldShowDisclosure(cfg) ? chefDisclosure(cfg) : null,
  };
}

/** Fotos da Roseli: arco grande + foto redonda sobreposta. */
export function ChefPhotos({ cfg = siteConfig, priority = false }: { cfg?: SiteConfig; priority?: boolean }) {
  const { photoMain, photoSecondary, caption, aiGeneratedImages } = cfg.chef;
  const content = getChefContent(cfg);
  return (
    <figure className="relative">
      <div className="relative pb-10 pr-10">
        <ArchPhoto
          src={photoMain.src}
          alt={photoMain.alt}
          priority={priority}
          sizes="(min-width: 1024px) 460px, 85vw"
          objectPosition="50% 28%"
          className="aspect-[4/5] w-full shadow-lift"
        />
        <div className="absolute bottom-0 right-0 aspect-square w-[42%] overflow-hidden rounded-full border-[6px] border-ivory shadow-lift">
          <Image
            src={photoSecondary.src}
            alt={photoSecondary.alt}
            fill
            sizes="200px"
            className="object-cover"
            style={{ objectPosition: "45% 40%" }}
          />
        </div>
        <Star className="absolute left-4 top-10 h-7 w-7" />
      </div>
      <figcaption className="mt-3 text-sm text-cocoa-muted">
        {caption}
        {content.disclosure ? (
          <span data-testid="chef-disclosure" className="mt-1 block text-xs">
            {content.disclosure}
            {aiGeneratedImages ? " Imagens geradas por IA." : ""}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}

export function Chef({
  cfg = siteConfig,
  withCta = true,
  withBeliefs = true,
}: {
  cfg?: SiteConfig;
  withCta?: boolean;
  withBeliefs?: boolean;
}) {
  const c = copy.chef;
  const content = getChefContent(cfg);
  return (
    <section id="roseli" className="section">
      <div className="container-page grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="mx-auto w-full max-w-[460px] lg:col-span-5">
          <ChefPhotos cfg={cfg} />
        </div>
        <div className="lg:col-span-7">
          <Kicker>{c.kicker}</Kicker>
          <Title text={content.title} className="h2 mt-5" />
          <p className="lead-text mt-6">{content.paragraphs[0]}</p>
          <p className="mt-4 text-base leading-relaxed text-cocoa-muted">{content.paragraphs[1]}</p>

          <p className="mt-6 font-script text-5xl leading-none text-berry">{c.signature}</p>
          <p className="mt-1 text-sm font-medium text-cocoa-muted">{c.signatureRole}</p>

          {withBeliefs ? (
            <ol className="mt-8 grid gap-3 sm:grid-cols-3">
              {content.beliefs.map((b, i) => (
                <li key={b.title} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-cocoa/5">
                  <span className="font-display text-3xl text-gold-text">0{i + 1}</span>
                  <span className="mt-2 block font-semibold leading-snug text-cocoa">{b.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed">{b.text}</span>
                </li>
              ))}
            </ol>
          ) : null}

          {content.credentials.length ? (
            <ul className="mt-6 space-y-2" data-testid="chef-credentials">
              {content.credentials.map((cr) => (
                <li key={cr} className="text-sm text-cocoa-soft">
                  • {cr}
                </li>
              ))}
            </ul>
          ) : null}

          {withCta ? (
            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <OfferCta href="/#oferta">{c.cta}</OfferCta>
              <Link
                href="/sobre"
                className="inline-flex min-h-[44px] items-center font-semibold text-pine underline decoration-gold decoration-2 underline-offset-4 hover:text-berry"
              >
                {c.storyLink} →
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
