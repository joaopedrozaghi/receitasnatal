"use client";
/* eslint-disable @next/next/no-img-element -- quadros de vídeo: <img> simples carrega tudo de uma vez */

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { Phone3DLive } from "../Phone3DLive";
import { DURATION, SIZES, type Format, type VideoId } from "./config";

/**
 * Vídeos animados quadro a quadro: tudo é função do tempo `t` (ms), então a gravação
 * (scripts/export-videos.mjs) sai lisa. O iPhone é o modelo 3D com as telas reais do app.
 */

const PRICE = 24.9;
const ANCHOR = 97;

/* paleta (igual aos criativos de imagem) */
const NOITE = "linear-gradient(165deg, #123A2E 0%, #0B261E 55%, #071A14 100%)";
const CLARO = "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 50%, #EEF4F0 100%)";
const CREAM = "#F7F3EC";
const CHAMP = "#E3C78A";
const EVER = "#0B261E";
const GREEN = "#1F6B52";
const WINE = "#A8323A";
const MUTED_D = "rgba(247,243,236,0.72)";
const MUTED_L = "#55645D";

const SCREENS = ["home", "recipe", "cook", "pricing"].map((s) => `/criativos/telas/${s}.png`);
const HOME = 0;
const RECIPE = 1;
const COOK = 2;
const PRICING = 3;

/* ───────── curvas ───────── */
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const eo = (x: number) => 1 - Math.pow(1 - x, 3);
const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const back = (x: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return x <= 0 ? 0 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
const money = (v: number) => v.toFixed(2).replace(".", ",");

/** Palavras que sobem uma a uma. */
function Words({
  text,
  t,
  start,
  step = 110,
  dur = 460,
  color,
  italic,
}: {
  text: string;
  t: number;
  start: number;
  step?: number;
  dur?: number;
  color?: string;
  italic?: boolean;
}) {
  return (
    <>
      {text.split(" ").map((w, i) => {
        const x = eo(prog(t, start + i * step, start + i * step + dur));
        return (
          <span
            key={i}
            className={`inline-block ${italic ? "italic" : ""}`}
            style={{
              color,
              opacity: x,
              transform: `translateY(${(1 - x) * 0.4}em)`,
              filter: `blur(${(1 - x) * 6}px)`,
              marginRight: "0.24em",
            }}
          >
            {w}
          </span>
        );
      })}
    </>
  );
}

function fadeUp(t: number, start: number, dur = 450, dist = 36): CSSProperties {
  const x = eo(prog(t, start, start + dur));
  return { opacity: x, transform: `translateY(${(1 - x) * dist}px)` };
}

function pop(t: number, start: number, dur = 520): CSSProperties {
  const x = prog(t, start, start + dur);
  return { opacity: clamp(x * 3), transform: `scale(${lerp(0.7, 1, back(x))})` };
}

function Logo({ dark, style }: { dark: boolean; style?: CSSProperties }) {
  return (
    <div className="flex items-center gap-4" style={style}>
      <span
        className="grid h-[60px] w-[60px] place-items-center rounded-[17px]"
        style={{ background: dark ? "rgba(247,243,236,0.10)" : EVER, color: CHAMP }}
      >
        <Icon name="panettone" className="h-[34px] w-[34px]" strokeWidth={1.8} />
      </span>
      <span className="font-display text-[38px] leading-none" style={{ color: dark ? CREAM : EVER }}>
        Receitinhas{" "}
        <span className="italic" style={{ color: dark ? CHAMP : "#9B6A2B" }}>
          da Rô
        </span>
      </span>
    </div>
  );
}

function Cta({ children, dark, style }: { children: ReactNode; dark: boolean; style?: CSSProperties }) {
  return (
    <span
      style={{
        background: dark ? CREAM : EVER,
        color: dark ? EVER : "#fff",
        boxShadow: dark ? "0 20px 50px -18px rgba(0,0,0,0.6)" : "0 20px 44px -18px rgba(11,38,30,0.45)",
        ...style,
      }}
      className="inline-flex items-center gap-5 whitespace-nowrap rounded-full px-[48px] py-[26px] text-[36px] font-semibold"
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

function Eyebrow({ dark, children, style }: { dark: boolean; children: ReactNode; style?: CSSProperties }) {
  const c = dark ? CHAMP : WINE;
  return (
    <p
      className="flex items-center gap-4 text-[24px] font-bold uppercase tracking-[0.22em]"
      style={{ color: c, ...style }}
    >
      <span className="h-[2px] w-[44px]" style={{ background: c }} />
      {children}
    </p>
  );
}

function Glow({ x, y, r, color }: { x: number; y: number; r: number; color: string }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        background: `radial-gradient(closest-side, ${color}, transparent)`,
      }}
    />
  );
}

