import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, getRecipe } from "@/content/recipes";
import { LEVELS, formatDuration } from "@/lib/app/recipe-model";
import { Container } from "@/components/app/PageHeader";
import { FavoriteButton, IngredientsPanel } from "@/components/app/RecipeInteractive";
import { StepTimer } from "@/components/app/StepTimer";
import { Icon } from "@/components/ui/Icon";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: getRecipe(slug)?.title ?? "Receita" };
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();
  const cat = getCategory(recipe.category);

  return (
    <>
      <header className="grain relative overflow-hidden rounded-b-[2.25rem] bg-pine-deep text-snow lg:rounded-none">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_70%_at_95%_0%,rgba(212,162,76,0.3)_0%,transparent_70%),radial-gradient(40%_50%_at_0%_100%,rgba(200,16,46,0.16)_0%,transparent_70%)]"
        />
        <div className="relative mx-auto max-w-4xl px-5 pb-8 pt-[calc(env(safe-area-inset-top)+16px)] sm:px-8">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={`/app/categoria/${recipe.category}`}
              className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-snow/80 hover:text-gold-light"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M15 6l-6 6 6 6" />
              </svg>
              {cat?.short}
            </Link>
            <FavoriteButton slug={recipe.slug} />
          </div>
          <h1 className="mt-8 text-[2.2rem] leading-[1.04] !text-snow sm:text-5xl">{recipe.title}</h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-snow/80">{recipe.summary}</p>
          <ul className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
            <li className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">
              {LEVELS[recipe.level]}
            </li>
            <li className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">
              Preparo {formatDuration(recipe.prepMin)}
            </li>
            <li className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">
              Total {formatDuration(recipe.totalMin)}
            </li>
          </ul>
          <Link
            href={`/app/receita/${recipe.slug}/cozinhar`}
            className="btn-neon mt-6 inline-flex min-h-[56px] items-center gap-2 rounded-full px-7 font-bold uppercase tracking-wide text-white"
          >
            <Icon name="flame" className="h-5 w-5" strokeWidth={2} />
            Começar no modo cozinha
          </Link>
        </div>
      </header>

      <Container className="grid gap-8 py-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] [&>*]:min-w-0">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <IngredientsPanel recipe={recipe} />
        </div>
        <section aria-labelledby="preparo">
          <h2 id="preparo" className="text-2xl">
            Modo de preparo
          </h2>
          <ol className="mt-4 space-y-4">
            {recipe.steps.map((s, i) => (
              <li key={i} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-cocoa/5">
                <div className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pine font-display text-lg text-snow">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] leading-relaxed text-cocoa">{s.text}</p>
                    {s.timer ? (
                      <div className="mt-3">
                        <StepTimer minutes={s.timer} label={`${recipe.title} · passo ${i + 1}`} />
                      </div>
                    ) : null}
                    {s.why ? (
                      <p className="mt-3 rounded-xl bg-gold-light/30 p-3 text-sm leading-relaxed text-cocoa-soft">
                        <strong className="text-gold-text">Por quê? </strong>
                        {s.why}
                      </p>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ol>
          {recipe.tips.length ? (
            <div className="mt-6 rounded-2xl bg-pine-soft p-5">
              <p className="font-display text-xl text-pine">Dicas da Rô</p>
              <ul className="mt-2 space-y-2 text-[15px] leading-relaxed">
                {recipe.tips.map((tip) => (
                  <li key={tip}>• {tip}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <p className="mt-6 text-sm text-cocoa-muted">
            Algo saiu diferente?{" "}
            <Link href="/app/sos" className="font-semibold text-berry underline">
              Abra o Guia SOS
            </Link>
          </p>
        </section>
      </Container>
    </>
  );
}
