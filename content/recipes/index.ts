import type { Category, CategoryId, Recipe } from "@/lib/app/recipe-model";
import { biscoitos } from "@/content/recipes/biscoitos";
import { ceia } from "@/content/recipes/ceia";
import { docinhos } from "@/content/recipes/docinhos";
import { paes } from "@/content/recipes/paes";
import { panetones } from "@/content/recipes/panetones";
import { salgados } from "@/content/recipes/salgados";
import { sobremesas } from "@/content/recipes/sobremesas";

export const categories: Category[] = [
  {
    id: "panetones",
    name: "Panetones e chocotones",
    short: "Panetones",
    icon: "panettone",
    tint: "bg-[#F6E3C4] text-gold-text",
    photo: "/images/receitas/panetones-trufados.jpg",
    description: "Do clássico de frutas ao trufado, doces e salgados.",
  },
  {
    id: "docinhos",
    name: "Docinhos de festa",
    short: "Docinhos",
    icon: "truffle",
    tint: "bg-berry-soft text-berry",
    description: "Brigadeiros, beijinhos, trufas e bombons.",
  },
  {
    id: "salgados",
    name: "Salgados de festa",
    short: "Salgados",
    icon: "savory",
    tint: "bg-pine-soft text-pine",
    photo: "/images/receitas/panetone-salgado.jpg",
    description: "Coxinha, empadinha, bolinho de bacalhau e muito mais.",
  },
  {
    id: "ceia",
    name: "Ceia completa",
    short: "Ceia",
    icon: "roast",
    tint: "bg-[#F3E1D6] text-cocoa-soft",
    photo: "/images/receitas/mesa-ceia.jpg",
    description: "Carnes, aves, arroz, farofas, saladas e acompanhamentos.",
  },
  {
    id: "sobremesas",
    name: "Sobremesas natalinas",
    short: "Sobremesas",
    icon: "dessert",
    tint: "bg-[#EDE3F2] text-[#5B3D6E]",
    description: "Rabanada, pavê, pudim, tortas e mais.",
  },
  {
    id: "paes",
    name: "Pães, roscas e bolos",
    short: "Pães e bolos",
    icon: "wreath",
    tint: "bg-[#FCEFD3] text-[#9A5B12]",
    description: "Rosca doce, pão de mel, stollen e bolos de festa.",
  },
  {
    id: "biscoitos",
    name: "Biscoitos decorados",
    short: "Biscoitos",
    icon: "cookie",
    tint: "bg-[#E6EEF3] text-[#2E5670]",
    photo: "/images/receitas/biscoitos-papai-noel.jpg",
    description: "Amanteigados, gengibre, glacê real e casinha.",
  },
];

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