/** telas trocando: devolve de/para/transição a partir dos cortes [tempo, tela] */
function screenAt(t: number, cuts: [number, number][], dur = 420) {
  let from = cuts[0]![1];
  let to = from;
  let mix = 0;
  for (let i = 1; i < cuts.length; i++) {
    const [at, idx] = cuts[i]!;
    if (t >= at + dur) from = idx;
    else if (t >= at) {
      to = idx;
      mix = eio(prog(t, at, at + dur));
      break;
    }
  }
  if (mix === 0) to = from;
  return { from, to, mix };
}

/* ───────── Vídeo 1: o app girando ───────── */
function VideoApp({ t, f }: { t: number; f: Format }) {
  const [W, H] = SIZES[f];
  const square = f === "square";
  const ph = { square: 900, feed: 1060, story: 1260 }[f];
  const pw = ph * 0.62;

  const enter = eio(prog(t, 0, 1500));
  const wobble = t > 1500 && t < 7200 ? Math.sin((t - 1500) / 1100) * 9 : 0;
  const move = eio(prog(t, 7000, 8100));
  const yaw = lerp(-110, -10, enter) + wobble + lerp(0, -12, move);
  const pitch = lerp(14, 4, enter);

  const cx = lerp(W / 2, square ? 290 : W - 220, move);
  const cy = lerp(H / 2 + 20, square ? H / 2 + 30 : f === "feed" ? H - 150 : H - 330, move);
  const scale = lerp(lerp(0.82, 1, enter), square ? 0.92 : 0.78, move);

  const scr = screenAt(t, [
    [0, HOME],
    [2100, RECIPE],
    [3800, COOK],
    [5400, PRICING],
  ]);
  const labels = [
    "102 receitas de Natal",
    "Medidas em gramas",
    "Timer em cada etapa",
    "Preço certo para vender",
  ];
  const cuts = [1500, 2100, 3800, 5400];
  const li = Math.max(0, cuts.filter((c) => t >= c).length - 1);
  const labelX = t < 1500 || t > 7000 ? 0 : eo(prog(t, cuts[li]!, cuts[li]! + 420));

  const txt = square
    ? { left: 560, top: 200, width: 470 }
    : { left: 76, top: f === "feed" ? 80 : 230, width: 600 };
  const title = square ? 72 : f === "feed" ? 86 : 98;

  return (
    <>
      <div className="absolute inset-0" style={{ background: NOITE }} />
      <Glow x={cx} y={cy} r={ph * 0.55} color={`rgba(227,199,138,${0.22 * enter})`} />
      <div
        className="absolute"
        style={{
          left: cx - pw / 2,
          top: cy - ph / 2,
          opacity: clamp(enter * 2.5),
          transform: `scale(${scale})`,
        }}
      >
        <Phone3DLive screens={SCREENS} {...scr} width={pw} height={ph} yaw={yaw} pitch={pitch} roll={-2} />
      </div>

      <div
        className="absolute left-1/2 whitespace-nowrap rounded-full px-8 py-4 text-[34px] font-semibold"
        style={{
          top: f === "story" ? 230 : 64,
          background: "rgba(247,243,236,0.95)",
          color: EVER,
          opacity: labelX,
          transform: `translate(-50%, ${(1 - labelX) * -16}px)`,
          boxShadow: "0 18px 40px -16px rgba(0,0,0,0.5)",
        }}
      >
        {labels[li]}
      </div>

      <div className="absolute" style={{ left: txt.left, top: txt.top, width: txt.width }}>
        <Logo dark style={fadeUp(t, 7600)} />
        <Eyebrow dark style={{ ...fadeUp(t, 7750), marginTop: 44 }}>
          102 receitas · 1 app
        </Eyebrow>
        <h1 className="mt-5 font-display leading-[1.03]" style={{ fontSize: title, color: CREAM }}>
          <Words text="Panetone, docinhos e ceia." t={t} start={7900} />{" "}
          <Words text="Num app só." t={t} start={8450} italic color={CHAMP} />
        </h1>
        <ul className="mt-8 space-y-3">
          {["Passo a passo com timer", "Lista de compras automática", "Porções que se ajustam"].map(
            (b, i) => (
              <li
                key={b}
                className="flex items-center gap-4 font-medium"
                style={{ ...fadeUp(t, 9000 + i * 200, 400, 20), fontSize: square ? 28 : 32, color: CREAM }}
              >
                <span className="h-[10px] w-[10px] rotate-45" style={{ background: CHAMP }} />
                {b}
              </li>
            ),
          )}
        </ul>
        <div className="mt-8" style={fadeUp(t, 9750)}>
          <p className="text-[26px] font-medium" style={{ color: MUTED_D }}>
            <span className="line-through">de R$ {ANCHOR}</span> por
          </p>
          <p className="font-display leading-none" style={{ fontSize: square ? 84 : 104, color: CHAMP }}>
            <span className="mr-2 align-[0.55em] text-[0.34em]">R$</span>
            {money(PRICE)}
          </p>
        </div>
        <div className="mt-8 origin-left" style={pop(t, 10300)}>
          <Cta dark>Garantir acesso</Cta>
        </div>
      </div>
    </>
  );
}

