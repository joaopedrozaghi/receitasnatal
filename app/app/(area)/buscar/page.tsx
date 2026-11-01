import type { Metadata } from "next";
import Link from "next/link";
import { categories, recipes } from "@/content/recipes";
import { searchRecipes } from "@/lib/app/recipe-model";
import { Container, PageHeader } from "@/components/app/PageHeader";
import { RecipeCard } from "@/components/app/RecipeCard";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Buscar" };

const suggestions = [
  "chocolate",
  "leite condensado",
  "bacalhau",
  "coco",
  "nozes",
  "sem fogão",
  "fácil",
  "vender",
];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const term = q.slice(0, 80);
  const results = term ? searchRecipes(recipes, term) : [];
  return (
    <>
      <PageHeader
        title="Buscar"
        subtitle="Procure pelo nome da receita ou por um ingrediente que você tem em casa."
      />
      <Container className="py-6">
        <form className="flex gap-2" role="search">
          <label className="flex min-h-[54px] flex-1 items-center gap-3 rounded-full bg-white px-5 shadow-soft ring-1 ring-cocoa/10">
            <Icon name="search" className="h-5 w-5 text-cocoa-muted" strokeWidth={2} />
            <span className="sr-only">Buscar</span>
            <input
              name="q"
              defaultValue={term}
              autoFocus
              placeholder="Ex.: brigadeiro, damasco, ceia…"
              className="w-full bg-transparent text-base outline-none"
            />
          </label>
          <button type="submit" className="min-h-[54px] rounded-full bg-pine px-6 font-bold text-white">
            Buscar
          </button>
        </form>

        {term ? (
          <>
            <p className="mt-6 text-sm text-cocoa-muted">
              {results.length} {results.length === 1 ? "receita encontrada" : "receitas encontradas"} para “
              {term}”
            </p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {results.map((r) => (
                <li key={r.slug}>
                  <RecipeCard recipe={r} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="mt-8 font-semibold text-cocoa">Sugestões</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <li key={s}>
                  <Link
                    href={`/app/buscar?q=${encodeURIComponent(s)}`}
                    className="inline-flex min-h-[44px] items-center rounded-full bg-white px-4 text-sm font-semibold text-cocoa ring-1 ring-cocoa/10 hover:text-berry"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 font-semibold text-cocoa">Categorias</p>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/app/categoria/${c.id}`}
                    className={`flex min-h-[56px] items-center gap-2 rounded-2xl px-4 font-semibold ${c.tint}`}
                  >
                    <Icon name={c.icon} className="h-5 w-5" />
                    <span className="text-cocoa">{c.short}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Container>
    </>
  );
}
