"use client";
/* eslint-disable @next/next/no-img-element -- quadros de vídeo: <img> simples carrega tudo de uma vez */

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { IPhone } from "@/components/phone/IPhone";
import { CookScreen, HomeScreen, PricingScreen, RecipeScreen } from "@/components/phone/Screens";
import { Icon } from "@/components/ui/Icon";
import { DURATION, SIZES, type Format, type VideoId } from "./config";

/**
 * Vídeos animados quadro a quadro: tudo é função do tempo `t` (ms), então a gravação
 * (scripts/export-videos.mjs) sai lisa, sem depender da velocidade do computador.
 */

const PRICE = 24.9;
const ANCHOR = 97;

/* ───────── curvas de animação ───────── */
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
  dur = 420,
  className = "",
  wordClass = "",
}: {
  text: string;
  t: number;
  start: number;
  step?: number;
  dur?: number;
  className?: string;
  wordClass?: string;
}) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => {
        const x = eo(prog(t, start + i * step, start + i * step + dur));
        return (
          <span
            key={i}
            className={`inline-block ${wordClass}`}
            style={{
              opacity: x,
              transform: `translateY(${(1 - x) * 0.45}em)`,
              filter: `blur(${(1 - x) * 8}px)`,
              marginRight: "0.24em",
            }}
          >
            {w}
          </span>
        );
      })}
    </span>
  );
}

function fadeUp(t: number, start: number, dur = 450, dist = 40): CSSProperties {
  const x = eo(prog(t, start, start + dur));
  return { opacity: x, transform: `translateY(${(1 - x) * dist}px)` };
}

function pop(t: number, start: number, dur = 500): CSSProperties {
  const x = prog(t, start, start + dur);
  return { opacity: clamp(x * 3), transform: `scale(${lerp(0.6, 1, back(x))})` };
}

function Logo({ dark, style }: { dark: boolean; style?: CSSProperties }) {
  return (
    <div className="flex items-center gap-4" style={style}>
      <span
        className={`grid h-[64px] w-[64px] place-items-center rounded-[18px] ${dark ? "bg-white/10 text-gold-light ring-1 ring-white/20" : "bg-pine text-gold-light"}`}
      >
        <Icon name="panettone" className="h-[36px] w-[36px]" strokeWidth={1.8} />
      </span>
      <span className={`font-display text-[40px] ${dark ? "text-snow" : "text-pine-deep"}`}>
        Receitinhas <span className="italic text-gold">da Rô</span>
      </span>
    </div>
  );
}

function Cta({
  children,
  style,
  dark = true,
}: {
  children: ReactNode;
  style?: CSSProperties;
  dark?: boolean;
}) {
  return (
    <span
      style={style}
      className={`inline-flex items-center gap-4 whitespace-nowrap rounded-full px-[50px] py-[26px] text-[38px] font-bold text-white ring-1 ring-white/20 ${
        dark
          ? "bg-gradient-to-b from-[#D81F3D] to-berry shadow-[0_24px_50px_-16px_rgba(200,16,46,0.85)]"
          : "bg-gradient-to-b from-pine-line to-pine shadow-[0_24px_50px_-16px_rgba(15,61,46,0.8)]"
      }`}
    >
      {children}
      <svg
        viewBox="0 0 24 24"
        className="h-[0.9em] w-[0.9em]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
      >
        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function DarkBg() {
  return (
    <>
      <div className="absolute inset-0 bg-pine-deep" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_80%_20%,rgba(212,162,76,0.28)_0%,transparent_70%),radial-gradient(55%_45%_at_10%_90%,rgba(200,16,46,0.22)_0%,transparent_70%)]" />
      <div className="grain absolute inset-0 opacity-70" />
    </>
  );
}

function LightBg() {
  return (
    <>
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_100%,rgba(15,61,46,0.14)_0%,transparent_70%),radial-gradient(45%_30%_at_0%_0%,rgba(212,162,76,0.2)_0%,transparent_70%)]" />
    </>
  );
}

