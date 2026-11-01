import Image from "next/image";
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

/** Capa da receita: foto, ou ilustração colorida da categoria. */
export function RecipeCover({
  recipe,
  className = "",
  sizes,
}: {
  recipe: RecipeCardData;
  className?: string;
  sizes: string;
}) {
  const cat = categories.find((c) => c.id === recipe.category);
  const photo = recipe.photo;
  if (photo) {
    return (
      <span className={`relative block overflow-hidden bg-ivory-deep ${className}`}>
        <Image src={photo} alt="" fill sizes={sizes} className="object-cover" />
      </span>
    );
  }
  return (
    <span
      className={`relative grid place-items-center overflow-hidden ${cat?.tint ?? "bg-ivory-deep"} ${className}`}
    >
      <Icon
        name={cat?.icon ?? "sparkle"}
        className="h-1/2 max-h-16 w-1/2 max-w-16 opacity-80"
        strokeWidth={1.2}
      />
      <span aria-hidden="true" className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-white/30" />
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
