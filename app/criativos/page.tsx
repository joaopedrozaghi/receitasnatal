import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site.config";
import { IPhone } from "@/components/phone/IPhone";
import { CookScreen, HomeScreen, PricingScreen, RecipeScreen } from "@/components/phone/Screens";
import { Icon } from "@/components/ui/Icon";
import { formatReais } from "@/lib/pricing";

/**
 * Gerador de criativos para anúncios (Instagram/Facebook).
 * Só abre em desenvolvimento: `npm run dev` e acesse /criativos.
 * Os PNGs saem com scripts/export-criativos.mjs.
 */
export const metadata: Metadata = { title: "Criativos", robots: { index: false, follow: false } };

type Format = "story" | "feed" | "square";
type Tone = "dark" | "white";
type Visual =
  | { kind: "phone"; screen: "home" | "recipe" | "cook" | "pricing" }
  | { kind: "model"; photo: string; focus?: string };

const SIZES: Record<Format, [number, number]> = {
  story: [1080, 1920],
  feed: [1080, 1350],
  square: [1080, 1080],
};

interface Concept {
  kicker: string;
  title: ReactNode;
  sub?: string;
  bullets?: string[];
  price?: boolean;
  cta: string;
  visual: Visual;
  /** foto de fundo (só no tom escuro) */
  bg?: string;
}

const CONCEPTS: Record<string, Concept> = {
  solado: {
    kicker: "Para quem nunca acertou o panetone",
    title: (
      <>
        Chega de panetone <em>solado.</em>
      </>
    ),
    sub: "102 receitas de Natal com passo a passo, do jeito da Rô.",
    bullets: ["Medidas em gramas", "Timer em cada etapa", "Guia SOS se der errado"],
    cta: "Garantir meu app",
    visual: { kind: "phone", screen: "recipe" },
  },
  tudo: {
    kicker: "Especial de Natal completo",
    title: (
      <>
        Panetone, docinhos e ceia. <em>Num app só.</em>
      </>
    ),
    sub: "Tudo que vai para a mesa de Natal, no seu celular.",
    bullets: ["102 receitas passo a passo", "Lista de compras automática", "Modo cozinha com timer"],
    cta: "Ver as receitas",
    visual: { kind: "phone", screen: "home" },
  },
  preco: {
    kicker: "Oferta de Natal",
    title: (
      <>
        Pague uma vez. <em>Cozinhe o Natal inteiro.</em>
      </>
    ),
    price: true,
    cta: "Garantir acesso",
    visual: { kind: "phone", screen: "home" },
  },
  renda: {
    kicker: "Renda extra de fim de ano",
    title: (
      <>
        Seu Natal pode <em>pagar o seu janeiro.</em>
      </>
    ),
    sub: "Panetones e docinhos que vendem, e a calculadora que mostra o preço certo.",
    bullets: ["Receitas que vendem", "Calculadora de preço", "Guia de embalagem"],
    cta: "Vender no Natal",
    visual: { kind: "phone", screen: "pricing" },
  },
  ceia: {
    kicker: "Ceia sem correria",
    title: (
      <>
        Esse ano, a ceia <em>é você quem faz.</em>
      </>
    ),
    sub: "Pernil, farofa, rabanada e o panetone que todo mundo vai pedir a receita.",
    bullets: ["Cronograma da ceia", "Porções que se ajustam", "Passo a passo com timer"],
    cta: "Começar agora",
    visual: { kind: "phone", screen: "cook" },
    bg: "/images/receitas/mesa-ceia.jpg",
  },
  rose: {
    kicker: "Com Roseli Monteiro, a Rô",
    title: (
      <>
        Eu te ensino o panetone <em>que vende sozinho.</em>
      </>
    ),
    sub: "Coloquei minhas receitas de Natal num app, com cada passo explicado.",
    bullets: ["Panetones e chocotones", "Docinhos e salgados", "Ceia completa"],
    cta: "Aprender com a Rô",
    visual: { kind: "model", photo: "/images/ro-panetone.jpg", focus: "50% 30%" },
  },
  roseOferta: {
    kicker: "Especial de Natal da Rô",
    title: (
      <>
        O Natal inteiro da Rô <em>no seu celular.</em>
      </>
    ),
    price: true,
    cta: "Garantir acesso",
    visual: { kind: "model", photo: "/images/ro-retrato.jpg", focus: "50% 25%" },
  },
  roseCaderno: {
    kicker: "Receitas de família",
    title: (
      <>
        Do meu caderninho <em>pro seu celular.</em>
      </>
    ),
    sub: "As receitas que eu faço todo Natal, agora com medidas exatas e o porquê de cada etapa.",
    bullets: ["Tudo em gramas", "Cada passo com o porquê", "Funciona no celular"],
    cta: "Ver as receitas",
    visual: { kind: "model", photo: "/images/ro-cozinha.jpg", focus: "50% 30%" },
  },
};