/* ───────── Vídeo 2: texto animado em cenas ───────── */
function VideoTexto({ t, f }: { t: number; f: Format }) {
  const [W, H] = SIZES[f];
  const big = { square: 110, feed: 116, story: 126 }[f];
  const R = Math.hypot(W, H);
  const wipe1 = eio(prog(t, 2650, 3150));
  const wipe2 = eio(prog(t, 5500, 5950));
  const wipe3 = eio(prog(t, 8200, 8650));
  const fall = eo(prog(t, 7000, 7800));
  const shown = lerp(ANCHOR, PRICE, fall);

  const ph = { square: 720, feed: 900, story: 1120 }[f];
  const phones = [
    { dx: -0.29, yaw: 32, delay: 3700, screen: RECIPE, s: 0.86 },
    { dx: 0.29, yaw: -32, delay: 3850, screen: PRICING, s: 0.86 },
    { dx: 0, yaw: -6, delay: 3550, screen: HOME, s: 1 },
  ];
  const phonesTop = { square: H * 0.36, feed: H * 0.33, story: H * 0.34 }[f];

  return (
    <>
      {/* cena 1 */}
      <div className="absolute inset-0" style={{ background: NOITE }} />
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-16 text-center"
        style={{ opacity: 1 - prog(t, 2400, 2700), transform: `scale(${1 - prog(t, 2300, 2700) * 0.06})` }}
      >
        <Eyebrow dark style={fadeUp(t, 100)}>
          Especial de Natal
        </Eyebrow>
        <h1 className="mt-8 font-display leading-[1.02]" style={{ fontSize: big, color: CREAM }}>
          <Words text="Chega de" t={t} start={250} />
          <br />
          <Words text="panetone" t={t} start={600} />
          <br />
          <span className="relative inline-block">
            <Words text="solado." t={t} start={950} italic color={CHAMP} />
            <span
              className="absolute left-0 top-[56%] h-[0.07em] rounded-full"
              style={{ background: WINE, width: `${eo(prog(t, 1550, 1950)) * 92}%` }}
            />
          </span>
        </h1>
      </div>

      {/* cena 2 */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `circle(${wipe1 * R}px at 50% 50%)`, background: CLARO }}
      >
        <div className="absolute inset-x-0 px-16 text-center" style={{ top: f === "story" ? 240 : 76 }}>
          <h2 className="font-display leading-[1.04]" style={{ fontSize: big * 0.7, color: EVER }}>
            <Words text="Panetone, docinhos" t={t} start={3050} />
            <br />
            <Words text="e ceia." t={t} start={3350} />{" "}
            <span className="relative inline-block">
              <Words text="Num app só." t={t} start={3600} italic color={GREEN} />
              <span
                className="absolute bottom-[0.02em] left-0 h-[0.06em] rounded-full"
                style={{ background: CHAMP, width: `${eo(prog(t, 4000, 4400)) * 94}%` }}
              />
            </span>
          </h2>
        </div>
        <Glow x={W / 2} y={phonesTop + ph * 0.5} r={ph * 0.8} color="rgba(31,107,82,0.14)" />
        {phones.map((p, i) => {
          const y = eo(prog(t, p.delay, p.delay + 800));
          const h = ph * p.s;
          const w = h * 0.62;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: W / 2 + p.dx * W - w / 2,
                top: lerp(H + 40, phonesTop + (1 - p.s) * 120, y),
                opacity: clamp(y * 2),
              }}
            >
              <Phone3DLive
                screens={SCREENS}
                from={p.screen}
                width={w}
                height={h}
                yaw={p.yaw + (1 - y) * 25 * (p.yaw >= 0 ? 1 : -1)}
                pitch={6}
              />
            </div>
          );
        })}
      </div>

      {/* cena 3 */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateY(${(1 - wipe2) * 100}%)`, background: NOITE }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center px-14 text-center">
          <Eyebrow dark style={fadeUp(t, 5950)}>
            Oferta de Natal
          </Eyebrow>
          <h2 className="mt-8 font-display leading-[1.04]" style={{ fontSize: big * 0.72, color: CREAM }}>
            <Words text="Pague uma vez." t={t} start={6050} />
            <br />
            <Words text="Cozinhe o Natal inteiro." t={t} start={6350} italic color={CHAMP} />
          </h2>
          <p className="mt-10 text-[36px] font-medium" style={{ ...fadeUp(t, 6800), color: MUTED_D }}>
            <span className="line-through">de R$ {ANCHOR}</span> por apenas
          </p>
          <p
            className="mt-2 font-display leading-none"
            style={{
              ...fadeUp(t, 6900),
              color: CHAMP,
              fontSize: big * 1.6,
              transform: `scale(${1 + Math.sin(prog(t, 7800, 8100) * Math.PI) * 0.06})`,
            }}
          >
            <span className="mr-3 align-[0.55em] text-[0.34em]">R$</span>
            {money(shown)}
          </p>
        </div>
      </div>

      {/* cena 4 */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `circle(${wipe3 * R}px at 50% 60%)`, background: CLARO }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 text-center">
          <Logo dark={false} style={fadeUp(t, 8600)} />
          <h2 className="font-display leading-none" style={{ fontSize: big * 0.9, color: EVER }}>
            <Words text="Comece" t={t} start={8850} />
            <Words text="hoje." t={t} start={8980} italic color={GREEN} />
          </h2>
          <div style={pop(t, 9300)}>
            <Cta dark={false}>Garantir acesso</Cta>
          </div>
          <p className="text-[28px] font-medium" style={{ ...fadeUp(t, 9600), color: MUTED_L }}>
            7 dias de garantia · R$ {money(PRICE)} · pagamento único
          </p>
        </div>
      </div>
    </>
  );
}

/* ───────── Vídeo 3: a Roseli + fotos dos pratos ───────── */
const SHOTS = [
  { src: "/images/app/receitas/panetone-trufado-de-chocolate.jpg", label: "Panetone trufado" },
  { src: "/images/app/receitas/chocotone.jpg", label: "Chocotone" },
  { src: "/images/app/receitas/brigadeiro-gourmet-meio-amargo.jpg", label: "Brigadeiro gourmet" },
  { src: "/images/app/receitas/coxinha-cremosa.jpg", label: "Coxinha cremosa" },
  { src: "/images/app/receitas/ave-assada-com-laranja.jpg", label: "Ave natalina" },
  { src: "/images/app/receitas/biscoito-amanteigado-para-decorar.jpg", label: "Biscoitos decorados" },
];

function VideoRose({ t, f }: { t: number; f: Format }) {
  const [W, H] = SIZES[f];
  const big = { square: 90, feed: 98, story: 110 }[f];
  const safeTop = f === "story" ? 230 : 76;
  const safeBottom = f === "story" ? 330 : 86;

  const montage = t >= 3000 && t < 6800;
  const shotIdx = Math.min(SHOTS.length - 1, Math.floor((t - 3000) / 620));
  const shotT = (t - 3000 - shotIdx * 620) / 620;
  const count = Math.round(eo(prog(t, 3000, 6400)) * 102);
  const appOut = prog(t, 9150, 9450);
  const endIn = eio(prog(t, 9400, 9800));
  const phoneIn = eo(prog(t, 6800, 7900));
  const ph = { square: 820, feed: 1020, story: 1280 }[f];
  const pw = ph * 0.62;

  return (
    <>
      <div className="absolute inset-0" style={{ background: NOITE }} />
      {/* abertura */}
      <div className="absolute inset-0" style={{ opacity: 1 - prog(t, 2800, 3050) }}>
        <img
          src="/images/ro-panetone.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "50% 30%", transform: `scale(${lerp(1.05, 1.15, t / 3000)})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, #0B261E 0%, rgba(11,38,30,0.35) 45%, transparent 75%)",
          }}
        />
        <div className="absolute inset-x-0 px-16" style={{ bottom: safeBottom }}>
          <Eyebrow dark style={fadeUp(t, 150)}>
            Roseli Monteiro
          </Eyebrow>
          <h1 className="mt-6 font-display leading-[1.03]" style={{ fontSize: big, color: CREAM }}>
            <Words text="Eu sou a Roseli," t={t} start={300} />
            <br />
            <Words text="a Rô das Receitinhas." t={t} start={800} italic color={CHAMP} />
          </h1>
        </div>
      </div>

      {/* montagem */}
      {montage ? (
        <div className="absolute inset-0">
          {SHOTS.map((s, i) => (
            <img
              key={s.src}
              src={s.src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                opacity: i === shotIdx ? 1 : 0,
                transform: `scale(${i === shotIdx ? lerp(1.12, 1.02, eo(clamp(shotT))) : 1})`,
              }}
            />
          ))}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(11,38,30,0.85) 0%, transparent 35%, transparent 60%, rgba(11,38,30,0.9) 100%)",
            }}
          />
          <p
            className="absolute inset-x-0 px-16 font-display leading-none"
            style={{ top: safeTop, fontSize: big, color: CREAM }}
          >
            <span style={{ color: CHAMP }}>{count}</span> receitas
            <br />
            <span className="italic">de Natal</span>
          </p>
          <span
            className="absolute left-16 rounded-full px-8 py-4 text-[36px] font-semibold"
            style={{
              bottom: safeBottom,
              background: "rgba(247,243,236,0.95)",
              color: EVER,
              ...pop(t, 3000 + shotIdx * 620 + 60, 320),
            }}
          >
            {SHOTS[shotIdx]?.label}
          </span>
        </div>
      ) : null}

      {/* o app (montado desde o início para o 3D já estar carregado) */}
      <div
        className="absolute inset-0"
        style={{
          opacity: t >= 6800 ? 1 - appOut : 0,
          background: NOITE,
          visibility: t >= 6700 ? "visible" : "hidden",
        }}
      >
        <div className="absolute inset-x-0 px-16 text-center" style={{ top: safeTop }}>
          <h2 className="font-display leading-[1.04]" style={{ fontSize: big * 0.85, color: CREAM }}>
            <Words text="Tudo passo a passo," t={t} start={6900} />
            <br />
            <Words text="no seu celular." t={t} start={7300} italic color={CHAMP} />
          </h2>
        </div>
        <Glow x={W / 2} y={H * 0.72} r={ph * 0.6} color="rgba(227,199,138,0.2)" />
        <div
          className="absolute"
          style={{ left: W / 2 - pw / 2, top: lerp(H, H - ph * (f === "square" ? 0.72 : 0.8), phoneIn) }}
        >
          <Phone3DLive
            screens={SCREENS}
            {...screenAt(t, [
              [0, HOME],
              [8300, RECIPE],
            ])}
            width={pw}
            height={ph}
            yaw={lerp(70, -12, phoneIn) + Math.sin(t / 900) * 3}
            pitch={6}
            roll={-2}
          />
        </div>
      </div>

      {/* final */}
      <div className="absolute inset-0" style={{ opacity: endIn, background: NOITE }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-14 text-center">
          <Logo dark style={fadeUp(t, 9500)} />
          <h2 className="font-display leading-[1.04]" style={{ fontSize: big * 0.82, color: CREAM }}>
            <Words text="Especial de Natal" t={t} start={9700} />
            <br />
            <Words text="da Rô" t={t} start={10000} italic color={CHAMP} />
          </h2>
          <p className="text-[34px] font-medium" style={{ ...fadeUp(t, 10300), color: MUTED_D }}>
            <span className="line-through">de R$ {ANCHOR}</span> por
          </p>
          <p
            className="font-display leading-none"
            style={{ ...pop(t, 10500), fontSize: big * 1.55, color: CHAMP }}
          >
            <span className="mr-3 align-[0.55em] text-[0.34em]">R$</span>
            {money(PRICE)}
          </p>
          <div style={pop(t, 11000)}>
            <Cta dark>Garantir acesso</Cta>
          </div>
        </div>
      </div>
    </>
  );
}

