import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { IPhone } from "@/components/phone/IPhone";
import { CookScreen, HomeScreen, PricingScreen, RecipeScreen } from "@/components/phone/Screens";
import { Icon } from "@/components/ui/Icon";

/**
 * Gerador de criativos para anúncios (Instagram/Facebook).
 * Só abre em desenvolvimento: `npm run dev` e acesse /criativos.
 * Cada criativo é exportado em PNG por scripts/export-criativos.mjs.
 */
export const metadata: Metadata = { title: "Criativos", robots: { index: false, follow: false } };

type Format = "story" | "feed" | "square";
type Concept = "solado" | "tudo" | "preco" | "renda" | "ceia";
type Tone = "dark" | "light";

const SIZES: Record<Format, [number, number]> = {
  story: [1080, 1920],
  feed: [1080, 1350],
  square: [1080, 1080],
};

const COPY: Record<
  Concept,
  {
    title: ReactNode;
    sub?: string;
    bullets?: string[];
    price?: boolean;
    cta: string;
    screen: "home" | "recipe" | "cook" | "pricing";
    photo?: string;
  }
> = {
  solado: {
    title: (
      <>
        Chega de panetone <em>solado.</em>
      </>
    ),
    sub: "102 receitas de Natal com passo a passo, do jeito da Rô.",
    bullets: ["Medidas em gramas", "Timer em cada etapa", "Guia SOS se der errado"],
    cta: "Garantir meu app",
    screen: "recipe",
  },
  tudo: {
    title: (
      <>
        Panetone, docinhos e ceia. <em>Num app só.</em>
      </>
    ),
    sub: "Tudo que vai para a mesa de Natal, no seu celular.",
    bullets: ["102 receitas passo a passo", "Lista de compras automática", "Modo cozinha com timer"],
    cta: "Ver as receitas",
    screen: "home",
  },
  preco: {
    title: (
      <>
        Pague uma vez. <em>Cozinhe o Natal inteiro.</em>
      </>
    ),
    price: true,
    cta: "Garantir acesso",
    screen: "home",
  },
  renda: {
    title: (
      <>
        Seu Natal pode <em>pagar o seu janeiro.</em>
      </>
    ),
    sub: "Panetones e docinhos que vendem, e a calculadora que mostra o preço certo.",
    bullets: ["Receitas que vendem", "Calculadora de preço", "Dicas de embalagem"],
    cta: "Vender no Natal",
    screen: "pricing",
  },
  ceia: {
    title: (
      <>
        Esse ano, a ceia <em>é você quem faz.</em>
      </>
    ),
    sub: "Pernil, farofa, rabanada e o panetone que todo mundo vai pedir a receita.",
    cta: "Começar agora",
    screen: "cook",
    photo: "/images/receitas/mesa-ceia.jpg",
  },
};

