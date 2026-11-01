import { describe, expect, it } from "vitest";
import { recipes, categories, getRecipe } from "@/content/recipes";
import {
  aggregateShopping,
  formatQty,
  roundQty,
  scaleIngredients,
  searchRecipes,
} from "@/lib/app/recipe-model";

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