/* ───────── peças visuais ───────── */

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3.2">
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[0.9em] w-[0.9em]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
    >
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TopBar({ dark, pager }: { dark: boolean; pager?: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span
          className={`grid h-[60px] w-[60px] place-items-center rounded-[18px] ${dark ? "bg-white/10 text-gold-light ring-1 ring-white/20" : "bg-pine text-gold-light"}`}
        >
          <Icon name="panettone" className="h-[34px] w-[34px]" strokeWidth={1.8} />
        </span>
        <span className={`font-display text-[38px] ${dark ? "text-snow" : "text-pine-deep"}`}>
          Receitinhas <span className="italic text-gold">da Rô</span>
        </span>
      </div>
      {pager ? (
        <Pager n={pager} dark={dark} />
      ) : (
        <span
          className={`rounded-full px-5 py-2.5 text-[22px] font-bold uppercase tracking-[0.14em] ${dark ? "bg-gold/15 text-gold-light ring-1 ring-gold/40" : "bg-pine-soft text-pine ring-1 ring-pine/20"}`}
        >
          Natal 2026
        </span>
      )}
    </div>
  );
}

function Background({ dark, photo }: { dark: boolean; photo?: string }) {
  if (!dark)
    return (
      <>
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-[radial-gradient(55%_40%_at_100%_85%,rgba(15,61,46,0.16)_0%,transparent_70%),radial-gradient(45%_30%_at_0%_0%,rgba(212,162,76,0.18)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(15,61,46,0.07)_1.5px,transparent_1.5px)] bg-[size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[14px] bg-gradient-to-r from-pine via-gold to-pine" />
      </>
    );
  return (
    <>
      <div className="absolute inset-0 bg-pine-deep" />
      {photo ? (
        <>
          <Image src={photo} alt="" fill priority sizes="1080px" className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-pine-deep via-pine-deep/75 to-pine-deep/30" />
        </>
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_95%_80%,rgba(212,162,76,0.30)_0%,transparent_70%),radial-gradient(55%_40%_at_0%_0%,rgba(200,16,46,0.20)_0%,transparent_70%)]" />
      <div className="grain absolute inset-0 opacity-70" />
      <div className="absolute inset-x-0 bottom-0 h-[14px] bg-gradient-to-r from-berry via-gold to-berry" />
    </>
  );
}

function PhoneVisual({ screen, format, dark }: { screen: string; format: Format; dark: boolean }) {
  const pos = {
    story: { right: -170, bottom: -470, width: 580 },
    feed: { right: -90, bottom: -300, width: 500 },
    square: { right: -80, bottom: -420, width: 440 },
  }[format];
  return (
    <div className="absolute -rotate-[8deg]" style={pos}>
      <div
        className={`absolute -inset-16 rounded-full blur-3xl ${dark ? "bg-gold/20" : "bg-pine/15"}`}
        aria-hidden="true"
      />
      <IPhone label="App Receitinhas da Rô" dark={screen === "cook"} overlayStatus={screen === "recipe"}>
        {screen === "recipe" ? (
          <RecipeScreen />
        ) : screen === "cook" ? (
          <CookScreen />
        ) : screen === "pricing" ? (
          <PricingScreen />
        ) : (
          <HomeScreen />
        )}
      </IPhone>
    </div>
  );
}

function ModelVisual({
  photo,
  focus,
  format,
  dark,
}: {
  photo: string;
  focus?: string;
  format: Format;
  dark: boolean;
}) {
  const box = {
    story: { right: 60, bottom: 330, width: 470, height: 760 },
    feed: { right: 56, bottom: 110, width: 430, height: 640 },
    square: { right: 56, bottom: 90, width: 370, height: 520 },
  }[format];
  return (
    <div className="absolute" style={box}>
      <div
        className={`absolute -inset-4 rounded-b-[48px] rounded-t-full ${dark ? "ring-2 ring-gold/60" : "ring-2 ring-pine/30"}`}
        aria-hidden="true"
      />
      <div className="relative h-full w-full overflow-hidden rounded-b-[40px] rounded-t-full shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)]">
        <Image
          src={photo}
          alt=""
          fill
          priority
          sizes="500px"
          className="object-cover"
          style={{ objectPosition: focus }}
        />
      </div>
      <div
        className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-7 py-3.5 text-center shadow-lift ${dark ? "bg-snow text-pine-deep" : "bg-pine text-white"}`}
      >
        <span className="block font-display text-[30px] leading-none">Roseli Monteiro</span>
        <span
          className={`mt-1 block text-[18px] font-semibold uppercase tracking-[0.14em] ${dark ? "text-berry" : "text-gold-light"}`}
        >
          a Rô das Receitinhas
        </span>
      </div>
    </div>
  );
}

function Price({ dark, price, size }: { dark: boolean; price: number; size: number }) {
  const anchor = siteConfig.pricing.anchorPrice;
  return (
    <div>
      <span className="inline-flex items-center gap-3 rounded-full bg-berry px-5 py-2 text-[26px] font-bold text-white">
        -{Math.round((1 - price / anchor) * 100)}% · De{" "}
        <span className="line-through decoration-2">R$ {formatReais(anchor)}</span>
      </span>
      <p
        className={`mt-3 flex items-start font-display leading-[0.9] ${dark ? "text-gold-light" : "text-pine-deep"}`}
      >
        <span style={{ fontSize: size * 0.32 }} className="mr-2 mt-[0.35em]">
          R$
        </span>
        <span style={{ fontSize: size }}>{formatReais(price)}</span>
      </p>
      <p className={`mt-2 text-[28px] font-semibold ${dark ? "text-snow/80" : "text-cocoa-soft"}`}>
        pagamento único · acesso imediato
      </p>
    </div>
  );
}

function Cta({ dark, children }: { dark: boolean; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-4 whitespace-nowrap rounded-full px-[52px] py-[28px] text-[38px] font-bold text-white ring-1 ring-white/20 ${
        dark
          ? "bg-gradient-to-b from-[#D81F3D] to-berry shadow-[0_24px_50px_-16px_rgba(200,16,46,0.85)]"
          : "bg-gradient-to-b from-pine-line to-pine shadow-[0_24px_50px_-16px_rgba(15,61,46,0.8)]"
      }`}
    >
      {children} <Arrow />
    </span>
  );
}

