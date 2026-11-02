import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { siteConfig } from "@/config/site.config";
import { Icon } from "@/components/ui/Icon";
import { formatReais } from "@/lib/pricing";
import { Phone3D, type Finish } from "./Phone3D";

/**
 * Criativos de anúncio com o iPhone 17 Pro em 3D (só em desenvolvimento).
 * Fluxo: `npm run dev` → `node scripts/export-telas.mjs` → `node scripts/export-criativos.mjs`.
 */
export const metadata: Metadata = { title: "Criativos", robots: { index: false, follow: false } };

type Format = "story" | "feed" | "square";
const SIZES: Record<Format, [number, number]> = {
  story: [1080, 1920],
  feed: [1080, 1350],
  square: [1080, 1080],
};

/* ───────── paletas ───────── */

interface Tone {
  bg: string;
  glow: string;
  text: string;
  muted: string;
  accent: string;
  eyebrow: string;
  ctaBg: string;
  ctaText: string;
  line: string;
  finish: Finish;
  dark: boolean;
}

const TONES: Record<string, Tone> = {
  // verde-noite com champanhe
  noite: {
    bg: "linear-gradient(165deg, #123A2E 0%, #0B261E 55%, #071A14 100%)",
    glow: "rgba(227,199,138,0.20)",
    text: "#F7F3EC",
    muted: "rgba(247,243,236,0.72)",
    accent: "#E3C78A",
    eyebrow: "#E3C78A",
    ctaBg: "#F7F3EC",
    ctaText: "#0B261E",
    line: "rgba(247,243,236,0.16)",
    finish: "silver",
    dark: true,
  },
  // branco puro com verde
  branco: {
    bg: "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 55%, #F1F5F2 100%)",
    glow: "rgba(18,58,46,0.10)",
    text: "#0B261E",
    muted: "#55645D",
    accent: "#1F6B52",
    eyebrow: "#A8323A",
    ctaBg: "#0B261E",
    ctaText: "#FFFFFF",
    line: "rgba(11,38,30,0.12)",
    finish: "graphite",
    dark: false,
  },
  // creme quente
  creme: {
    bg: "linear-gradient(180deg, #FBF7F0 0%, #F4ECDF 100%)",
    glow: "rgba(176,128,60,0.16)",
    text: "#1E2A22",
    muted: "#6A6052",
    accent: "#9B6A2B",
    eyebrow: "#9B6A2B",
    ctaBg: "#0B261E",
    ctaText: "#FBF7F0",
    line: "rgba(30,42,34,0.12)",
    finish: "orange",
    dark: false,
  },
  // branco esverdeado
  menta: {
    bg: "linear-gradient(180deg, #F5F9F6 0%, #E4EFE8 100%)",
    glow: "rgba(31,107,82,0.16)",
    text: "#0B261E",
    muted: "#4F6158",
    accent: "#1F6B52",
    eyebrow: "#1F6B52",
    ctaBg: "#A8323A",
    ctaText: "#FFFFFF",
    line: "rgba(11,38,30,0.12)",
    finish: "silver",
    dark: false,
  },
};

/* ───────── conceitos ───────── */

type Hero =
  | { kind: "phone"; screen: string; layout: "side" | "center" }
  | { kind: "duo"; front: string; back: string }
  | { kind: "model"; photo: string; focus?: string; screen: string }
  | { kind: "photo"; photo: string };

interface Concept {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
  points?: string[];
  price?: boolean;
  cta: string;
  hero: Hero;
}

