"use client";

import Link from "next/link";
import { KEYS, useLocalStore, type ProgressMap } from "@/lib/app/local-store";
import { RecipeCard, RecipeCover, type RecipeCardData } from "@/components/app/RecipeCard";

/** Favoritos salvos no aparelho. */
export function FavoritesList({ all }: { all: RecipeCardData[] }) {
  const [favs, , ready] = useLocalStore<string[]>(KEYS.favorites, []);
  if (!ready) return <div className="h-40 animate-pulse rounded-3xl bg-white/60" />;
  const list = favs.map((slug) => all.find((r) => r.slug === slug)).filter((r): r is RecipeCardData => !!r);
  if (!list.length) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-soft">
        <p className="font-display text-2xl text-cocoa">Nenhum favorito ainda</p>
        <p className="mt-2 text-cocoa-muted">
          Toque em “Favoritar” numa receita para encontrá-la rápido aqui.
        </p>
        <Link
          href="/app"
          className="mt-5 inline-flex min-h-[48px] items-center rounded-full bg-pine px-6 font-bold text-white"
        >
          Ver receitas
        </Link>
      </div>
    );
  }
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {list.map((r) => (
        <li key={r.slug}>
          <RecipeCard recipe={r} />
        </li>
      ))}
    </ul>
  );
}

/** "Continuar de onde parou" (progresso salvo no aparelho pelo modo cozinha). */
export function ContinueSection({ all }: { all: (RecipeCardData & { steps: number })[] }) {
  const [progress, , ready] = useLocalStore<ProgressMap>(KEYS.progress, {});
  if (!ready) return null;
  const items = Object.entries(progress)
    .sort((a, b) => b[1].at - a[1].at)
    .slice(0, 3)
    .map(([slug, p]) => ({ recipe: all.find((r) => r.slug === slug), step: p.step }))
    .filter((x): x is { recipe: RecipeCardData & { steps: number }; step: number } => !!x.recipe);
  if (!items.length) return null;
  return (
    <section>
      <h2 className="text-2xl">Continuar de onde parou</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map(({ recipe, step }) => (
          <li key={recipe.slug}>
            <Link
              href={`/app/receita/${recipe.slug}/cozinhar?passo=${step}`}
              className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-cocoa/5"
            >
              <RecipeCover recipe={recipe} sizes="80px" className="h-16 w-16 shrink-0 rounded-xl" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-cocoa">{recipe.title}</span>
                <span className="text-sm text-cocoa-muted">
                  Passo {step + 1} de {recipe.steps}
                </span>
                <span className="mt-1.5 block h-1.5 rounded-full bg-ivory-deep">
                  <span
                    className="block h-full rounded-full bg-berry"
                    style={{ width: `${((step + 1) / recipe.steps) * 100}%` }}
                  />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
