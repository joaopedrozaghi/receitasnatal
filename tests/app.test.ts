import { describe, expect, it } from "vitest";
import { recipes, categories, getRecipe } from "@/content/recipes";
import {
  aggregateShopping,
  formatQty,
  roundQty,
  scaleIngredients,
  searchRecipes,
} from "@/lib/app/recipe-model";
import { checkCredentials, getCredentials, signSession, verifySession } from "@/lib/app/auth-core";

describe("receitas", () => {
  it("tem mais de 100 receitas, com slugs únicos e conteúdo completo", () => {
    expect(recipes.length).toBeGreaterThanOrEqual(100);
    expect(new Set(recipes.map((r) => r.slug)).size).toBe(recipes.length);
    for (const r of recipes) {
      expect(r.ingredients.length, r.slug).toBeGreaterThan(0);
      expect(r.steps.length, r.slug).toBeGreaterThan(1);
      expect(
        r.steps.every((s) => s.text.trim().length > 5),
        r.slug,
      ).toBe(true);
      expect(
        categories.some((c) => c.id === r.category),
        r.slug,
      ).toBe(true);
    }
  });

  it("toda categoria tem receitas", () => {
    for (const c of categories)
      expect(recipes.filter((r) => r.category === c.id).length, c.id).toBeGreaterThanOrEqual(10);
  });

  it("ajusta porções e arredonda de forma útil", () => {
    const r = getRecipe("brigadeiro-tradicional")!;
    const dobro = scaleIngredients(r, 50);
    expect(dobro.find((i) => i.name === "Leite condensado")?.qty).toBe(790);
    expect(roundQty(2.3, "un")).toBe(2.5);
    expect(roundQty(123, "g")).toBe(125);
    expect(formatQty(0.5, "un")).toBe("½");
    expect(formatQty(250, "ml")).toBe("250 ml");
    expect(formatQty(null, "a gosto")).toBe("a gosto");
  });

  it("soma itens iguais na lista de compras", () => {
    const list = aggregateShopping([
      { name: "Leite condensado", qty: 395, unit: "g" },
      { name: "Leite Condensado", qty: 395, unit: "g" },
      { name: "Ovos", qty: 2, unit: "un" },
    ]);
    expect(list).toHaveLength(2);
    expect(list.find((i) => i.name.startsWith("Leite"))?.qty).toBe(790);
  });

  it("busca por nome e por ingrediente", () => {
    expect(searchRecipes(recipes, "brigadeiro")[0]?.title).toMatch(/Brigadeiro/);
    expect(searchRecipes(recipes, "bacalhau").length).toBeGreaterThanOrEqual(2);
    expect(searchRecipes(recipes, "xyzabc")).toEqual([]);
  });
});

describe("login padrão (sem banco de dados)", () => {
  const env = {
    NODE_ENV: "production",
    APP_LOGIN: "Natal",
    APP_PASSWORD: "Panetone-2026",
  } as NodeJS.ProcessEnv;
  const creds = getCredentials(env);

  it("lê login e senha das variáveis de ambiente; em produção sem elas, não libera", () => {
    expect(creds).toEqual({ login: "Natal", password: "Panetone-2026" });
    expect(getCredentials({ NODE_ENV: "production" } as NodeJS.ProcessEnv)).toBeNull();
  });

  it("confere login sem diferenciar maiúsculas e senha exata", () => {
    expect(checkCredentials(" natal ", "Panetone-2026", creds)).toBe(true);
    expect(checkCredentials("natal", "panetone-2026", creds)).toBe(false);
    expect(checkCredentials("outro", "Panetone-2026", creds)).toBe(false);
    expect(checkCredentials("natal", "Panetone-2026", null)).toBe(false);
  });

  it("sessão assinada: válida, expira e cai quando a senha muda", () => {
    const now = Date.now();
    const token = signSession(creds!, now, env);
    expect(verifySession(token, creds, now, env)).toBe(true);
    expect(verifySession(token, creds, now + 91 * 86_400_000, env)).toBe(false);
    expect(verifySession(token.replace(/.$/, "x"), creds, now, env)).toBe(false);
    const changed = { login: "Natal", password: "Nova-senha" };
    expect(verifySession(token, changed, now, env)).toBe(false);
    expect(verifySession(undefined, creds, now, env)).toBe(false);
  });
});