const CONCEPTS: Record<string, Concept> = {
  solado: {
    eyebrow: "Especial de Natal",
    title: (
      <>
        Chega de panetone <em>solado.</em>
      </>
    ),
    sub: "102 receitas com passo a passo, medidas em gramas e o porquê de cada etapa.",
    cta: "Garantir meu app",
    hero: { kind: "phone", screen: "recipe", layout: "side" },
  },
  tudo: {
    eyebrow: "102 receitas · 1 app",
    title: (
      <>
        Panetone, docinhos e ceia. <em>Num app só.</em>
      </>
    ),
    points: ["Passo a passo com timer", "Lista de compras automática", "Porções que se ajustam"],
    cta: "Ver as receitas",
    hero: { kind: "duo", front: "home", back: "recipe" },
  },
  preco: {
    eyebrow: "Oferta de Natal",
    title: (
      <>
        Pague uma vez. <em>Cozinhe o Natal inteiro.</em>
      </>
    ),
    price: true,
    cta: "Garantir acesso",
    hero: { kind: "phone", screen: "home", layout: "center" },
  },
  renda: {
    eyebrow: "Renda extra no Natal",
    title: (
      <>
        Seu Natal pode <em>pagar o seu janeiro.</em>
      </>
    ),
    sub: "Receitas que vendem e a calculadora que mostra o preço certo de cada panetone.",
    cta: "Vender no Natal",
    hero: { kind: "phone", screen: "pricing", layout: "side" },
  },
  cozinha: {
    eyebrow: "Modo cozinha",
    title: (
      <>
        Um passo de cada vez. <em>Sem errar o ponto.</em>
      </>
    ),
    sub: "Tela sempre acesa, timer em cada etapa e a explicação de cada passo.",
    cta: "Começar agora",
    hero: { kind: "phone", screen: "cook", layout: "center" },
  },
  rose: {
    eyebrow: "Com Roseli Monteiro",
    title: (
      <>
        Eu te ensino o panetone <em>que vende sozinho.</em>
      </>
    ),
    sub: "Minhas receitas de Natal num app, com cada passo explicado.",
    cta: "Aprender com a Rô",
    hero: { kind: "model", photo: "/images/ro-panetone.jpg", focus: "50% 30%", screen: "home" },
  },
  roseOferta: {
    eyebrow: "Natal da Rô",
    title: (
      <>
        O Natal inteiro da Rô <em>no seu celular.</em>
      </>
    ),
    price: true,
    cta: "Garantir acesso",
    hero: { kind: "model", photo: "/images/ro-retrato.jpg", focus: "50% 22%", screen: "recipe" },
  },
  panetone: {
    eyebrow: "Receita completa no app",
    title: (
      <>
        Panetone trufado <em>de confeitaria</em>, feito em casa.
      </>
    ),
    price: true,
    cta: "Ver a receita",
    hero: { kind: "photo", photo: "/images/app/receitas/panetone-trufado-de-chocolate.jpg" },
  },
};

/* ───────── peças ───────── */

const tela = (s: string) => `/criativos/telas/${s}.png`;

function Logo({ t }: { t: Tone }) {
  return (
    <div className="flex items-center gap-4">
      <span
        className="grid h-[58px] w-[58px] place-items-center rounded-[17px]"
        style={{ background: t.dark ? "rgba(247,243,236,0.10)" : "#0B261E", color: "#E3C78A" }}
      >
        <Icon name="panettone" className="h-[32px] w-[32px]" strokeWidth={1.8} />
      </span>
      <span className="font-display text-[36px] leading-none" style={{ color: t.text }}>
        Receitinhas{" "}
        <span className="italic" style={{ color: t.dark ? "#E3C78A" : "#9B6A2B" }}>
          da Rô
        </span>
      </span>
    </div>
  );
}

function Eyebrow({ t, children }: { t: Tone; children: ReactNode }) {
  return (
    <p
      className="flex items-center gap-4 text-[24px] font-bold uppercase tracking-[0.22em]"
      style={{ color: t.eyebrow }}
    >
      <span className="h-[2px] w-[44px]" style={{ background: t.eyebrow }} />
      {children}
    </p>
  );
}

function Title({
  t,
  size,
  children,
  center,
}: {
  t: Tone;
  size: number;
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <h1
      className={`font-display leading-[1.02] tracking-[-0.015em] [&_em]:italic ${center ? "text-center" : ""}`}
      style={{ fontSize: size, color: t.text, ["--em" as string]: t.accent } as CSSProperties}
    >
      <span className="[&_em]:[color:var(--em)]">{children}</span>
    </h1>
  );
}

