"use client";

import { useEffect, useRef, useState } from "react";
import { copy } from "@/content/copy.ptBR";
import { getPriceVars } from "@/lib/offer-state";
import { interpolate } from "@/lib/template";
import { track } from "@/lib/track";
import { CtaLink } from "@/components/ui/CtaButton";
import { Rich } from "@/components/ui/Rich";
import { useOffer } from "@/components/offer/OfferProvider";

function useCheckoutClick(value: number) {
  return () => track("InitiateCheckout", { value });
}

/** Botão do meio da página: desce até a seção da oferta (preço + compra). */
/**
 * Rola suavemente até um elemento. As seções do caminho só ganham a altura real quando aparecem
 * (content-visibility), então o destino é recalculado a cada quadro e corrigido no fim.
 */
function scrollToEl(el: HTMLElement, smooth = true) {
  const target = () => {
    const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    return el.getBoundingClientRect().top + window.scrollY - offset;
  };
  // o html tem scroll-behavior: smooth; cada passo usa "instant" para a animação ser só a nossa
  const set = (y: number) => window.scrollTo({ top: y, behavior: "instant" });
  const settle = () => [150, 500, 1000].forEach((ms) => window.setTimeout(() => set(target()), ms));
  if (!smooth || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    set(target());
    settle();
    return;
  }
  const from = window.scrollY;
  const duration = Math.min(1800, 700 + Math.abs(target() - from) / 12);
  const start = performance.now();
  const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    set(target());
    settle();
  };
  // conta só o tempo que a animação realmente andou: se o celular travar desenhando uma seção,
  // a rolagem pausa e continua de onde estava, sem dar um pulo
  let elapsed = 0;
  let last = start;
  const step = (now: number) => {
    if (done) return;
    elapsed += Math.min(now - last, 34);
    last = now;
    const p = Math.min(1, elapsed / duration);
    set(from + (target() - from) * ease(p));
    if (p < 1) requestAnimationFrame(step);
    else finish();
  };
  requestAnimationFrame(step);
  // se a aba estiver em segundo plano (sem quadros de animação), chega no destino mesmo assim
  window.setTimeout(finish, duration + 4000);
}

/** Na página inicial, quem chega por /#oferta (vindo de outra página) cai certinho na oferta. */
export function HashScrollFix() {
  useEffect(() => {
    const id = location.hash.slice(1);
    const el = id ? document.getElementById(id) : null;
    if (el) scrollToEl(el, false);
  }, []);
  return null;
}

export function OfferCta({
  children,
  size = "lg",
  block,
  className,
  href = "#oferta",
}: {
  children: React.ReactNode;
  size?: "md" | "lg";
  block?: boolean;
  className?: string;
  /** "/#oferta" em páginas que não são a inicial */
  href?: string;
}) {
  // As seções abaixo da dobra têm altura estimada até aparecerem (content-visibility), então um salto
  // longo erra o alvo. Rola até a oferta e corrige a posição enquanto as seções do caminho carregam.
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const id = href.split("#")[1];
    const el = id ? document.getElementById(id) : null;
    if (!el) return; // em outra página: segue o link normal até /#oferta
    e.preventDefault();
    history.replaceState(null, "", `#${id}`);
    scrollToEl(el);
  };
  return (
    <CtaLink href={href} size={size} block={block} className={className} onClick={onClick}>
      {children}
    </CtaLink>
  );
}

/** CTA que leva ao checkout externo (com UTMs) e dispara InitiateCheckout. */
export function CheckoutCta({
  children,
  size = "lg",
  block,
  className,
}: {
  children: React.ReactNode;
  size?: "md" | "lg";
  block?: boolean;
  className?: string;
}) {
  const { checkoutUrl, offer } = useOffer();
  const onClick = useCheckoutClick(offer.price);
  return (
    <CtaLink href={checkoutUrl} size={size} block={block} className={className} onClick={onClick}>
      {children}
    </CtaLink>
  );
}

/** Linha de preço abaixo do CTA do hero. */
export function HeroPriceLine() {
  const { offer } = useOffer();
  const vars = getPriceVars(offer);
  return (
    <p className="text-sm text-snow/75">
      <Rich
        text={interpolate(
          offer.showAnchor ? copy.hero.priceLineWithAnchor : copy.hero.priceLineWithoutAnchor,
          vars,
        )}
        strongClassName="font-bold text-gold-light"
      />
    </p>
  );
}

