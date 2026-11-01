import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { parseConfig, rawConfig, siteConfig } from "@/config/site.config";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

const { Chef, getChefContent } = await import("@/components/sections/Chef");
const { getFaqItems } = await import("@/components/sections/Closing");

const characterConfig = parseConfig({
  ...rawConfig,
  chef: {
    ...rawConfig.chef,
    mode: "character",
    showDisclosure: true,
    disclosure: "A Chef Rô é uma personagem criada pela marca {{legalName}}.",
  },
});

describe("Seção da Roseli por modo", () => {
  it("modo real (padrão): apresenta a Roseli, sem aviso de personagem nem de IA", () => {
    expect(siteConfig.chef.mode).toBe("real");
    const html = renderToStaticMarkup(<Chef cfg={siteConfig} withCta={false} />);
    expect(html).toContain("Prazer, eu sou a Roseli");
    expect(html).not.toContain('data-testid="chef-disclosure"');
    expect(html).not.toContain("personagem");
    expect(html).not.toContain("geradas por IA");
  });

  it("modo real: credenciais só aparecem se forem preenchidas", () => {
    expect(getChefContent(siteConfig).credentials).toEqual([]);
    const html = renderToStaticMarkup(<Chef cfg={siteConfig} withCta={false} />);
    expect(html).not.toContain('data-testid="chef-credentials"');
  });

  it("modo personagem: mostra a divulgação na legenda", () => {
    const html = renderToStaticMarkup(<Chef cfg={characterConfig} withCta={false} />);
    expect(html).toContain('data-testid="chef-disclosure"');
    expect(html).toContain("personagem criada pela marca SUA RAZÃO SOCIAL");
  });

  it("FAQ não pergunta se a Rô é real quando o modo é real", () => {
    expect(getFaqItems().some((i) => i.q.includes("pessoa real"))).toBe(false);
  });
});

describe("integridade da config", () => {
  it("modo personagem exige divulgação", () => {
    expect(() =>
      parseConfig({ ...rawConfig, chef: { ...rawConfig.chef, mode: "character", showDisclosure: false } }),
    ).toThrow(/showDisclosure/);
  });

  it("preço 'de' precisa ser o praticado na última fase", () => {
    expect(() => parseConfig({ ...rawConfig, pricing: { ...rawConfig.pricing, anchorPrice: 197 } })).toThrow(
      /anchorPrice/,
    );
  });

  it("sem depoimentos ou números inventados por padrão", () => {
    expect(siteConfig.testimonials).toEqual([]);
    expect(siteConfig.proofStats).toEqual([]);
  });
});