function Trust({ dark }: { dark: boolean }) {
  const ic = `h-[30px] w-[30px] ${dark ? "text-gold" : "text-pine"}`;
  return (
    <p
      className={`flex items-center gap-6 text-[24px] font-semibold ${dark ? "text-snow/70" : "text-cocoa-muted"}`}
    >
      <span className="flex items-center gap-2">
        <Icon name="shield" className={ic} /> 7 dias de garantia
      </span>
      <span className="flex items-center gap-2">
        <Icon name="phone" className={ic} /> Acesso na hora
      </span>
    </p>
  );
}

function Pager({ n, dark }: { n: number; dark: boolean }) {
  return (
    <span
      className={`flex items-center gap-4 text-[30px] font-semibold ${dark ? "text-snow/70" : "text-cocoa-muted"}`}
    >
      {n}/3
      <span
        className={`grid h-[60px] w-[60px] place-items-center rounded-full text-white ${dark ? "bg-berry" : "bg-pine"}`}
      >
        <Arrow />
      </span>
    </span>
  );
}

const titleCls = (dark: boolean) =>
  `font-display leading-[1.02] tracking-[-0.01em] ${dark ? "!text-snow [&_em]:text-gold-light" : "!text-pine-deep [&_em]:text-pine"}`;
const kickerCls = (dark: boolean) =>
  `text-[26px] font-bold uppercase tracking-[0.16em] ${dark ? "text-gold" : "text-berry"}`;

