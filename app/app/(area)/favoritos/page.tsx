import type { Metadata } from "next";
import Link from "next/link";
import { getRecipe } from "@/content/recipes";
import { requireUser } from "@/lib/app/session";
import { listFavorites } from "@/lib/app/userdata";
import { Container, PageHeader } from "@/components/app/PageHeader";
import { RecipeCard } from "@/components/app/RecipeCard";

export const metadata: Metadata = { title: "Favoritos" };

export default async function FavoritesPage() {
  const user = await requireUser();
  const favs = (await listFavorites(user.id)).map(getRecipe).filter((r): r is NonNullable<typeof r> => !!r);
  return (
    <>
      <PageHeader title="Favoritos" subtitle="As receitas que você salvou para a sua ceia." />
      <Container className="py-6">
        {favs.length ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {favs.map((r) => (
              <li key={r.slug}>
                <RecipeCard recipe={r} />
              </li>
            ))}
          </ul>
        ) : (
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
        )}
      </Container>
    </>
  );
}
