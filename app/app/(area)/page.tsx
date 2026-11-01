import Image from "next/image";
import Link from "next/link";
import { categories, getRecipe, recipes, recipesByCategory } from "@/content/recipes";
import { Container } from "@/components/app/PageHeader";
import { RecipeCover, toCardData, type RecipeCardData } from "@/components/app/RecipeCard";
import { ContinueSection } from "@/components/app/LocalLists";
import { InstallHint } from "@/components/app/InstallHint";
import { HomeHello } from "@/components/app/HomeHello";
import { Icon } from "@/components/ui/Icon";
import { LEVELS, formatDuration } from "@/lib/app/recipe-model";

/** Cartão grande do carrossel de destaques. */
function HeroCard({ r }: { r: RecipeCardData }) {
  return (
    <Link
      href={`/app/receita/${r.slug}`}
      className="group relative block h-[300px] w-[78vw] max-w-[320px] snap-start overflow-hidden rounded-[1.75rem] shadow-lift"
    >
      <span className="absolute inset-0">
        <RecipeCover
          recipe={r}
          sizes="320px"
          className="h-full w-full transition duration-700 group-hover:scale-105"
        />
      </span>
      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
      <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-cocoa backdrop-blur">
        {LEVELS[r.level]}
      </span>
      <span className="absolute inset-x-0 bottom-0 p-5 text-white">
        <span className="block font-display text-2xl leading-tight">{r.title}</span>
        <span className="mt-2 flex items-center gap-3 text-sm text-white/80">
          <span className="inline-flex items-center gap-1">
            <Icon name="clock" className="h-4 w-4" /> {formatDuration(r.totalMin)}
          </span>
          <span>
            {r.yieldQty} {r.yieldUnit}
          </span>
        </span>
      </span>
    </Link>
  );
}

/** Cartão compacto dos carrosséis por categoria. */
function MiniCard({ r }: { r: RecipeCardData }) {
  return (
    <Link href={`/app/receita/${r.slug}`} className="group block w-[42vw] max-w-[190px] snap-start">
      <RecipeCover recipe={r} sizes="190px" className="aspect-[4/5] w-full rounded-3xl shadow-soft" />
      <span className="mt-2 block text-[15px] font-semibold leading-snug text-cocoa group-hover:text-berry">
        {r.title}
      </span>
      <span className="text-xs text-cocoa-muted">{formatDuration(r.totalMin)}</span>
    </Link>
  );
}

