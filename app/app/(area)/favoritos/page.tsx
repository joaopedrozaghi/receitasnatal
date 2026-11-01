import type { Metadata } from "next";
import { recipes } from "@/content/recipes";
import { Container, PageHeader } from "@/components/app/PageHeader";
import { toCardData } from "@/components/app/RecipeCard";
import { FavoritesList } from "@/components/app/LocalLists";

export const metadata: Metadata = { title: "Favoritos" };

export default function FavoritesPage() {
  return (
    <>
      <PageHeader title="Favoritos" subtitle="As receitas que você salvou para a sua ceia." />
      <Container className="py-6">
        <FavoritesList all={recipes.map(toCardData)} />
      </Container>
    </>
  );
}
