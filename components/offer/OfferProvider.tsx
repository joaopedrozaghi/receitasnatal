"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { computeOfferState, type OfferState, type PricingInput } from "@/lib/offer-state";
import { appendParams, rememberUtms, type UtmParams } from "@/lib/utm";

interface OfferContextValue {
  offer: OfferState;
  now: number;
  checkoutUrl: string;
  checkoutUrlWithBump: string;
}

const OfferContext = createContext<OfferContextValue | null>(null);

/**
 * Relógio da oferta no navegador. Começa com o "agora" do servidor (sem divergência de hidratação)
 * e passa a contar a cada segundo. Quando a fase termina, avança para a próxima sozinho — nunca reinicia.
 * Em desenvolvimento, ?simularData=2026-11-20T10:00:00-03:00 simula outra data.
 */
export function OfferProvider({
  pricing,
  serverNow,
  checkoutUrl,
  checkoutUrlWithBump,
  children,
}: {
  pricing: PricingInput;
  serverNow: number;
  checkoutUrl: string;
  checkoutUrlWithBump: string;
  children: ReactNode;
}) {
  const [now, setNow] = useState(serverNow);
  const [utms, setUtms] = useState<UtmParams>({});

  useEffect(() => {
    let offset = 0;
    if (process.env.NODE_ENV !== "production") {
      const sim = new URLSearchParams(window.location.search).get("simularData");
      if (sim && !Number.isNaN(Date.parse(sim))) offset = Date.parse(sim) - Date.now();
    }
    setUtms(rememberUtms());
    const tick = () => setNow(Date.now() + offset);
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const offer = useMemo(() => computeOfferState(now, pricing), [now, pricing]);
  const value = useMemo(
    () => ({
      offer,
      now,
      // sem link de checkout configurado, os botões levam à oferta da página principal
      checkoutUrl: appendParams(checkoutUrl, utms) || "/#oferta",
      checkoutUrlWithBump: appendParams(checkoutUrlWithBump, utms),
    }),
    [offer, now, checkoutUrl, checkoutUrlWithBump, utms],
  );
  return <OfferContext.Provider value={value}>{children}</OfferContext.Provider>;
}

export function useOffer(): OfferContextValue {
  const ctx = useContext(OfferContext);
  if (!ctx) throw new Error("useOffer precisa estar dentro de <OfferProvider>");
  return ctx;
}
