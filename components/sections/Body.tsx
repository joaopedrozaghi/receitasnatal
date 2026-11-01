import { siteConfig } from "@/config/site.config";
import { copy } from "@/content/copy.ptBR";
import { t } from "@/lib/offer";
import { ArchPhoto } from "@/components/chef/ChefPhotos";
import { CheckoutCta } from "@/components/offer/OfferBits";
import { IPhone } from "@/components/phone/IPhone";
import { CookScreen, HomeScreen, RecipeScreen } from "@/components/phone/Screens";
import { Cinnamon, Sprig, Star } from "@/components/decor/Ornaments";
import { Icon } from "@/components/ui/Icon";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import { Rich, Title } from "@/components/ui/Rich";

/** Faixa com o cardápio rolando (para em reduced motion). */
export function Marquee() {
  const items = copy.marquee;
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center whitespace-nowrap px-5 font-display text-xl italic text-cocoa sm:text-2xl"
        >
          {item}
          <Star className="ml-10 h-4 w-4" />
        </li>
      ))}
    </ul>
  );
  return (
    <section
      aria-label="Algumas receitas do app"
      className="overflow-hidden border-y border-gold/40 bg-gold-light/60 py-4"
    >
      <div className="flex w-max motion-safe:animate-marquee">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}

/** Dor */
export function Pain() {
  const c = copy.pain;
  return (
    <section className="section">
      <div className="container-page grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Kicker>{c.kicker}</Kicker>
          <Title text={c.title} className="h2 mt-5" />
          <Cinnamon className="mt-10 hidden w-36 lg:block" />
        </Reveal>
        <div className="lg:col-span-7">
          <div className="space-y-5">
            {c.paragraphs.map((p, i) => (
              <Reveal key={i}>
                <p className="lead-text">
                  <Rich text={p} />
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-10 rounded-[2rem] bg-pine p-7 font-display text-[1.7rem] leading-snug text-snow shadow-lift sm:p-9 sm:text-[2rem]">
              <Rich text={c.turn} emClassName="text-gold-light" />
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const menuTints = [
  "bg-[#F6E3C4] text-gold-text",
  "bg-berry-soft text-berry",
  "bg-pine-soft text-pine",
  "bg-[#F3E1D6] text-cocoa-soft",
  "bg-[#EDE3F2] text-[#5B3D6E]",
  "bg-[#FCEFD3] text-[#9A5B12]",
  "bg-[#E6EEF3] text-[#2E5670]",
  "bg-berry-soft text-berry",
];

/** O cardápio completo */
export function Menu() {
  const c = copy.menu;
  return (
    <section id="cardapio" className="section bg-white">
      <div className="container-page">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Kicker>{c.kicker}</Kicker>
          <Title text={c.title} className="h2 mt-5" />
          <p className="lead-text mt-5">{t(c.sub)}</p>
        </Reveal>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.items.map((item, i) => {
            const featured = "tag" in item;
            return (
              <Reveal
                as="li"
                key={item.title}
                delay={(i % 4) * 0.05}
                className={`relative flex flex-col rounded-[1.75rem] p-6 ${
                  featured ? "bg-pine text-snow shadow-lift" : "bg-ivory ring-1 ring-cocoa/5"
                }`}
              >
                {featured ? (
                  <span className="absolute right-5 top-5 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-pine-deep">
                    {item.tag}
                  </span>
                ) : null}
                <span
                  className={`grid h-14 w-14 place-items-center rounded-2xl ${featured ? "bg-white/10 text-gold-light" : menuTints[i]}`}
                >
                  <Icon name={item.icon} className="h-7 w-7" strokeWidth={1.6} />
                </span>
                <h3 className={`mt-5 text-[1.45rem] leading-tight ${featured ? "!text-snow" : ""}`}>
                  {item.title}
                </h3>
                <p className={`mt-2 text-[15px] leading-relaxed ${featured ? "text-snow/80" : ""}`}>
                  {item.examples}
                </p>
              </Reveal>
            );
          })}
        </ul>
        <div className="mt-12 flex justify-center">
          <CheckoutCta block>{c.cta}</CheckoutCta>
        </div>
      </div>
    </section>
  );
}

/** Por dentro do app: 3 iPhones + recursos + como funciona */
export function AppShowcase() {
  const c = copy.app;
  return (
    <section id="app" className="grain relative overflow-hidden bg-pine-deep text-snow">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_45%,rgba(212,162,76,0.18)_0%,transparent_70%)]"
      />
      <div className="container-page section relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Kicker tone="dark">{c.kicker}</Kicker>
          <Title text={c.title} tone="dark" className="h2 mt-5" />
          <p className="mt-5 text-lg leading-relaxed text-snow/75">{c.sub}</p>
        </Reveal>

        {/* desktop: 3 aparelhos em leque · mobile: carrossel com rolagem */}
        <div className="-mx-5 mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 sm:mx-0 sm:justify-center sm:overflow-visible sm:px-0 lg:items-center lg:gap-0">
          <IPhone
            label="Tela de receita: Panetone Clássico com ingredientes em gramas"
            className="w-[68vw] max-w-[270px] shrink-0 snap-center sm:w-[30%] lg:translate-x-6 lg:-rotate-6"
          >
            <RecipeScreen />
          </IPhone>
          <IPhone
            label="Tela inicial do app com categorias"
            className="z-10 w-[68vw] max-w-[300px] shrink-0 snap-center sm:w-[33%] lg:-translate-y-6"
          >
            <HomeScreen />
          </IPhone>
          <IPhone
            dark
            label="Modo cozinha: passo a passo com timer e explicação do porquê"
            className="w-[68vw] max-w-[270px] shrink-0 snap-center sm:w-[30%] lg:-translate-x-6 lg:rotate-6"
          >
            <CookScreen />
          </IPhone>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.features.map((f) => (
            <Reveal as="li" key={f.title} className="rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold/15 text-gold-light">
                <Icon name={f.icon} className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 text-xl !text-snow">{f.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-snow/75">{f.text}</p>
            </Reveal>
          ))}
        </ul>

        <ol className="mt-14 grid gap-4 md:grid-cols-3">
          {c.steps.map((s, i) => (
            <li key={s.title} className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold font-display text-2xl text-pine-deep">
                {i + 1}
              </span>
              <span>
                <span className="block font-display text-xl text-snow">{s.title}</span>
                <span className="mt-1 block text-[15px] leading-relaxed text-snow/75">{s.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Desejo (cena) */
export function Desire() {
  const c = copy.desire;
  const photo = siteConfig.chef.photosAbout[0];
  return (
    <section className="section bg-ivory-deep/60">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2">
        {photo ? (
          <Reveal className="relative mx-auto w-full max-w-sm">
            <Sprig className="absolute -left-8 -top-6 z-10 w-36 -rotate-12" />
            <ArchPhoto
              src={photo.src}
              alt={photo.alt}
              sizes="(min-width: 1024px) 384px, 85vw"
              className="aspect-[4/5] w-full shadow-lift"
            />
          </Reveal>
        ) : null}
        <Reveal>
          <Kicker>{c.kicker}</Kicker>
          <Title text={c.title} className="h2 mt-5" />
          <div className="mt-6 space-y-5">
            {c.paragraphs.map((p, i) => (
              <p key={i} className="lead-text">
                <Rich text={p} />
              </p>
            ))}
          </div>
          <div className="mt-9">
            <CheckoutCta block>{c.cta}</CheckoutCta>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
