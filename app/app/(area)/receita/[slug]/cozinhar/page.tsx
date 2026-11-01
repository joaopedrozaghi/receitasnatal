import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRecipe } from "@/content/recipes";
import { CookMode } from "@/components/app/CookMode";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Modo cozinha · ${getRecipe(slug)?.title ?? "Receita"}` };
}

export default async function CookPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ passo?: string }>;
}) {
  const { slug } = await params;
  const { passo } = await searchParams;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();
  return <CookMode recipe={recipe} initialStep={Number(passo) || 0} />;
}
