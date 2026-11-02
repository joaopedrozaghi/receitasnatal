import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site.config";
import {
  calcInstallments,
  calcOrderTotal,
  formatCents,
  formatReais,
  getCurrentPhase,
  shouldShowAnchor,
  toCents,
} from "@/lib/pricing";
import { getOfferState } from "@/lib/offer";

const phases = [
  { id: "lancamento", label: "Oferta de lançamento", price: 37, until: "2026-11-15T23:59:00-03:00" },
  { id: "natal", label: "Oferta de Natal", price: 57, until: "2026-12-10T23:59:00-03:00" },
  { id: "cheio", label: "Preço cheio", price: 97, until: null },
];

describe("fase atual por data", () => {
  it("antes do fim do lançamento → lançamento", () => {
    const r = getCurrentPhase(phases, new Date("2026-11-01T10:00:00-03:00"));
    expect(r.phase.id).toBe("lancamento");
    expect(r.next?.id).toBe("natal");
    expect(r.endsAt).toBe(Date.parse("2026-11-15T23:59:00-03:00"));
  });

  it("exatamente no limite já avança para a próxima fase", () => {
    expect(getCurrentPhase(phases, Date.parse("2026-11-15T23:59:00-03:00")).phase.id).toBe("natal");
    expect(getCurrentPhase(phases, Date.parse("2026-11-15T23:58:59-03:00")).phase.id).toBe("lancamento");
  });

  it("depois de 10/12 → preço cheio, sem próxima fase e sem fim", () => {
    const r = getCurrentPhase(phases, new Date("2026-12-24T12:00:00-03:00"));
    expect(r.phase.id).toBe("cheio");
    expect(r.next).toBeNull();
    expect(r.endsAt).toBeNull();
  });

  it("usa os valores reais da config", () => {
    const offer = getOfferState(new Date("2026-11-20T12:00:00-03:00"));
    expect(offer.phaseId).toBe("natal");
    expect(offer.price).toBe(siteConfig.pricing.phases[0]?.price);
    expect(offer.nextPhase?.price).toBe(siteConfig.pricing.anchorPrice);
  });

  it("preço 'de' só aparece com desconto real", () => {
    expect(shouldShowAnchor(97, 37)).toBe(true);
    expect(shouldShowAnchor(97, 97)).toBe(false);
    const cheio = getOfferState(new Date("2027-01-05T12:00:00-03:00"));
    expect(cheio.showAnchor).toBe(false);
    expect(cheio.endsAt).toBeNull();
  });
});

describe("total do pedido (fase + bump)", () => {
  it("sem bump", () => {
    expect(
      calcOrderTotal({ phasePrice: 37, bumpEnabled: true, bumpSelected: false, bumpPrice: 19.9 }),
    ).toEqual({
      base: 3700,
      bump: 0,
      total: 3700,
    });
  });
  it("com bump", () => {
    expect(
      calcOrderTotal({ phasePrice: 37, bumpEnabled: true, bumpSelected: true, bumpPrice: 19.9 }),
    ).toEqual({
      base: 3700,
      bump: 1990,
      total: 5690,
    });
  });
  it("bump desabilitado na config é ignorado", () => {
    expect(
      calcOrderTotal({ phasePrice: 57, bumpEnabled: false, bumpSelected: true, bumpPrice: 19.9 }).total,
    ).toBe(5700);
  });
  it("evita erro de ponto flutuante", () => {
    expect(toCents(19.9)).toBe(1990);
    expect(toCents(0.1 + 0.2)).toBe(30);
  });
});

describe("parcelas", () => {
  const cfg = { max: 3, interestFreeUpTo: 3, monthlyInterestRate: 0.0299 };
  it("até 3x sem juros", () => {
    const opts = calcInstallments(5690, cfg);
    expect(opts.map((o) => o.count)).toEqual([1, 2, 3]);
    expect(opts[2]).toEqual({ count: 3, amount: 1897, total: 5690, interestFree: true });
  });
  it("com juros acima do limite sem juros (tabela Price)", () => {
    const opts = calcInstallments(10000, { max: 6, interestFreeUpTo: 3, monthlyInterestRate: 0.0299 });
    const six = opts.find((o) => o.count === 6);
    expect(six?.interestFree).toBe(false);
    expect(six?.amount).toBe(1846); // 100 * 0.0299 / (1 - 1.0299^-6)
    expect(six?.total).toBeGreaterThan(10000);
  });
  it("respeita parcela mínima", () => {
    expect(calcInstallments(800, { max: 12, interestFreeUpTo: 12, monthlyInterestRate: 0 }).length).toBe(1);
  });
});

describe("formatação", () => {
  it("formata reais", () => {
    expect(formatReais(37)).toBe("37");
    expect(formatReais(19.9)).toBe("19,90");
    expect(formatCents(5690)).toBe("R$ 56,90");
  });
});
