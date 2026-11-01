import Image from "next/image";
import Link from "next/link";
import { categories, getRecipe, recipes, recipesByCategory } from "@/content/recipes";
import { requireUser } from "@/lib/app/session";
import { recentProgress } from "@/lib/app/userdata";
import { Container } from "@/components/app/PageHeader";
import { RecipeCard, RecipeCover } from "@/components/app/RecipeCard";
import { InstallHint } from "@/components/app/InstallHint";
import { Icon } from "@/components/ui/Icon";

export default async function AppHome({ searchParams }: { searchParams: Promise<{ bemvinda?: string }> }) {
  const user = await requireUser();
  const { bemvinda } = await searchParams;
  const progress = await recentProgress(user.id, 3);
  const continuing = progress
    .map((p) => ({ recipe: getRecipe(p.recipe_slug), step: p.step }))
    .filter((p): p is { recipe: NonNullable<ReturnType<typeof getRecipe>>; step: number } => !!p.recipe);
  const first = user.name?.split(" ")[0];
  const featured = [
    "panetone-classico-de-frutas",
    "panetone-trufado-de-chocolate",
    "brigadeiro-gourmet-meio-amargo",
    "pernil-assado",
  ]
    .map(getRecipe)
    .filter((r): r is NonNullable<typeof r> => !!r);
  const hour = new Date().toLocaleString("pt-BR", {
    hour: "numeric",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  });
  const h = Number(hour);
  const hello = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";

  return (
    <>
      <header className="grain relative overflow-hidden bg-pine-deep px-5 pb-10 pt-[calc(env(safe-area-inset-top)+20px)] text-snow sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_90%_0%,rgba(212,162,76,0.25)_0%,transparent_70%)]"
        />
        <div className="relative mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <span className="font-display text-xl lg:invisible">
              Receitinhas <span className="italic text-gold">da Rô</span>
            </span>
            <Link
              href="/app/conta"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/10 font-bold text-gold-light ring-1 ring-white/15"
              aria-label="Minha conta"
            >
              {(first ?? user.email)[0]?.toUpperCase()}
            </Link>
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-gold-light">
            Especial de Natal
          </p>
          <h1 className="mt-1 text-[2.2rem] leading-[1.05] !text-snow sm:text-5xl">
            {hello}
            {first ? `, ${first}` : ""}! <em className="text-gold-light">O que vamos fazer hoje?</em>
          </h1>
          <form action="/app/buscar" className="mt-6">
            <label className="flex min-h-[54px] items-center gap-3 rounded-full bg-white px-5 text-cocoa shadow-lift">
              <Icon name="search" className="h-5 w-5 text-cocoa-muted" strokeWidth={2} />
              <span className="sr-only">Buscar receita</span>
              <input
                name="q"
                placeholder="Buscar receita ou ingrediente"
                className="w-full bg-transparent text-base outline-none placeholder:text-cocoa-muted"
              />
            </label>
          </form>
        </div>
      </header>

      <Container className="space-y-12 py-8">
        {bemvinda ? (
          <div className="relative rounded-3xl bg-white p-6 shadow-lift ring-1 ring-gold/40">
            <p className="font-display text-2xl text-cocoa">Bem-vinda(o) ao seu Especial de Natal! 🎄</p>
            <p className="mt-2 text-[15px] leading-relaxed">
              Comece pelo{" "}
              <Link
                href="/app/receita/panetone-classico-de-frutas"
                className="font-semibold text-berry underline"
              >
                Panetone Clássico
              </Link>
              : é a receita que mais ensina. E adicione o app à tela inicial para abrir com um toque.
            </p>
            <InstallHint compact />
          </div>
        ) : null}

        {continuing.length ? (
          <section>
            <h2 className="text-2xl">Continuar de onde parou</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {continuing.map(({ recipe, step }) => (
                <li key={recipe.slug}>
                  <Link
                    href={`/app/receita/${recipe.slug}/cozinhar?passo=${step}`}
                    className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-cocoa/5"
                  >
                    <RecipeCover recipe={recipe} sizes="80px" className="h-16 w-16 shrink-0 rounded-xl" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-cocoa">{recipe.title}</span>
                      <span className="text-sm text-cocoa-muted">
                        Passo {step + 1} de {recipe.steps.length}
                      </span>
                      <span className="mt-1.5 block h-1.5 rounded-full bg-ivory-deep">
                        <span
                          className="block h-full rounded-full bg-berry"
                          style={{ width: `${((step + 1) / recipe.steps.length) * 100}%` }}
                        />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl">Categorias</h2>
            <span className="text-sm text-cocoa-muted">{recipes.length} receitas</span>
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/app/categoria/${c.id}`}
                  className="group relative flex h-32 flex-col justify-end overflow-hidden rounded-2xl p-4 shadow-soft"
                >
                  {c.photo ? (
                    <>
                      <Image
                        src={c.photo}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 220px, 45vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </>
                  ) : (
                    <span className={`absolute inset-0 grid place-items-start p-4 ${c.tint}`}>
                      <Icon name={c.icon} className="h-9 w-9" strokeWidth={1.4} />
                    </span>
                  )}
                  <span
                    className={`relative font-display text-lg leading-tight ${c.photo ? "text-white" : "text-cocoa"}`}
                  >
                    {c.short}
                  </span>
                  <span className={`relative text-xs ${c.photo ? "text-white/80" : "text-cocoa-muted"}`}>
                    {recipesByCategory(c.id).length} receitas
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/app/sos"
                className="flex h-32 flex-col justify-end rounded-2xl bg-berry p-4 text-white shadow-soft"
              >
                <Icon name="sos" className="mb-auto h-9 w-9" strokeWidth={1.4} />
                <span className="font-display text-lg leading-tight">Guia SOS</span>
                <span className="text-xs text-white/80">Deu errado? Resolva aqui</span>
              </Link>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl">Para começar</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {featured.map((r) => (
              <li key={r.slug}>
                <RecipeCard recipe={r} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl">Ferramentas</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { href: "/app/lista", icon: "list", label: "Lista de compras" },
              { href: "/app/bonus#cronograma", icon: "calendar", label: "Cronograma da ceia" },
              { href: "/app/calculadora", icon: "calculator", label: "Calculadora de preço" },
              { href: "/app/bonus#substituicoes", icon: "swap", label: "Substituições" },
            ].map((t) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className="flex h-full min-h-[96px] flex-col gap-2 rounded-2xl bg-white p-4 font-semibold text-cocoa shadow-soft ring-1 ring-cocoa/5 hover:text-berry"
                >
                  <Icon name={t.icon} className="h-6 w-6 text-gold-text" />
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
