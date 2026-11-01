/** Estado da oferta num instante — função pura, segura para rodar no navegador. */
import type { PricePhase } from "@/config/site.config";
import {
  calcInstallments,
  formatCents,
  formatReais,
  getCurrentPhase,
  shouldShowAnchor,
  toCents,
} from "@/lib/pricing";

export interface PricingInput {
  anchorPrice: number;
  phases: PricePhase[];
  installments: { max: number; interestFreeUpTo: number; monthlyInterestRate: number };
}

export interface OfferState {
  phaseId: string;
  phaseLabel: string;
  price: number; // reais
  anchor: number; // reais
  showAnchor: boolean;
  endsAt: number | null;
  nextPhase: { label: string; price: number } | null;
  installments: { count: number; amountLabel: string } | null;
}

export function computeOfferState(now: Date | number, pricing: PricingInput): OfferState {
  const info = getCurrentPhase(pricing.phases, now);
  const price = info.phase.price;
  const inst = calcInstallments(toCents(price), pricing.installments);
  const best = inst.filter((o) => o.interestFree).at(-1);
  return {
    phaseId: info.phase.id,
    phaseLabel: info.phase.label,
    price,
    anchor: pricing.anchorPrice,
    showAnchor: shouldShowAnchor(pricing.anchorPrice, price),
    endsAt: info.endsAt,
    nextPhase: info.next ? { label: info.next.label, price: info.next.price } : null,
    installments:
      best && best.count > 1 ? { count: best.count, amountLabel: formatCents(best.amount) } : null,
  };
}

export function getPriceVars(offer: OfferState) {
  return {
    phaseLabel: offer.phaseLabel,
    price: formatReais(offer.price),
    anchor: formatReais(offer.anchor),
    nextPrice: offer.nextPhase ? formatReais(offer.nextPhase.price) : "",
  };
}