/** 5.12 Bloco de preço da oferta (+ bump opcional, se houver link de checkout com bump). */
export function OfferPriceBox({
  staticVars,
  bump,
}: {
  staticVars: Record<string, string | number>;
  bump: { enabled: boolean; price: number };
}) {
  const { offer, checkoutUrl, checkoutUrlWithBump } = useOffer();
  const [withBump, setWithBump] = useState(false);
  const vars = { ...staticVars, ...getPriceVars(offer) };
  const c = copy.offer;
  const showBump = bump.enabled && !!checkoutUrlWithBump;
  const href = showBump && withBump ? checkoutUrlWithBump : checkoutUrl;

  return (
    <div>
      <div className="text-center">
        {offer.showAnchor ? (
          <p className="text-lg text-cocoa-muted">
            {c.from} <s>R$ {vars.anchor}</s> {c.by}
          </p>
        ) : null}
        <p className="mt-1 font-display text-7xl leading-none tracking-tight text-pine sm:text-8xl">
          <span className="align-top font-sans text-2xl font-semibold sm:text-3xl">R$ </span>
          <AnimatedValue value={vars.price} />
        </p>
        {offer.installments ? (
          <p className="mt-3 text-base font-medium text-cocoa">
            {interpolate(c.installmentsLine, {
              count: offer.installments.count,
              amount: offer.installments.amountLabel,
            })}
          </p>
        ) : null}
        <p className="mt-1 text-sm text-cocoa-muted">{c.methods}</p>
      </div>

      {showBump ? (
        <label className="mt-6 block cursor-pointer rounded-3xl border-2 border-dashed border-gold bg-ivory p-4 sm:p-5">
          <span className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={withBump}
              onChange={(e) => {
                setWithBump(e.target.checked);
                if (e.target.checked) track("OrderBumpSelected", { value: bump.price });
              }}
              className="mt-1 h-6 w-6 shrink-0 accent-berry"
            />
            <span>
              <span className="block text-sm font-extrabold uppercase tracking-wide text-berry">
                {c.bump.checkbox}
              </span>
              <span className="mt-1 block font-display text-xl leading-snug text-cocoa">
                {interpolate(c.bump.title, vars)}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-cocoa-soft">
                <Rich text={interpolate(c.bump.body, vars)} />
              </span>
              <span className="mt-2 block text-sm text-cocoa-soft">
                <Rich text={interpolate(c.bump.price, vars)} />
              </span>
            </span>
          </span>
        </label>
      ) : null}

      <div className="mt-6 flex justify-center">
        <CtaLink
          href={href}
          block
          className="w-full"
          onClick={() => track("InitiateCheckout", { value: offer.price + (withBump ? bump.price : 0) })}
        >
          {c.cta}
        </CtaLink>
      </div>
      <p className="mt-3 text-center text-sm text-cocoa-muted">{interpolate(c.micro, vars)}</p>
    </div>
  );
}

/** Troca de preço com animação sutil (ex.: quando a fase muda). CSS puro; sem animação em reduced motion. */
function AnimatedValue({ value }: { value: string }) {
  return (
    <span key={value} className="inline-block motion-safe:animate-price-in">
      {value}
    </span>
  );
}

/** 5.17 CTA fixo no rodapé (mobile), depois do hero; some na oferta e no rodapé. */
export function StickyCta({ heroId, hideOnIds }: { heroId: string; hideOnIds: string[] }) {
  const { offer } = useOffer();
  const [visible, setVisible] = useState(false);
  const state = useRef({ pastHero: false, hidden: new Set<string>() });

  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero || !("IntersectionObserver" in window)) return;
    const update = () => setVisible(state.current.pastHero && state.current.hidden.size === 0);
    const heroObs = new IntersectionObserver(([e]) => {
      if (!e) return;
      state.current.pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
      update();
    });
    const hideObs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) state.current.hidden.add(e.target.id);
        else state.current.hidden.delete(e.target.id);
      }
      update();
    });
    heroObs.observe(hero);
    hideOnIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) hideObs.observe(el);
    });
    return () => {
      heroObs.disconnect();
      hideObs.disconnect();
    };
  }, [heroId, hideOnIds]);

  return (
    <div
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-cocoa/10 bg-ivory/95 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <OfferCta size="md" block className="w-full">
        {interpolate(copy.stickyCta, getPriceVars(offer))}
      </OfferCta>
    </div>
  );
}
