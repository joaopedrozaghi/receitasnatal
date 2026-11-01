import Link from "next/link";
import { categories } from "@/content/recipes/categories";
import { LEVELS, formatDuration, type Recipe } from "@/lib/app/recipe-model";

/** Dados mínimos para o cartão (leve o bastante para ir para o navegador). */
export type RecipeCardData = Pick<
  Recipe,
  "slug" | "title" | "summary" | "level" | "totalMin" | "yieldQty" | "yieldUnit" | "category" | "photo"
>;

export const toCardData = (r: Recipe): RecipeCardData => ({
  slug: r.slug,
  title: r.title,
  summary: r.summary,
  level: r.level,
  totalMin: r.totalMin,
  yieldQty: r.yieldQty,
  yieldUnit: r.yieldUnit,
  category: r.category,
  photo: r.photo,
});
import { Icon } from "@/components/ui/Icon";

/** Capa da receita: ilustração da categoria (o app não usa fotos). */
export function RecipeCover({
  recipe,
  className = "",
}: {
  recipe: RecipeCardData;
  className?: string;
  sizes?: string;
}) {
  const cat = categories.find((c) => c.id === recipe.category);
  return (
    <span
      className={`relative grid place-items-center overflow-hidden ${cat?.tint ?? "bg-ivory-deep"} ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-[size:22px_22px] opacity-[0.07]"
      />
      <span
        aria-hidden="true"
        className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/50 blur-2xl"
      />
      <Icon
        name={cat?.icon ?? "sparkle"}
        className="relative h-1/2 max-h-16 w-1/2 max-w-16 opacity-85"
        strokeWidth={1.3}
      />
    </span>
  );
}

export function RecipeCard({ recipe }: { recipe: RecipeCardData }) {
  return (
    <Link
      href={`/app/receita/${recipe.slug}`}
      className="group flex overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-cocoa/5 transition hover:-translate-y-0.5 hover:shadow-lift"
    >
      <RecipeCover recipe={recipe} sizes="120px" className="h-auto min-h-[104px] w-28 shrink-0" />
      <span className="flex min-w-0 flex-1 flex-col justify-center p-4">
        <span className="font-display text-lg leading-snug text-cocoa group-hover:text-berry">
          {recipe.title}
        </span>
        <span className="mt-1 line-clamp-2 text-[13px] leading-snug text-cocoa-muted">{recipe.summary}</span>
        <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-cocoa-soft">
          <span>{LEVELS[recipe.level]}</span>
          <span>· {formatDuration(recipe.totalMin)}</span>
          <span>
            · {recipe.yieldQty} {recipe.yieldUnit}
          </span>
        </span>
      </span>
    </Link>
  );
}