function Rail({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return (
    <section className="motion-safe:animate-fade-up">
      <div className="flex items-end justify-between px-5 sm:px-8">
        <h2 className="text-2xl">{title}</h2>
        {href ? (
          <Link href={href} className="text-sm font-semibold text-pine hover:text-berry">
            Ver todas
          </Link>
        ) : null}
      </div>
      <ul className="no-scrollbar mt-4 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:scroll-px-8 sm:px-8">
        {children}
      </ul>
    </section>
  );
}

export default async function AppHome({ searchParams }: { searchParams: Promise<{ bemvinda?: string }> }) {
  const { bemvinda } = await searchParams;
  const featured = [
    "panetone-classico-de-frutas",
    "panetone-trufado-de-chocolate",
    "brigadeiro-gourmet-meio-amargo",
    "pernil-assado",
    "chocotone",
  ]
    .map(getRecipe)
    .filter((r): r is NonNullable<typeof r> => !!r)
    .map(toCardData);
  const rails = (["panetones", "docinhos", "ceia"] as const).map((id) => ({
    cat: categories.find((c) => c.id === id)!,
    list: recipesByCategory(id).slice(0, 8).map(toCardData),
  }));

  return (
    <>
      <header className="grain relative overflow-hidden rounded-b-[2.25rem] bg-pine-deep px-5 pb-8 pt-[calc(env(safe-area-inset-top)+18px)] text-snow sm:px-8 lg:rounded-none">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_70%_at_95%_0%,rgba(212,162,76,0.3)_0%,transparent_70%),radial-gradient(40%_50%_at_0%_100%,rgba(200,16,46,0.18)_0%,transparent_70%)]"
        />
        <div className="relative mx-auto max-w-5xl">
          <HomeHello />
          <h1 className="mt-6 text-[2.15rem] leading-[1.05] !text-snow sm:text-5xl">
            O que vamos <em className="text-gold-light">assar hoje?</em>
          </h1>
          <form action="/app/buscar" className="mt-5">
            <label className="flex min-h-[56px] items-center gap-3 rounded-2xl bg-white px-4 text-cocoa shadow-lift focus-within:ring-2 focus-within:ring-gold">
              <Icon name="search" className="h-5 w-5 text-cocoa-muted" strokeWidth={2} />
              <span className="sr-only">Buscar receita</span>
              <input
                name="q"
                placeholder="Buscar receita ou ingrediente"
                className="w-full bg-transparent text-base outline-none placeholder:text-cocoa-muted"
              />
            </label>
          </form>
          <ul className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            {categories.map((c) => (
              <li key={c.id} className="shrink-0">
                <Link
                  href={`/app/categoria/${c.id}`}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-snow ring-1 ring-white/15 backdrop-blur transition hover:bg-white/20"
                >
                  <Icon name={c.icon} className="h-4 w-4 text-gold-light" />
                  {c.short}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-10 py-8">
        {bemvinda ? (
          <Container>
            <div className="rounded-3xl bg-white p-6 shadow-lift ring-1 ring-gold/40">
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
          </Container>
        ) : null}

        <Container className="empty:hidden">
          <ContinueSection all={recipes.map((r) => ({ ...toCardData(r), steps: r.steps.length }))} />
        </Container>

        <Rail title="Destaques da Rô">
          {featured.map((r) => (
            <li key={r.slug} className="shrink-0">
              <HeroCard r={r} />
            </li>
          ))}
        </Rail>

        <Container>
          <section className="motion-safe:animate-fade-up">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl">Categorias</h2>
              <span className="text-sm text-cocoa-muted">{recipes.length} receitas</span>
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/app/categoria/${c.id}`}
                    className="group relative flex h-32 flex-col justify-end overflow-hidden rounded-3xl p-4 shadow-soft transition active:scale-[0.98]"
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
                  className="flex h-32 flex-col justify-end rounded-3xl bg-gradient-to-br from-[#D81F3D] to-berry p-4 text-white shadow-soft transition active:scale-[0.98]"
                >
                  <Icon name="sos" className="mb-auto h-9 w-9" strokeWidth={1.4} />
                  <span className="font-display text-lg leading-tight">Guia SOS</span>
                  <span className="text-xs text-white/80">Deu errado? Resolva aqui</span>
                </Link>
              </li>
            </ul>
          </section>
        </Container>

        {rails.map(({ cat, list }) => (
          <Rail key={cat.id} title={cat.short} href={`/app/categoria/${cat.id}`}>
            {list.map((r) => (
              <li key={r.slug} className="shrink-0">
                <MiniCard r={r} />
              </li>
            ))}
          </Rail>
        ))}

        <Container>
          <section className="motion-safe:animate-fade-up">
            <h2 className="text-2xl">Ferramentas</h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  href: "/app/lista",
                  icon: "list",
                  label: "Lista de compras",
                  tint: "bg-pine-soft text-pine",
                },
                {
                  href: "/app/bonus#cronograma",
                  icon: "calendar",
                  label: "Cronograma da ceia",
                  tint: "bg-[#F6E3C4] text-gold-text",
                },
                {
                  href: "/app/calculadora",
                  icon: "calculator",
                  label: "Calculadora de preço",
                  tint: "bg-berry-soft text-berry",
                },
                {
                  href: "/app/bonus#substituicoes",
                  icon: "swap",
                  label: "Substituições",
                  tint: "bg-[#E6EEF3] text-[#2E5670]",
                },
              ].map((t) => (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    className="flex h-full min-h-[104px] flex-col gap-3 rounded-3xl bg-white p-4 font-semibold text-cocoa shadow-soft ring-1 ring-cocoa/5 transition hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    <span className={`grid h-10 w-10 place-items-center rounded-2xl ${t.tint}`}>
                      <Icon name={t.icon} className="h-5 w-5" />
                    </span>
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Container>
      </div>
    </>
  );
}