function Check({ light }: { light: boolean }) {
  return (
    <span
      className={`grid h-[1.25em] w-[1.25em] shrink-0 place-items-center rounded-[0.32em] ${light ? "bg-pine text-white" : "bg-gold text-pine-deep"}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[0.8em] w-[0.8em]"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
      >
        <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
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

function Logo({ light }: { light: boolean }) {
  return (
    <div className="flex items-center gap-[18px]">
      <span
        className={`grid h-[68px] w-[68px] place-items-center rounded-[20px] ring-1 ${light ? "bg-pine text-gold-light ring-pine" : "bg-white/10 text-gold-light ring-white/20"}`}
      >
        <Icon name="panettone" className="h-[38px] w-[38px]" strokeWidth={1.8} />
      </span>
      <span className={`font-display text-[42px] ${light ? "text-cocoa" : "text-snow"}`}>
        Receitinhas <span className="italic text-gold">da Rô</span>
      </span>
    </div>
  );
}

function Screen({ which }: { which: "home" | "recipe" | "cook" | "pricing" }) {
  if (which === "recipe") return <RecipeScreen />;
  if (which === "cook") return <CookScreen />;
  if (which === "pricing") return <PricingScreen />;
  return <HomeScreen />;
}

function Background({ light, photo }: { light: boolean; photo?: string }) {
  if (light)
    return (
      <>
        <div className="absolute inset-0 bg-ivory" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_85%_80%,rgba(212,162,76,0.35)_0%,transparent_70%),radial-gradient(50%_40%_at_0%_0%,rgba(200,16,46,0.10)_0%,transparent_70%)]" />
      </>
    );
  return (
    <>
      <div className="absolute inset-0 bg-pine-deep" />
      {photo ? (
        <>
          <Image src={photo} alt="" fill priority sizes="1080px" className="object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-b from-pine-deep via-pine-deep/70 to-pine-deep/30" />
        </>
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_90%_75%,rgba(212,162,76,0.32)_0%,transparent_70%),radial-gradient(55%_40%_at_0%_0%,rgba(200,16,46,0.22)_0%,transparent_70%)]" />
      <div className="grain absolute inset-0 opacity-70" />
    </>
  );
}

function PriceBlock({ light, price, size }: { light: boolean; price: number; size: number }) {
  return (
    <div>
      <p className={`text-[34px] font-semibold ${light ? "text-cocoa-soft" : "text-snow/80"}`}>
        De <span className="line-through decoration-berry decoration-[3px]">R$ 97</span> por apenas
      </p>
      <p
        className={`font-display leading-[0.95] ${light ? "text-berry" : "text-gold-light"}`}
        style={{ fontSize: size }}
      >
        R$ {price}
      </p>
      <p
        className={`mt-3 flex items-center gap-3 text-[32px] font-semibold ${light ? "text-cocoa" : "text-snow"}`}
      >
        <Icon name="shield" className="h-[38px] w-[38px] text-gold" /> 7 dias de garantia
      </p>
    </div>
  );
}

function Cta({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-4 whitespace-nowrap rounded-full bg-gradient-to-b from-[#D81F3D] to-berry px-[52px] py-[28px] text-[38px] font-bold text-white no-underline shadow-[0_24px_50px_-16px_rgba(200,16,46,0.85)] ring-1 ring-white/20 [text-decoration:none]">
      {children} <Arrow />
    </span>
  );
}

/** Um criativo completo, no tamanho exato do formato. */
function Creative({
  concept,
  format,
  tone,
  price,
}: {
  concept: Concept;
  format: Format;
  tone: Tone;
  price: number;
}) {
  const c = COPY[concept];
  const [w, h] = SIZES[format];
  const light = tone === "light";
  const titleSize = { story: 128, feed: 108, square: 96 }[format];
  const phone = {
    story: "right-[-170px] bottom-[-470px] w-[580px] -rotate-[8deg]",
    feed: "right-[-90px] bottom-[-300px] w-[500px] -rotate-[9deg]",
    square: "right-[-80px] bottom-[-420px] w-[440px] -rotate-[9deg]",
  }[format];
  const showSub = !!c.sub && (format !== "square" || !c.bullets);

  return (
    <div
      id="creative"
      className="relative overflow-hidden"
      style={{ width: w, height: h, fontFamily: "var(--font-sans)" }}
    >
      <Background light={light} photo={c.photo} />

      <div className={`absolute ${phone}`}>
        <IPhone
          label="App Receitinhas da Rô"
          dark={c.screen === "cook"}
          overlayStatus={c.screen === "recipe"}
        >
          <Screen which={c.screen} />
        </IPhone>
      </div>

      <div
        className="relative flex h-full flex-col"
        style={{ padding: format === "story" ? "130px 84px 150px" : "76px 76px 84px" }}
      >
        <Logo light={light} />
        <h1
          className={`mt-[44px] max-w-[880px] font-display leading-[1.02] tracking-[-0.01em] [&_em]:text-gold-light ${light ? "!text-cocoa [&_em]:!text-berry" : "!text-snow"}`}
          style={{ fontSize: titleSize }}
        >
          {c.title}
        </h1>
        {showSub ? (
          <p
            className={`mt-7 max-w-[620px] text-[38px] leading-snug ${light ? "text-cocoa-soft" : "text-snow/80"}`}
          >
            {c.sub}
          </p>
        ) : null}

        <div className={`mt-auto space-y-8 ${format === "feed" ? "max-w-[560px]" : "max-w-[520px]"}`}>
          {c.price ? (
            <PriceBlock
              light={light}
              price={price}
              size={format === "square" ? 150 : format === "story" ? 160 : 190}
            />
          ) : null}
          {c.bullets ? (
            <ul className="space-y-4">
              {c.bullets.map((b) => (
                <li
                  key={b}
                  className={`flex items-center gap-4 text-[36px] font-semibold ${light ? "text-cocoa" : "text-snow"}`}
                >
                  <Check light={light} /> {b}
                </li>
              ))}
            </ul>
          ) : null}
          <Cta>{c.cta}</Cta>
        </div>
      </div>
    </div>
  );
}

/* ───────── Carrossel: uma tela larga que vira 3 slides ───────── */

function Carousel({ format, price }: { format: "square" | "feed"; price: number }) {
  const [w, h] = SIZES[format];
  const pad = 76;
  const t = format === "square" ? 100 : 112;
  return (
    <div
      id="creative"
      className="relative overflow-hidden"
      style={{ width: w * 3, height: h, fontFamily: "var(--font-sans)" }}
    >
      <Background light={false} />
      {/* faixa dourada que atravessa os 3 slides */}
      <svg className="absolute inset-0" width={w * 3} height={h} viewBox={`0 0 ${w * 3} ${h}`} fill="none">
        <path
          d={`M-50 ${h * 0.78} C ${w * 0.7} ${h * 0.55}, ${w * 1.3} ${h * 0.98}, ${w * 1.9} ${h * 0.7} S ${w * 2.7} ${h * 0.5}, ${w * 3 + 50} ${h * 0.62}`}
          stroke="rgba(212,162,76,0.35)"
          strokeWidth="70"
          strokeLinecap="round"
        />
        <path
          d={`M-50 ${h * 0.84} C ${w * 0.7} ${h * 0.61}, ${w * 1.3} ${h * 1.04}, ${w * 1.9} ${h * 0.76} S ${w * 2.7} ${h * 0.56}, ${w * 3 + 50} ${h * 0.68}`}
          stroke="rgba(242,215,155,0.45)"
          strokeWidth="3"
          strokeDasharray="10 14"
        />
      </svg>

      {/* celulares atravessando a divisa dos slides */}
      <div
        className="absolute -rotate-[8deg]"
        style={{ left: w - 230, bottom: -h * 0.42, width: format === "square" ? 420 : 470 }}
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
        <div className="flex items-center justify-between">
          <Logo light={false} />
          <Pager n={1} />
        </div>
        <h1
          className="mt-[56px] font-display leading-[1.02] !text-snow [&_em]:text-gold-light"
          style={{ fontSize: t }}
        >
          Chega de panetone <em>solado.</em>
        </h1>
        <p className="mt-7 max-w-[560px] text-[40px] leading-snug text-snow/80">
          Existe um jeito mais fácil. Arrasta pro lado →
        </p>
      </div>

      {/* slide 2 */}
      <div className="absolute top-0 flex h-full flex-col" style={{ left: w, width: w, padding: pad }}>
        <div className="flex justify-end">
          <Pager n={2} />
        </div>
        <h2
          className="ml-auto mt-[40px] max-w-[640px] text-right font-display leading-[1.02] !text-snow [&_em]:text-gold-light"
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
              className="flex items-center gap-5 rounded-[28px] bg-white/[0.08] p-5 ring-1 ring-white/15"
            >
              <span className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-[20px] bg-gold text-pine-deep">
                <Icon name={icon!} className="h-[40px] w-[40px]" strokeWidth={1.9} />
              </span>
              <span className="text-[34px] font-semibold leading-tight text-snow">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* slide 3 */}
      <div className="absolute top-0 flex h-full flex-col" style={{ left: w * 2, width: w, padding: pad }}>
        <div className="flex justify-end">
          <Pager n={3} />
        </div>
        <h2
          className="mt-[40px] font-display leading-[1.02] !text-snow [&_em]:text-gold-light"
          style={{ fontSize: t }}
        >
          Pague uma vez. <em>Cozinhe o Natal inteiro.</em>
        </h2>
        <div className="mt-10 space-y-8">
          <PriceBlock light={false} price={price} size={format === "square" ? 150 : 180} />
          <Cta>Garantir acesso</Cta>
        </div>
      </div>
    </div>
  );
}

function Pager({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-4 text-[32px] font-semibold text-snow/70">
      {n}/3
      <span className="grid h-[64px] w-[64px] place-items-center rounded-full bg-berry text-white">
        <Arrow />
      </span>
    </span>
  );
}

const CONCEPTS = Object.keys(COPY) as Concept[];
const FORMATS = Object.keys(SIZES) as Format[];

export default async function CriativosPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string; f?: string; tone?: string; p?: string; carrossel?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const q = await searchParams;
  const price = Number(q.p) || 37;
  // esconde o indicador do Next.js em desenvolvimento para não sair no PNG
  const hideDev = <style>{"nextjs-portal{display:none!important}body{margin:0}"}</style>;

  if (q.carrossel === "square" || q.carrossel === "feed")
    return <Carousel format={q.carrossel} price={price} />;
  if (q.c && q.f && CONCEPTS.includes(q.c as Concept) && FORMATS.includes(q.f as Format))
    return (
      <>
        {hideDev}
        <Creative
          concept={q.c as Concept}
          format={q.f as Format}
          tone={q.tone === "light" ? "light" : "dark"}
          price={price}
        />
      </>
    );

  return (
    <main className="space-y-2 p-8">
      <h1 className="text-3xl">Criativos</h1>
      {CONCEPTS.flatMap((c) =>
        FORMATS.map((f) => (
          <p key={c + f}>
            <Link className="underline" href={`/criativos?c=${c}&f=${f}`}>
              {c} · {f}
            </Link>
          </p>
        )),
      )}
    </main>
  );
}
