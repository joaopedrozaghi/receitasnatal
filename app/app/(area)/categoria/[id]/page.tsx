import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory, recipesByCategory } from "@/content/recipes";
import { Container, PageHeader } from "@/components/app/PageHeader";
import { RecipeCard, toCardData } from "@/components/app/RecipeCard";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getCategory(id)?.name ?? "Categoria" };
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cat = getCategory(id);
  if (!cat) notFound();
  const list = recipesByCategory(cat.id);
  return (
    <>
      <PageHeader back="/app" title={cat.name} subtitle={`${list.length} receitas · ${cat.description}`} />
      <Container className="py-8">
        <ul className="grid gap-3 sm:grid-cols-2">
          {list.map((r) => (
            <li key={r.slug}>
              <RecipeCard recipe={toCardData(r)} />
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
