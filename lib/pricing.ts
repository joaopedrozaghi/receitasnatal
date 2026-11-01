/**
 * Regras de preço — funções puras, usadas no servidor (fonte da verdade) e no cliente (só exibição).
 * Todos os valores monetários internos estão em CENTAVOS (inteiros).
 */
import type { PricePhase } from "@/config/site.config";

export const toCents = (reais: number): number => Math.round(reais * 100);

export interface PhaseInfo {
  phase: PricePhase;
  index: number;
  next: PricePhase | null;
  /** Momento (ms) em que a fase termina; null na última fase. */
  endsAt: number | null;
}

/** Fase vigente em `now`: a primeira cujo `until` ainda não passou. */
export function getCurrentPhase(phases: readonly PricePhase[], now: Date | number): PhaseInfo {
  const t = typeof now === "number" ? now : now.getTime();
  const index = phases.findIndex((p) => p.until === null || Date.parse(p.until) > t);
  const safeIndex = index === -1 ? phases.length - 1 : index;
  const phase = phases[safeIndex];
  if (!phase) throw new Error("Nenhuma fase de preço configurada");
  return {
    phase,
    index: safeIndex,
    next: phases[safeIndex + 1] ?? null,
    endsAt: phase.until ? Date.parse(phase.until) : null,
  };
}

/** O preço "de" só aparece quando é maior que o preço atual (ou seja, quando há desconto real). */
export function shouldShowAnchor(anchorPrice: number, currentPrice: number): boolean {
  return anchorPrice > currentPrice;
}

export interface OrderTotalInput {
  phasePrice: number; // reais
  bumpEnabled: boolean;
  bumpSelected: boolean;
  bumpPrice: number; // reais
  priceDelta?: number; // reais (A/B de preço, servidor)
}

export interface OrderTotal {
  base: number; // centavos
  bump: number; // centavos
  total: number; // centavos
}

export function calcOrderTotal(input: OrderTotalInput): OrderTotal {
  const base = toCents(input.phasePrice + (input.priceDelta ?? 0));
  if (base <= 0) throw new Error("Preço base inválido");
  const bump = input.bumpEnabled && input.bumpSelected ? toCents(input.bumpPrice) : 0;
  return { base, bump, total: base + bump };
}

export interface InstallmentOption {
  count: number;
  amount: number; // centavos por parcela
  total: number; // centavos totais
  interestFree: boolean;
}

/**
 * Opções de parcelamento. Até `interestFreeUpTo` sem juros; acima disso aplica a tabela Price
 * com `monthlyInterestRate`. Parcelas mínimas de R$ 5,00 (regra comum dos gateways).
 */
export function calcInstallments(
  totalCents: number,
  cfg: { max: number; interestFreeUpTo: number; monthlyInterestRate: number },
  minInstallmentCents = 500,
): InstallmentOption[] {
  const options: InstallmentOption[] = [];
  for (let n = 1; n <= cfg.max; n++) {
    let amount: number;
    let interestFree = true;
    if (n <= cfg.interestFreeUpTo || cfg.monthlyInterestRate === 0) {
      amount = Math.ceil(totalCents / n);
    } else {
      interestFree = false;
      const i = cfg.monthlyInterestRate;
      amount = Math.ceil((totalCents * i) / (1 - Math.pow(1 + i, -n)));
    }
    if (n > 1 && amount < minInstallmentCents) break;
    options.push({ count: n, amount, total: interestFree ? totalCents : amount * n, interestFree });
  }
  return options;
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** Formata centavos como "R$ 37,00". */
export function formatCents(cents: number): string {
  return brl.format(cents / 100).replace(/ /g, " ");
}

/** Formata reais sem o símbolo: 37 → "37", 19.9 → "19,90". */
export function formatReais(reais: number): string {
  const cents = toCents(reais);
  if (cents % 100 === 0) return String(cents / 100);
  return (cents / 100).toFixed(2).replace(".", ",");
}
