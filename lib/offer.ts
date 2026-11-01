import { siteConfig, type SiteConfig } from "@/config/site.config";
import { computeOfferState, type OfferState, type PricingInput } from "@/lib/offer-state";
import { formatReais } from "@/lib/pricing";
import { interpolate } from "@/lib/template";

export type { OfferState };

export function pricingInput(cfg: SiteConfig = siteConfig): PricingInput {
  return {
    anchorPrice: cfg.pricing.anchorPrice,
    phases: cfg.pricing.phases,
    installments: cfg.pricing.installments,
  };
}

export function getOfferState(now: Date | number, cfg: SiteConfig = siteConfig): OfferState {
  return computeOfferState(now, pricingInput(cfg));
}

/** Variáveis fixas da copy ({{...}}). As de preço vêm de getPriceVars (lib/offer-state). */
export function getStaticVars(cfg: SiteConfig = siteConfig) {
  return {
    brandName: cfg.brand.name,
    edition: cfg.brand.edition,
    year: cfg.brand.editionYear,
    legalName: cfg.brand.legalName,
    cnpj: cfg.brand.cnpj,
    supportEmail: cfg.brand.supportEmail,
    recipesCount: cfg.product.recipesCount,
    modulesCount: cfg.product.modulesCount,
    deliveryFormat: cfg.product.deliveryFormat,
    accessDuration: cfg.product.accessDuration,
    guaranteeDays: cfg.guarantee.days,
    installmentsMax: cfg.pricing.installments.max,
    bumpName: cfg.bump.name,
    bumpPrice: formatReais(cfg.bump.price),
    bumpAnchor: formatReais(cfg.bump.anchorPrice),
  };
}

/** Interpola um texto da copy com as variáveis fixas da config. */
export const t = (text: string, extra: Record<string, unknown> = {}): string =>
  interpolate(text, { ...getStaticVars(), ...extra });

export function chefDisclosure(cfg: SiteConfig = siteConfig): string {
  return interpolate(cfg.chef.disclosure, { legalName: cfg.brand.legalName });
}

/** Divulgação da personagem: obrigatória em mode "character". */
export function shouldShowDisclosure(cfg: SiteConfig = siteConfig): boolean {
  return cfg.chef.mode === "character" || cfg.chef.showDisclosure;
}