function Cta({ t, children }: { t: Tone; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-5 whitespace-nowrap rounded-full px-[48px] py-[26px] text-[34px] font-semibold"
      style={{
        background: t.ctaBg,
        color: t.ctaText,
        boxShadow: t.dark ? "0 20px 50px -18px rgba(0,0,0,0.6)" : "0 20px 44px -18px rgba(11,38,30,0.45)",
      }}
    >
      {children}
      <svg
        viewBox="0 0 24 24"
        className="h-[30px] w-[30px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      >
        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Trust({ t, center }: { t: Tone; center?: boolean }) {
  return (
    <p
      className={`flex items-center gap-7 whitespace-nowrap text-[23px] font-medium ${center ? "justify-center" : ""}`}
      style={{ color: t.muted }}
    >
      {["7 dias de garantia", "Acesso imediato"].map((x) => (
        <span key={x} className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            className="h-[24px] w-[24px]"
            fill="none"
            stroke={t.accent}
            strokeWidth="2.6"
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {x}
        </span>
      ))}
    </p>
  );
}

function Price({ t, price, size, center }: { t: Tone; price: number; size: number; center?: boolean }) {
  const anchor = siteConfig.pricing.anchorPrice;
  return (
    <div className={center ? "text-center" : ""}>
      <p
        className={`flex items-center gap-4 text-[28px] font-medium ${center ? "justify-center" : ""}`}
        style={{ color: t.muted }}
      >
        <span className="line-through decoration-[2px]">de R$ {formatReais(anchor)}</span>
        <span
          className="rounded-full px-4 py-1.5 text-[22px] font-bold text-white"
          style={{ background: "#A8323A" }}
        >
          -{Math.round((1 - price / anchor) * 100)}%
        </span>
      </p>
      <p
        className="mt-1 font-display leading-[0.95]"
        style={{ color: t.dark ? t.accent : t.text, fontSize: size }}
      >
        <span className="mr-2 align-[0.55em]" style={{ fontSize: size * 0.34 }}>
          R$
        </span>
        {formatReais(price)}
      </p>
    </div>
  );
}

function Points({ t, items }: { t: Tone; items: string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((x) => (
        <li key={x} className="flex items-center gap-4 text-[32px] font-medium" style={{ color: t.text }}>
          <span className="h-[10px] w-[10px] rotate-45" style={{ background: t.accent }} />
          {x}
        </li>
      ))}
    </ul>
  );
}

/** luz difusa atrás do produto */
function Glow({ t, style }: { t: Tone; style: CSSProperties }) {
  return (
    <div
      className="absolute rounded-full"
      style={{ background: `radial-gradient(closest-side, ${t.glow}, transparent)`, ...style }}
    />
  );
}

/* ───────── criativo ───────── */

function Creative({
  id,
  format,
  toneId,
  price,
}: {
  id: string;
  format: Format;
  toneId: string;
  price: number;
}) {
  const c = CONCEPTS[id]!;
  const t = TONES[toneId]!;
  const [W, H] = SIZES[format];
  const story = format === "story";
  const square = format === "square";
  const titleSize = { story: 112, feed: 94, square: 80 }[format];
  const padX = 76;
  const top = story ? 210 : 72;
  const bottom = story ? 300 : 76;
  const h = c.hero;

  // celular centralizado (embaixo) ou ao lado (direita)
  const centered = story || (!square && h.kind === "phone" && h.layout === "center");

  let hero: ReactNode = null;
  let textWidth = 900;

  if (h.kind === "phone" || h.kind === "duo") {
    if (centered) {
      const ph = { story: 1180, feed: 900, square: 700 }[format];
      const pw = ph * 0.62;
      const y = story ? (c.price ? 1100 : 990) : 905;
      hero = (
        <>
          <Glow
            t={t}
            style={{ left: W / 2 - ph * 0.6, top: y - ph * 0.05, width: ph * 1.2, height: ph * 1.1 }}
          />
          {h.kind === "duo" ? (
            <>
              <div className="absolute" style={{ left: W / 2 - pw * 0.95, top: y + ph * 0.06 }}>
                <Phone3D
                  screen={tela(h.back)}
                  width={pw}
                  height={ph}
                  yaw={24}
                  roll={4}
                  pitch={4}
                  finish={t.finish}
                  zoom={0.92}
                />
              </div>
              <div className="absolute" style={{ left: W / 2 - pw * 0.25, top: y }}>
                <Phone3D
                  screen={tela(h.front)}
                  width={pw}
                  height={ph}
                  yaw={-16}
                  roll={-3}
                  finish={t.finish}
                />
              </div>
            </>
          ) : (
            <div className="absolute" style={{ left: W / 2 - pw / 2, top: y }}>
              <Phone3D
                screen={tela(h.screen)}
                width={pw}
                height={ph}
                yaw={-14}
                pitch={8}
                roll={-2}
                finish={t.finish}
              />
            </div>
          )}
        </>
      );
    } else {
      const ph = h.kind === "duo" ? (square ? 820 : 960) : square ? 960 : 1100;
      const pw = ph * 0.6;
      textWidth = 520;
      hero = (
        <>
          <Glow t={t} style={{ right: -ph * 0.3, top: H * 0.15, width: ph, height: ph }} />
          {h.kind === "duo" ? (
            <>
              <div className="absolute" style={{ right: pw * 0.02, top: H - ph * 0.9 }}>
                <Phone3D
                  screen={tela(h.back)}
                  width={pw}
                  height={ph}
                  yaw={26}
                  roll={5}
                  finish={t.finish}
                  zoom={0.9}
                />
              </div>
              <div className="absolute" style={{ right: -pw * 0.34, top: H - ph * 0.8 }}>
                <Phone3D
                  screen={tela(h.front)}
                  width={pw}
                  height={ph}
                  yaw={-18}
                  roll={-4}
                  finish={t.finish}
                />
              </div>
            </>
          ) : (
            <div className="absolute" style={{ right: -pw * 0.3, top: H - ph * 0.8 }}>
              <Phone3D
                screen={tela(h.screen)}
                width={pw}
                height={ph}
                yaw={-20}
                pitch={5}
                roll={-4}
                finish={t.finish}
              />
            </div>
          )}
        </>
      );
    }
  } else if (h.kind === "model") {
    const box = story
      ? { w: 600, h: 820, right: 70, bottom: bottom + 10 }
      : square
        ? { w: 400, h: 560, right: 64, bottom: 64 }
        : { w: 470, h: 700, right: 64, bottom: 76 };
    textWidth = story ? 900 : 470;
    const ph = box.h * 0.62;
    hero = (
      <>
        <div
          className="absolute overflow-hidden rounded-b-[44px] rounded-t-full"
          style={{
            width: box.w,
            height: box.h,
            right: box.right,
            bottom: box.bottom,
            boxShadow: "0 50px 90px -40px rgba(0,0,0,0.55)",
          }}
        >
          <Image
            src={h.photo}
            alt=""
            fill
            priority
            sizes="600px"
            className="object-cover"
            style={{ objectPosition: h.focus }}
          />
        </div>
        <div className="absolute" style={{ right: box.right - ph * 0.24, bottom: box.bottom - ph * 0.12 }}>
          <Phone3D
            screen={tela(h.screen)}
            width={ph * 0.62}
            height={ph}
            yaw={-16}
            roll={-6}
            finish={t.finish}
          />
        </div>
        <div
          className="absolute rounded-full px-6 py-3 text-center"
          style={{
            right: box.right + box.w - 330,
            bottom: box.bottom + 28,
            background: "rgba(255,255,255,0.92)",
            color: "#0B261E",
          }}
        >
          <span className="block font-display text-[28px] leading-none">Roseli Monteiro</span>
          <span className="block text-[16px] font-bold uppercase tracking-[0.16em] text-[#9B6A2B]">
            a Rô das Receitinhas
          </span>
        </div>
      </>
    );
  } else {
    const photoH = { story: 980, feed: 700, square: 440 }[format];
    hero = (
      <div
        className="absolute inset-x-0 overflow-hidden"
        style={{ top: 0, height: photoH, borderRadius: "0 0 56px 56px" }}
      >
        <Image
          src={h.photo}
          alt=""
          fill
          priority
          sizes="1080px"
          className="object-cover"
          style={{ objectPosition: "50% 45%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-transparent" />
      </div>
    );
  }

  const isPhoto = h.kind === "photo";
  const photoH = isPhoto ? { story: 980, feed: 700, square: 440 }[format] : 0;
  const centerText = centered && h.kind !== "model";

  return (
    <div
      id="creative"
      className="relative overflow-hidden"
      style={{ width: W, height: H, background: t.bg, fontFamily: "var(--font-sans)" }}
    >
      {hero}

      {/* topo: logo */}
      <div className="absolute inset-x-0" style={{ top: top - 6, padding: `0 ${padX}px` }}>
        {isPhoto ? <Logo t={TONES.noite!} /> : <Logo t={t} />}
      </div>

      {/* bloco de texto */}
      <div
        className={`absolute flex flex-col ${centerText ? "items-center text-center" : ""}`}
        style={{
          left: padX,
          right: padX,
          top: isPhoto ? photoH + 54 : top + 110,
          bottom,
          maxWidth: centerText ? undefined : textWidth,
        }}
      >
        <Eyebrow t={t}>{c.eyebrow}</Eyebrow>
        <div className="mt-6">
          <Title t={t} size={isPhoto ? titleSize * 0.86 : titleSize} center={centerText}>
            {c.title}
          </Title>
        </div>
        {c.sub && !square && !centered ? (
          <p className="mt-7 text-[32px] leading-[1.4]" style={{ color: t.muted, maxWidth: 500 }}>
            {c.sub}
          </p>
        ) : null}
        {c.points && !centered ? (
          <div className="mt-9">
            <Points t={t} items={c.points} />
          </div>
        ) : null}

        <div
          className={`flex flex-col gap-7 ${centered ? "mt-9" : "mt-auto"} ${centerText ? "items-center" : "items-start"}`}
        >
          {c.price ? (
            <Price
              t={t}
              price={price}
              size={centered ? (square ? 96 : 120) : square ? 110 : 140}
              center={centerText}
            />
          ) : null}
          <Cta t={t}>{c.cta}</Cta>
          {!square && !centered ? <Trust t={t} /> : null}
        </div>
      </div>
    </div>
  );
}

const FORMATS = Object.keys(SIZES) as Format[];

export default async function CriativosPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string; f?: string; tone?: string; p?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const q = await searchParams;
  const price = Number(q.p) || siteConfig.pricing.phases[0]!.price;
  const tone = q.tone && q.tone in TONES ? q.tone : "noite";
  const hideDev = <style>{"nextjs-portal{display:none!important}body{margin:0}"}</style>;

  if (q.c && q.c in CONCEPTS && FORMATS.includes(q.f as Format))
    return (
      <>
        {hideDev}
        <Creative id={q.c} format={q.f as Format} toneId={tone} price={price} />
      </>
    );

  return (
    <main className="space-y-2 p-8">
      <h1 className="text-3xl">Criativos</h1>
      {Object.keys(CONCEPTS).map((c) => (
        <p key={c}>
          {c}:{" "}
          {FORMATS.flatMap((f) =>
            Object.keys(TONES).map((tn) => (
              <Link key={f + tn} className="mr-3 underline" href={`/criativos?c=${c}&f=${f}&tone=${tn}`}>
                {f}/{tn}
              </Link>
            )),
          )}
        </p>
      ))}
    </main>
  );
}
