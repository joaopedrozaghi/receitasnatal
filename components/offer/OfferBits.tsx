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
      <CheckoutCta size="md" block className="w-full">
        {interpolate(copy.stickyCta, getPriceVars(offer))}
      </CheckoutCta>
    </div>
  );
}
