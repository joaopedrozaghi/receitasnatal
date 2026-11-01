/** Modelo das receitas do app + funções puras (porções, formatação, lista de compras). */

export type CategoryId = "panetones" | "docinhos" | "salgados" | "ceia" | "sobremesas" | "paes" | "biscoitos";

export interface Category {
  id: CategoryId;
  name: string;
  short: string;
  icon: string;
  tint: string; // classes de cor do cartão
  photo?: string;
  description: string;
}

export interface Ingredient {
  name: string;
  qty: number | null; // null = "a gosto"
  unit: string; // g, ml, un…
  group?: string;
}

export interface Step {
  text: string;
  /** explicação do porquê (ensina a técnica) */
  why?: string;
  /** timer sugerido, em minutos */
  timer?: number;
}

export interface Recipe {
  slug: string;
  title: string;
  category: CategoryId;
  summary: string;
  level: 1 | 2 | 3;
  yieldQty: number;
  yieldUnit: string;
  prepMin: number;
  totalMin: number;
  ingredients: Ingredient[];
  steps: Step[];
  tips: string[];
  photo?: string;
  tags: string[];
}

// ───────── DSL compacta usada nos arquivos de receitas ─────────

/** Ingrediente: "# Grupo" | [nome, qtd, unidade="g"] | [nome, null, "a gosto"] */
export type I = string | [string, number | null, string?];
/** Passo: "texto" | ["texto", { t: minutos, why: "por quê" }] */
export type S = string | [string, { t?: number; why?: string }];

export interface RecipeInput {
  slug: string;
  title: string;
  cat: CategoryId;
  sum: string;
  lvl: 1 | 2 | 3;
  y: [number, string];
  prep: number;
  total: number;
  ing: I[];
  steps: S[];
  tips?: string[];
  photo?: string;
  tags?: string[];
}

export function r(x: RecipeInput): Recipe {
  let group: string | undefined;
  const ingredients: Ingredient[] = [];
  for (const it of x.ing) {
    if (typeof it === "string") {
      group = it.replace(/^#\s*/, "");
      continue;
    }
    const [name, qty, unit] = it;
    ingredients.push({ name, qty, unit: unit ?? (qty === null ? "a gosto" : "g"), group });
  }
  const steps: Step[] = x.steps.map((s) =>
    typeof s === "string" ? { text: s } : { text: s[0], timer: s[1].t, why: s[1].why },
  );
  return {
    slug: x.slug,
    title: x.title,
    category: x.cat,
    summary: x.sum,
    level: x.lvl,
    yieldQty: x.y[0],
    yieldUnit: x.y[1],
    prepMin: x.prep,
    totalMin: x.total,
    ingredients,
    steps,
    tips: x.tips ?? [],
    photo: x.photo,
    tags: x.tags ?? [],
  };
}

// ───────── Porções ─────────

const COUNT_UNITS = new Set([
  "un",
  "unidade",
  "unidades",
  "dente",
  "dentes",
  "folha",
  "folhas",
  "lata",
  "latas",
  "pacote",
]);

/** Arredonda de um jeito que faz sentido na cozinha. */
export function roundQty(qty: number, unit: string): number {
  if (COUNT_UNITS.has(unit)) return Math.max(0.5, Math.round(qty * 2) / 2);
  if (unit === "g" || unit === "ml") {
    if (qty >= 100) return Math.round(qty / 5) * 5;
    if (qty >= 10) return Math.round(qty);
    return Math.max(0.5, Math.round(qty * 2) / 2);
  }
  return Math.round(qty * 10) / 10;
}

export function scaleIngredients(recipe: Recipe, targetYield: number): Ingredient[] {
  const factor = targetYield / recipe.yieldQty;
  return recipe.ingredients.map((i) =>
    i.qty === null ? i : { ...i, qty: roundQty(i.qty * factor, i.unit) },
  );
}

export function formatQty(qty: number | null, unit: string): string {
  if (qty === null) return unit;
  if ((unit === "g" || unit === "ml") && qty >= 1000) {
    const big = Math.round(qty / 10) / 100; // 1250 g → 1,25 kg
    return `${String(big).replace(".", ",")} ${unit === "g" ? "kg" : "l"}`;
  }
  const n = Number.isInteger(qty) ? String(qty) : qty.toFixed(1).replace(".", ",").replace(",0", "");
  const pretty = n === "0,5" ? "½" : n.endsWith(",5") && COUNT_UNITS.has(unit) ? `${n.split(",")[0]} e ½` : n;
  if (unit === "g" || unit === "ml" || unit === "kg" || unit === "l") return `${pretty} ${unit}`;
  if (unit === "un") return pretty;
  return `${pretty} ${unit}`;
}

export function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export const LEVELS: Record<Recipe["level"], string> = { 1: "Fácil", 2: "Médio", 3: "Desafio" };

// ───────── Lista de compras ─────────

export interface ShoppingEntry {
  name: string;
  qty: number | null;
  unit: string;
  checked?: boolean;
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s*\(.*?\)\s*/g, " ")
    .trim();

/** Soma itens iguais (mesmo ingrediente e mesma unidade). */
export function aggregateShopping(items: ShoppingEntry[]): ShoppingEntry[] {
  const map = new Map<string, ShoppingEntry>();
  for (const it of items) {
    const key = `${norm(it.name)}|${it.unit}`;
    const cur = map.get(key);
    if (!cur) map.set(key, { ...it });
    else {
      cur.qty =
        cur.qty === null || it.qty === null ? (cur.qty ?? it.qty) : roundQty(cur.qty + it.qty, it.unit);
      cur.checked = !!cur.checked && !!it.checked;
    }
  }
  return [...map.values()].sort((a, b) => norm(a.name).localeCompare(norm(b.name)));
}

// ───────── Busca ─────────

export function searchRecipes(recipes: Recipe[], term: string): Recipe[] {
  const q = norm(term);
  if (!q) return [];
  const words = q.split(/\s+/);
  return recipes
    .map((rec) => {
      const title = norm(rec.title);
      const ing = rec.ingredients.map((i) => norm(i.name)).join(" ");
      const tags = norm(rec.tags.join(" ") + " " + rec.summary);
      let score = 0;
      for (const w of words) {
        if (title.includes(w)) score += 5;
        else if (ing.includes(w)) score += 3;
        else if (tags.includes(w)) score += 1;
        else return { rec, score: 0 };
      }
      return { rec, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.rec);
}