export function Stage({ v, f }: { v: VideoId; f: Format }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const w = window as unknown as {
      __setT: (ms: number) => void;
      __ready: () => Promise<void>;
      __phonesPending?: number;
    };
    w.__setT = setT;
    w.__ready = () => {
      const imgs = [...document.images];
      imgs.forEach((img) => (img.loading = "eager"));
      const all = Promise.all(
        imgs.map((img) =>
          img.complete ? Promise.resolve() : new Promise<void>((r) => (img.onload = img.onerror = () => r())),
        ),
      )
        .then(() => document.fonts.ready)
        .then(
          () =>
            new Promise<void>((r) => {
              const check = () => ((w.__phonesPending ?? 0) <= 0 ? r() : setTimeout(check, 100));
              check();
            }),
        );
      return Promise.race([all, new Promise<void>((r) => setTimeout(r, 60000))]);
    };
    if (new URLSearchParams(location.search).get("play")) {
      const t0 = performance.now();
      let raf = 0;
      const loop = () => {
        setT((performance.now() - t0) % DURATION[v]);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
    }
  }, [v]);

  const [W, H] = SIZES[f];
  return (
    <div className="relative overflow-hidden" style={{ width: W, height: H, fontFamily: "var(--font-sans)" }}>
      {v === "app" ? (
        <VideoApp t={t} f={f} />
      ) : v === "texto" ? (
        <VideoTexto t={t} f={f} />
      ) : (
        <VideoRose t={t} f={f} />
      )}
      <div className="hidden">
        {SHOTS.map((s) => (
          <img key={s.src} src={s.src} alt="" />
        ))}
      </div>
    </div>
  );
}
