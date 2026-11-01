import type { Category, CategoryId, Recipe } from "@/lib/app/recipe-model";
import { categories } from "@/content/recipes/categories";
import { biscoitos } from "@/content/recipes/biscoitos";
import { ceia } from "@/content/recipes/ceia";
import { docinhos } from "@/content/recipes/docinhos";
import { paes } from "@/content/recipes/paes";
import { panetones } from "@/content/recipes/panetones";
import { salgados } from "@/content/recipes/salgados";
import { sobremesas } from "@/content/recipes/sobremesas";

export { categories };

export const recipes: Recipe[] = [
  ...panetones,
  ...docinhos,
  ...salgados,
  ...ceia,
  ...sobremesas,
  ...paes,
  ...biscoitos,
];

const bySlug = new Map(recipes.map((rec) => [rec.slug, rec]));

export const getRecipe = (slug: string): Recipe | undefined => bySlug.get(slug);
export const getCategory = (id: string): Category | undefined => categories.find((c) => c.id === id);
export const recipesByCategory = (id: CategoryId): Recipe[] => recipes.filter((rec) => rec.category === id);

/** Foto da receita ou, se não tiver, a da categoria. */
export const recipePhoto = (rec: Recipe): string | undefined => rec.photo ?? getCategory(rec.category)?.photo;