/** Um criativo completo, no tamanho exato do formato. */
function Creative({ id, format, tone, price }: { id: string; format: Format; tone: Tone; price: number }) {
  const c = CONCEPTS[id]!;
  const [w, h] = SIZES[format];
  const dark = tone === "dark";
  const isModel = c.visual.kind === "model";
  const titleSize = { story: 120, feed: 100, square: 86 }[format];
  const showSub = !!c.sub && format !== "square";
  const colWidth = format === "feed" && !isModel ? 560 : 520;

  return (
    <div
      id="creative"
      className="relative overflow-hidden"
      style={{ width: w, height: h, fontFamily: "var(--font-sans)" }}
    >
      <Background dark={dark} photo={dark ? c.bg : undefined} />
      {c.visual.kind === "phone" ? (
        <PhoneVisual screen={c.visual.screen} format={format} dark={dark} />
      ) : (
        <ModelVisual photo={c.visual.photo} focus={c.visual.focus} format={format} dark={dark} />
      )}

      <div
        className="relative flex h-full flex-col"
        style={{ padding: format === "story" ? "150px 80px 260px" : "70px 72px 92px" }}
      >
        <TopBar dark={dark} />
        <p className={`mt-[48px] ${kickerCls(dark)}`}>{c.kicker}</p>
        <h1
          className={`mt-4 ${titleCls(dark)}`}
          style={{ fontSize: titleSize, maxWidth: isModel ? 600 : 900 }}
        >
          {c.title}
        </h1>
        {showSub ? (
          <p
            className={`mt-6 text-[36px] leading-snug ${dark ? "text-snow/80" : "text-cocoa-soft"}`}
            style={{ maxWidth: isModel ? 520 : 640 }}
          >
            {c.sub}
          </p>
        ) : null}

        <div className="mt-auto space-y-8" style={{ maxWidth: colWidth }}>
          {c.price ? (
            <Price
              dark={dark}
              price={price}
              size={isModel ? (format === "square" ? 104 : 130) : format === "square" ? 140 : 180}
            />
          ) : null}
          {c.bullets && !c.price ? (
            <ul className="space-y-4">
              {c.bullets.map((b) => (
                <li
                  key={b}
                  className={`flex items-center gap-4 text-[34px] font-semibold ${dark ? "text-snow" : "text-pine-deep"}`}
                >
                  <span
                    className={`grid h-[44px] w-[44px] shrink-0 place-items-center rounded-full ${dark ? "bg-gold text-pine-deep" : "bg-pine text-white"}`}
                  >
                    <CheckIcon className="h-[26px] w-[26px]" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="space-y-5">
            <Cta dark={dark}>{c.cta}</Cta>
            {format !== "square" ? <Trust dark={dark} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── Carrossel: uma tela larga que vira 3 slides ───────── */

function Carousel({ format, tone, price }: { format: "square" | "feed"; tone: Tone; price: number }) {
  const [w, h] = SIZES[format];
  const dark = tone === "dark";
  const pad = 72;
  const t = format === "square" ? 96 : 108;
  return (
    <div
      id="creative"
      className="relative overflow-hidden"
      style={{ width: w * 3, height: h, fontFamily: "var(--font-sans)" }}
    >
      <Background dark={dark} />
      <svg className="absolute inset-0" width={w * 3} height={h} viewBox={`0 0 ${w * 3} ${h}`} fill="none">
        <path
          d={`M-50 ${h * 0.78} C ${w * 0.7} ${h * 0.55}, ${w * 1.3} ${h * 0.98}, ${w * 1.9} ${h * 0.7} S ${w * 2.7} ${h * 0.5}, ${w * 3 + 50} ${h * 0.62}`}
          stroke={dark ? "rgba(212,162,76,0.30)" : "rgba(15,61,46,0.10)"}
          strokeWidth="70"
          strokeLinecap="round"
        />
        <path
          d={`M-50 ${h * 0.84} C ${w * 0.7} ${h * 0.61}, ${w * 1.3} ${h * 1.04}, ${w * 1.9} ${h * 0.76} S ${w * 2.7} ${h * 0.56}, ${w * 3 + 50} ${h * 0.68}`}
          stroke={dark ? "rgba(242,215,155,0.45)" : "rgba(15,61,46,0.35)"}
          strokeWidth="3"
          strokeDasharray="10 14"
        />
      </svg>

      {/* Roseli no slide 1; celulares atravessando as divisas */}
      <div
        className="absolute"
        style={{ left: w - 450, bottom: 90, width: 370, height: format === "square" ? 520 : 680 }}
      >
        <div
          className={`absolute -inset-4 rounded-b-[48px] rounded-t-full ring-2 ${dark ? "ring-gold/60" : "ring-pine/30"}`}
        />
        <div className="relative h-full w-full overflow-hidden rounded-b-[40px] rounded-t-full shadow-lift">
          <Image
            src="/images/ro-panetone.jpg"
            alt=""
            fill
            sizes="400px"
            className="object-cover"
            style={{ objectPosition: "50% 30%" }}
          />
        </div>
      </div>
      <div
        className="absolute -rotate-[8deg]"
        style={{
          left: w * 2 - 250,
          bottom: format === "square" ? -h * 0.66 : -h * 0.45,
          width: format === "square" ? 400 : 470,
        }}
      >
        <IPhone label="Tela inicial do app">
          <HomeScreen />
        </IPhone>
      </div>
      <div
        className="absolute rotate-[8deg]"
        style={{ left: w * 3 - 300, bottom: -h * 0.5, width: format === "square" ? 400 : 440 }}
      >
        <IPhone label="Tela de receita" overlayStatus>
          <RecipeScreen />
        </IPhone>
      </div>

      {/* slide 1 */}
      <div className="absolute top-0 flex h-full flex-col" style={{ left: 0, width: w, padding: pad }}>
        <TopBar dark={dark} pager={1} />
        <p className={`mt-[48px] ${kickerCls(dark)}`}>Com Roseli Monteiro</p>
        <h1 className={`mt-4 max-w-[540px] ${titleCls(dark)}`} style={{ fontSize: t }}>
          Chega de panetone <em>solado.</em>
        </h1>
        <p
          className={`mt-6 max-w-[480px] text-[36px] leading-snug ${dark ? "text-snow/80" : "text-cocoa-soft"}`}
        >
          Existe um jeito mais fácil. Arrasta pro lado →
        </p>
      </div>

      {/* slide 2 */}
      <div className="absolute top-0 flex h-full flex-col" style={{ left: w, width: w, padding: pad }}>
        <div className="flex justify-end">
          <Pager n={2} dark={dark} />
        </div>
        <h2
          className={`ml-auto mt-[40px] max-w-[640px] text-right ${titleCls(dark)}`}
          style={{ fontSize: t }}
        >
          Tudo num <em>app só.</em>
        </h2>
        <ul className="ml-auto mt-10 w-[600px] space-y-5">
          {[
            ["panettone", "Panetones, docinhos, salgados e ceia"],
            ["clock", "Passo a passo com timer em cada etapa"],
            ["list", "Lista de compras que se monta sozinha"],
          ].map(([icon, text]) => (
            <li
              key={text}
              className={`flex items-center gap-5 rounded-[28px] p-5 ring-1 ${dark ? "bg-white/[0.08] ring-white/15" : "bg-white shadow-soft ring-pine/10"}`}
            >
              <span
                className={`grid h-[72px] w-[72px] shrink-0 place-items-center rounded-[20px] ${dark ? "bg-gold text-pine-deep" : "bg-pine text-gold-light"}`}
              >
                <Icon name={icon!} className="h-[40px] w-[40px]" strokeWidth={1.9} />
              </span>
              <span
                className={`text-[34px] font-semibold leading-tight ${dark ? "text-snow" : "text-pine-deep"}`}
              >
                {text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* slide 3 */}
      <div className="absolute top-0 flex h-full flex-col" style={{ left: w * 2, width: w, padding: pad }}>
        <div className="flex justify-end">
          <Pager n={3} dark={dark} />
        </div>
        <h2 className={`mt-[40px] ${titleCls(dark)}`} style={{ fontSize: t }}>
          Pague uma vez. <em>Cozinhe o Natal inteiro.</em>
        </h2>
        <div className="mt-10 space-y-8">
          <Price dark={dark} price={price} size={format === "square" ? 140 : 170} />
          <Cta dark={dark}>Garantir acesso</Cta>
        </div>
      </div>
    </div>
  );
}

/* ───────── Promo: panetone em destaque + preço ───────── */

type Promo = "foto" | "selo" | "grade";
const PROMOS: Promo[] = ["foto", "selo", "grade"];

/** Selo redondo de preço, levemente girado. */
function PriceSticker({ price, size }: { price: number; size: number }) {
  return (
    <div
      className="grid place-items-center rounded-full bg-gradient-to-b from-[#D81F3D] to-berry text-center text-white shadow-[0_30px_60px_-20px_rgba(200,16,46,0.9)] ring-[6px] ring-white"
      style={{ width: size, height: size, transform: "rotate(-10deg)" }}
    >
      <div>
        <p className="font-bold uppercase tracking-[0.14em]" style={{ fontSize: size * 0.085 }}>
          Por apenas
        </p>
        <p className="font-display leading-none" style={{ fontSize: size * 0.27 }}>
          <span style={{ fontSize: size * 0.1 }} className="mr-1 align-top">
            R$
          </span>
          {formatReais(price)}
        </p>
        <p className="font-semibold opacity-90" style={{ fontSize: size * 0.075 }}>
          de <span className="line-through">R$ {formatReais(siteConfig.pricing.anchorPrice)}</span>
        </p>
      </div>
    </div>
  );
}

function PromoCreative({
  promo,
  format,
  tone,
  price,
}: {
  promo: Promo;
  format: Format;
  tone: Tone;
  price: number;
}) {
  const [w, h] = SIZES[format];
  const dark = tone === "dark";
  const pad = format === "story" ? { top: 150, bottom: 260 } : { top: 70, bottom: 80 };
  const titleSize = { story: 104, feed: 88, square: 74 }[format];
  const sticker = { story: 330, feed: 290, square: 240 }[format];
  const textMain = dark ? "text-snow" : "text-pine-deep";

  if (promo === "foto") {
    const photoH = { story: 1060, feed: 760, square: 560 }[format];
    return (
      <div
        id="creative"
        className="relative overflow-hidden"
        style={{ width: w, height: h, fontFamily: "var(--font-sans)" }}
      >
        <Background dark={dark} />
        <div className="absolute inset-x-0 top-0 overflow-hidden rounded-b-[64px]" style={{ height: photoH }}>
          <Image
            src="/images/app/receitas/panetone-trufado-de-chocolate.jpg"
            alt=""
            fill
            priority
            sizes="1080px"
            className="object-cover"
            style={{ objectPosition: "50% 45%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-transparent" />
        </div>
        <div className="absolute inset-x-0" style={{ top: pad.top - 10, padding: "0 72px" }}>
          <TopBar dark />
        </div>
        <div className="absolute" style={{ right: 60, top: photoH - sticker * 0.7 }}>
          <PriceSticker price={price} size={sticker} />
        </div>
        <div
          className="absolute inset-x-0 flex flex-col"
          style={{ top: photoH + 50, bottom: pad.bottom, padding: "0 72px" }}
        >
          <p className={kickerCls(dark)}>Receita completa no app</p>
          <h1 className={`mt-3 ${titleCls(dark)}`} style={{ fontSize: titleSize, maxWidth: 700 }}>
            Panetone trufado <em>de confeitaria</em>, feito em casa.
          </h1>
          <div className="mt-auto flex flex-col items-start gap-5">
            <Cta dark={dark}>Ver a receita</Cta>
            {format !== "square" ? <Trust dark={dark} /> : null}
          </div>
        </div>
      </div>
    );
  }

  if (promo === "selo") {
    const circle = { story: 640, feed: 520, square: 400 }[format];
    return (
      <div
        id="creative"
        className="relative overflow-hidden"
        style={{ width: w, height: h, fontFamily: "var(--font-sans)" }}
      >
        <Background dark={dark} />
        <div
          className="relative flex h-full flex-col items-center text-center"
          style={{ padding: `${pad.top}px 72px ${pad.bottom}px` }}
        >
          <div className="w-full">
            <TopBar dark={dark} />
          </div>
          <h1 className={`mt-10 ${titleCls(dark)}`} style={{ fontSize: titleSize * 0.92, maxWidth: 900 }}>
            102 receitas de Natal por <em>menos de R$ 25.</em>
          </h1>
          <div className="relative my-auto" style={{ width: circle, height: circle }}>
            <div
              className={`absolute -inset-5 rounded-full border-[3px] border-dashed ${dark ? "border-gold/60" : "border-pine/30"}`}
            />
            <div className="relative h-full w-full overflow-hidden rounded-full shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)]">
              <Image
                src="/images/app/receitas/panetone-classico-de-frutas.jpg"
                alt=""
                fill
                priority
                sizes="700px"
                className="object-cover"
              />
            </div>
            <div className="absolute" style={{ right: -sticker * 0.35, bottom: -sticker * 0.15 }}>
              <PriceSticker price={price} size={sticker * 0.9} />
            </div>
          </div>
          <div className="space-y-4">
            <Cta dark={dark}>Garantir acesso</Cta>
            {format !== "square" ? (
              <div className="flex justify-center">
                <Trust dark={dark} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  // grade de panetones
  const items = [
    ["panetone-trufado-de-chocolate", "Trufado"],
    ["chocotone", "Chocotone"],
    ["panetone-de-doce-de-leite", "Doce de leite"],
    ["panetone-de-frutas-vermelhas", "Frutas vermelhas"],
  ];
  const gridH = { story: 900, feed: 640, square: 470 }[format];
  return (
    <div
      id="creative"
      className="relative overflow-hidden"
      style={{ width: w, height: h, fontFamily: "var(--font-sans)" }}
    >
      <Background dark={dark} />
      <div className="relative flex h-full flex-col" style={{ padding: `${pad.top}px 72px ${pad.bottom}px` }}>
        <TopBar dark={dark} />
        <h1 className={`mt-10 ${titleCls(dark)}`} style={{ fontSize: titleSize }}>
          16 panetones. <em>Um preço só.</em>
        </h1>
        <div className="mt-8 grid grid-cols-2 gap-5" style={{ height: gridH }}>
          {items.map(([slug, label]) => (
            <div key={slug} className="relative overflow-hidden rounded-[32px] shadow-soft">
              <Image
                src={`/images/app/receitas/${slug}.jpg`}
                alt=""
                fill
                priority
                sizes="520px"
                className="object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-14 text-[30px] font-semibold text-white">
                {label}
              </span>
            </div>
          ))}
        </div>
        <div
          className={`mt-auto flex items-center justify-between gap-6 rounded-[36px] p-6 pl-9 ${dark ? "bg-white/[0.08] ring-1 ring-white/15" : "bg-pine-soft"}`}
        >
          <div className={textMain}>
            <p className="text-[26px] font-semibold opacity-75">
              + 86 receitas · de{" "}
              <span className="line-through">R$ {formatReais(siteConfig.pricing.anchorPrice)}</span> por
            </p>
            <p
              className={`font-display leading-none ${dark ? "text-gold-light" : "text-pine-deep"}`}
              style={{ fontSize: format === "square" ? 76 : 92 }}
            >
              <span className="mr-2 align-top text-[0.4em]">R$</span>
              {formatReais(price)}
            </p>
          </div>
          <Cta dark={dark}>Garantir</Cta>
        </div>
      </div>
    </div>
  );
}

const FORMATS = Object.keys(SIZES) as Format[];

export default async function CriativosPage({
  searchParams,
}: {
  searchParams: Promise<{
    c?: string;
    f?: string;
    tone?: string;
    p?: string;
    carrossel?: string;
    promo?: string;
  }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const q = await searchParams;
  const price = Number(q.p) || siteConfig.pricing.phases[0]!.price;
  const tone: Tone = q.tone === "white" ? "white" : "dark";
  // esconde o indicador do Next.js em desenvolvimento para não sair no PNG
  const hideDev = <style>{"nextjs-portal{display:none!important}body{margin:0}"}</style>;

  if (q.carrossel === "square" || q.carrossel === "feed")
    return (
      <>
        {hideDev}
        <Carousel format={q.carrossel} tone={tone} price={price} />
      </>
    );
  if (q.promo && PROMOS.includes(q.promo as Promo) && FORMATS.includes(q.f as Format))
    return (
      <>
        {hideDev}
        <PromoCreative promo={q.promo as Promo} format={q.f as Format} tone={tone} price={price} />
      </>
    );
  if (q.c && q.f && q.c in CONCEPTS && FORMATS.includes(q.f as Format))
    return (
      <>
        {hideDev}
        <Creative id={q.c} format={q.f as Format} tone={tone} price={price} />
      </>
    );

  return (
    <main className="space-y-2 p-8">
      <h1 className="text-3xl">Criativos</h1>
      {Object.keys(CONCEPTS).flatMap((c) =>
        FORMATS.map((f) => (
          <p key={c + f}>
            <Link className="underline" href={`/criativos?c=${c}&f=${f}`}>
              {c} · {f}
            </Link>{" "}
            ·{" "}
            <Link className="underline" href={`/criativos?c=${c}&f=${f}&tone=white`}>
              branco
            </Link>
          </p>
        )),
      )}
    </main>
  );
}