/** Telas do app trocando dentro do celular (todas montadas para as fotos já estarem carregadas). */
function Screens({ active }: { active: number[] }) {
  const list = [
    <HomeScreen key="h" />,
    <RecipeScreen key="r" />,
    <CookScreen key="c" />,
    <PricingScreen key="p" />,
  ];
  return (
    <>
      {list.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 ${i === 2 ? "bg-pine-deep" : "bg-ivory"}`}
          style={{ opacity: active[i] ?? 0, transform: `translateX(${(1 - (active[i] ?? 0)) * 18}%)` }}
        >
          {s}
        </div>
      ))}
    </>
  );
}

/* ───────── Vídeo 1: o app girando ───────── */
function VideoApp({ t, f }: { t: number; f: Format }) {
  const [W, H] = SIZES[f];
  const pw = { square: 430, feed: 450, story: 540 }[f];
  const ph = pw * (19.5 / 9);
  const square = f === "square";

  // entrada em 3D
  const enter = eio(prog(t, 0, 1300));
  const wobble = t > 1300 && t < 7400 ? Math.sin((t - 1300) / 950) * 7 : 0;
  const rotY = lerp(80, 0, enter) + wobble;
  // muda de lugar para dar espaço ao texto
  const move = eio(prog(t, 7000, 8000));
  const cx0 = W / 2;
  const cy0 = H / 2;
  const cx1 = square ? 300 : W - 230;
  const cy1 = square ? H / 2 + 20 : f === "feed" ? H - 160 : H - 360;
  const scale = lerp(lerp(0.78, 1, enter), square ? 0.95 : 0.8, move);
  const cx = lerp(cx0, cx1, move);
  const cy = lerp(cy0, cy1, move);

  // telas: início → receita → modo cozinha → calculadora
  const cuts = [1500, 3300, 5000, 6600];
  const active = cuts.map((c, i) => {
    const inX = i === 0 ? 1 : eo(prog(t, c, c + 350));
    const next = cuts[i + 1];
    const outX = next ? 1 - prog(t, next, next + 250) : 1;
    return Math.min(inX, outX);
  });
  const screenLabels = [
    "102 receitas de Natal",
    "Medidas em gramas",
    "Timer em cada etapa",
    "Preço certo para vender",
  ];
  const labelIdx = Math.max(0, cuts.filter((c) => t >= c).length - 1);
  const labelX = t < 1500 || t > 7000 ? 0 : eo(prog(t, cuts[labelIdx]!, cuts[labelIdx]! + 400));

  const txt = square
    ? { left: 560, top: 230, width: 470 }
    : { left: 80, top: f === "feed" ? 90 : 230, width: 600 };
  const title = square ? 70 : f === "feed" ? 82 : 96;

  return (
    <>
      <DarkBg />
      <div
        className="absolute rounded-full bg-gold/25 blur-[90px]"
        style={{ left: cx - pw * 0.7, top: cy - pw * 0.7, width: pw * 1.4, height: pw * 1.4, opacity: enter }}
      />
      <div
        className="absolute"
        style={{
          left: cx - pw / 2,
          top: cy - ph / 2,
          width: pw,
          perspective: 1800,
          opacity: clamp(enter * 2),
        }}
      >
        <div style={{ transform: `scale(${scale}) rotateY(${rotY}deg) rotateX(${4 - enter * 4 + 3}deg)` }}>
          <IPhone label="App Receitinhas da Rô">
            <div className="absolute inset-0">
              <Screens active={active} />
            </div>
          </IPhone>
        </div>
      </div>

      {/* etiqueta da tela atual */}
      <div
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-snow px-8 py-4 text-[36px] font-bold text-pine-deep shadow-lift"
        style={{
          top: f === "story" ? 230 : 70,
          opacity: labelX,
          transform: `translate(-50%, ${(1 - labelX) * -20}px)`,
        }}
      >
        {screenLabels[labelIdx]}
      </div>

      {/* texto final */}
      <div className="absolute" style={{ left: txt.left, top: txt.top, width: txt.width }}>
        <Logo dark style={fadeUp(t, 7600)} />
        <h1 className="mt-8 font-display leading-[1.03] text-snow" style={{ fontSize: title }}>
          <Words text="Panetone, docinhos e ceia." t={t} start={7850} />{" "}
          <Words text="Num app só." t={t} start={8400} wordClass="italic text-gold-light" />
        </h1>
        <ul className="mt-8 space-y-3">
          {["102 receitas passo a passo", "Lista de compras automática", "Modo cozinha com timer"].map(
            (b, i) => (
              <li
                key={b}
                className="flex items-center gap-4 font-semibold text-snow"
                style={{ ...fadeUp(t, 9000 + i * 220, 400, 24), fontSize: square ? 28 : 34 }}
              >
                <span className="grid h-[40px] w-[40px] shrink-0 place-items-center rounded-full bg-gold text-pine-deep">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[24px] w-[24px]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.2"
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {b}
              </li>
            ),
          )}
        </ul>
        <p
          className="mt-8 font-display leading-none text-gold-light"
          style={{ ...fadeUp(t, 9800), fontSize: square ? 64 : 80 }}
        >
          <span className="mr-3 align-top text-[0.4em]">R$</span>
          {money(PRICE)}
          <span className="ml-4 align-middle font-sans text-[0.32em] font-semibold text-snow/70 line-through decoration-berry">
            R$ {ANCHOR}
          </span>
        </p>
        <div className="mt-8 origin-left" style={pop(t, 10300)}>
          <Cta>Garantir acesso</Cta>
        </div>
      </div>
    </>
  );
}

/* ───────── Vídeo 2: texto animado em cenas ───────── */
function VideoTexto({ t, f }: { t: number; f: Format }) {
  const [W, H] = SIZES[f];
  const big = { square: 112, feed: 118, story: 128 }[f];
  const wipe1 = eio(prog(t, 2650, 3150));
  const wipe2 = eio(prog(t, 5500, 5950));
  const wipe3 = eio(prog(t, 8200, 8650));
  const R = Math.hypot(W, H);

  // preço caindo de 97 para 24,90
  const fall = eo(prog(t, 7000, 7800));
  const shown = lerp(ANCHOR, PRICE, fall);

  return (
    <>
      {/* cena 1: escuro */}
      <DarkBg />
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-16 text-center"
        style={{ opacity: 1 - prog(t, 2400, 2700), transform: `scale(${1 - prog(t, 2300, 2700) * 0.08})` }}
      >
        <h1 className="font-display leading-[1.02] text-snow" style={{ fontSize: big }}>
          <Words text="Chega de" t={t} start={250} />
          <br />
          <Words text="panetone" t={t} start={600} />
          <br />
          <span className="relative inline-block">
            <Words text="solado." t={t} start={950} wordClass="italic text-gold-light" />
            <span
              className="absolute left-0 top-[55%] h-[0.08em] rounded-full bg-berry"
              style={{ width: `${eo(prog(t, 1550, 1950)) * 92}%` }}
            />
          </span>
        </h1>
      </div>

      {/* cena 2: branco com 3 celulares */}
      <div className="absolute inset-0" style={{ clipPath: `circle(${wipe1 * R}px at 50% 50%)` }}>
        <LightBg />
        <div className="absolute inset-x-0 px-16 text-center" style={{ top: f === "story" ? 240 : 80 }}>
          <h2 className="font-display leading-[1.03] text-pine-deep" style={{ fontSize: big * 0.72 }}>
            <Words text="Panetone, docinhos" t={t} start={3050} />
            <br />
            <Words text="e ceia." t={t} start={3350} />{" "}
            <span className="relative inline-block">
              <Words text="Num app só." t={t} start={3600} wordClass="italic text-pine" />
              <span
                className="absolute bottom-[0.02em] left-0 h-[0.07em] rounded-full bg-gold"
                style={{ width: `${eo(prog(t, 4000, 4400)) * 94}%` }}
              />
            </span>
          </h2>
        </div>
        {[
          { x: -0.3, rot: -12, s: 0.82, delay: 3650, el: <RecipeScreen />, overlay: true },
          { x: 0.3, rot: 12, s: 0.82, delay: 3800, el: <PricingScreen />, overlay: false },
          { x: 0, rot: 0, s: 1, delay: 3500, el: <HomeScreen />, overlay: false },
        ].map((p, i) => {
          const y = eo(prog(t, p.delay, p.delay + 700));
          const pw = (f === "square" ? 330 : 400) * p.s;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                width: pw,
                left: W / 2 + p.x * W - pw / 2,
                top: lerp(
                  H + 50,
                  H * (f === "square" ? 0.42 : f === "feed" ? 0.4 : 0.38) + (1 - p.s) * 200,
                  y,
                ),
                transform: `rotate(${p.rot}deg)`,
              }}
            >
              <IPhone label="App" overlayStatus={p.overlay}>
                {p.el}
              </IPhone>
            </div>
          );
        })}
      </div>

      {/* cena 3: preço */}
      <div className="absolute inset-0" style={{ transform: `translateY(${(1 - wipe2) * 100}%)` }}>
        <DarkBg />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-14 text-center">
          <h2 className="font-display leading-[1.03] text-snow" style={{ fontSize: big * 0.75 }}>
            <Words text="Pague uma vez." t={t} start={6050} />
            <br />
            <Words text="Cozinhe o Natal inteiro." t={t} start={6350} wordClass="italic text-gold-light" />
          </h2>
          <p className="mt-10 text-[40px] font-semibold text-snow/80" style={fadeUp(t, 6800)}>
            De <span className="line-through decoration-berry decoration-[3px]">R$ {ANCHOR}</span> por apenas
          </p>
          <p
            className="mt-2 font-display leading-none text-gold-light"
            style={{
              ...fadeUp(t, 6900),
              fontSize: big * 1.7,
              transform: `scale(${1 + Math.sin(prog(t, 7800, 8100) * Math.PI) * 0.08})`,
            }}
          >
            <span className="mr-3 align-top text-[0.35em]">R$</span>
            {money(shown)}
          </p>
        </div>
      </div>

      {/* cena 4: cartão final */}
      <div className="absolute inset-0" style={{ clipPath: `circle(${wipe3 * R}px at 50% 60%)` }}>
        <LightBg />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 text-center">
          <Logo dark={false} style={fadeUp(t, 8600)} />
          <h2 className="font-display leading-none text-pine-deep" style={{ fontSize: big * 0.9 }}>
            <Words text="Comece hoje." t={t} start={8850} />
          </h2>
          <div style={pop(t, 9300)}>
            <Cta dark={false}>Garantir acesso</Cta>
          </div>
          <p
            className="flex items-center gap-3 text-[32px] font-semibold text-cocoa-muted"
            style={fadeUp(t, 9600)}
          >
            <Icon name="shield" className="h-[38px] w-[38px] text-pine" /> 7 dias de garantia · R${" "}
            {money(PRICE)}
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
  const [, H] = SIZES[f];
  const big = { square: 92, feed: 100, story: 112 }[f];
  const safeTop = f === "story" ? 230 : 80;
  const safeBottom = f === "story" ? 330 : 90;

  const montage = t >= 3000 && t < 6800;
  const shotIdx = Math.min(SHOTS.length - 1, Math.floor((t - 3000) / 620));
  const shotT = (t - 3000 - shotIdx * 620) / 620;
  const count = Math.round(eo(prog(t, 3000, 6400)) * 102);
  const endIn = eio(prog(t, 9400, 9800));
  const phoneIn = eo(prog(t, 6800, 7600));

  return (
    <>
      <DarkBg />
      {/* abertura: Roseli */}
      <div className="absolute inset-0" style={{ opacity: 1 - prog(t, 2800, 3050) }}>
        <img
          src="/images/ro-panetone.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "50% 30%", transform: `scale(${lerp(1.05, 1.16, t / 3000)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-deep via-pine-deep/30 to-transparent" />
        <div className="absolute inset-x-0 px-16" style={{ bottom: safeBottom }}>
          <h1 className="font-display leading-[1.03] text-snow" style={{ fontSize: big }}>
            <Words text="Eu sou a Roseli," t={t} start={300} />
            <br />
            <Words text="a Rô das Receitinhas." t={t} start={800} wordClass="italic text-gold-light" />
          </h1>
        </div>
      </div>

      {/* montagem das receitas */}
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
          <div className="absolute inset-0 bg-gradient-to-b from-pine-deep/80 via-transparent to-pine-deep/85" />
          <p
            className="absolute inset-x-0 px-16 font-display leading-none text-snow"
            style={{ top: safeTop, fontSize: big }}
          >
            <span className="text-gold-light">{count}</span> receitas
            <br />
            <span className="italic">de Natal</span>
          </p>
          <span
            className="absolute left-16 rounded-full bg-snow px-8 py-4 text-[38px] font-bold text-pine-deep shadow-lift"
            style={{ bottom: safeBottom, ...pop(t, 3000 + shotIdx * 620 + 60, 300) }}
          >
            {SHOTS[shotIdx]?.label}
          </span>
        </div>
      ) : null}

      {/* o app */}
      {t >= 6800 ? (
        <div className="absolute inset-0" style={{ opacity: 1 - prog(t, 9150, 9450) }}>
          <DarkBg />
          <div className="absolute inset-x-0 px-16 text-center" style={{ top: safeTop }}>
            <h2 className="font-display leading-[1.03] text-snow" style={{ fontSize: big * 0.85 }}>
              <Words text="Tudo passo a passo," t={t} start={6900} />
              <br />
              <Words text="no seu celular." t={t} start={7300} wordClass="italic text-gold-light" />
            </h2>
          </div>
          <div
            className="absolute left-1/2"
            style={{
              width: f === "square" ? 380 : 460,
              top: lerp(H, H * (f === "square" ? 0.4 : f === "feed" ? 0.38 : 0.36), phoneIn),
              transform: `translateX(-50%) rotate(${lerp(10, -4, phoneIn)}deg)`,
            }}
          >
            <IPhone label="App">
              <HomeScreen />
            </IPhone>
          </div>
        </div>
      ) : null}

      {/* final: preço */}
      <div className="absolute inset-0" style={{ opacity: endIn }}>
        <DarkBg />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-14 text-center">
          <Logo dark style={fadeUp(t, 9500)} />
          <h2 className="font-display leading-[1.03] text-snow" style={{ fontSize: big * 0.8 }}>
            <Words text="Especial de Natal" t={t} start={9700} />
            <br />
            <Words text="da Rô" t={t} start={10000} wordClass="italic text-gold-light" />
          </h2>
          <p className="text-[38px] font-semibold text-snow/80" style={fadeUp(t, 10300)}>
            De <span className="line-through decoration-berry decoration-[3px]">R$ {ANCHOR}</span> por
          </p>
          <p
            className="font-display leading-none text-gold-light"
            style={{ ...pop(t, 10500), fontSize: big * 1.6 }}
          >
            <span className="mr-3 align-top text-[0.35em]">R$</span>
            {money(PRICE)}
          </p>
          <div style={pop(t, 11000)}>
            <Cta>Garantir acesso</Cta>
          </div>
        </div>
      </div>
    </>
  );
}

export function Stage({ v, f }: { v: VideoId; f: Format }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const w = window as unknown as { __setT: (ms: number) => void; __ready: () => Promise<void> };
    w.__setT = setT;
    w.__ready = () => {
      const imgs = [...document.images];
      imgs.forEach((img) => (img.loading = "eager"));
      const all = Promise.all(
        imgs.map((img) =>
          img.complete ? Promise.resolve() : new Promise<void>((r) => (img.onload = img.onerror = () => r())),
        ),
      ).then(() => document.fonts.ready.then(() => undefined));
      return Promise.race([all, new Promise<void>((r) => setTimeout(r, 10000))]);
    };
    // pré-visualização: ?play=1 toca em loop
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
      {/* pré-carrega as fotos usadas mais tarde */}
      <div className="hidden">
        {SHOTS.map((s) => (
          <img key={s.src} src={s.src} alt="" />
        ))}
      </div>
    </div>
  );
}
