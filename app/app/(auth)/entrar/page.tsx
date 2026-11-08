import type { Metadata } from "next";
import { recipes } from "@/content/recipes";
import { StartScreen } from "@/components/app/StartScreen";

export const metadata: Metadata = { title: "Entrar" };

export default async function EntrarPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <StartScreen next={next?.slice(0, 200)} recipesCount={recipes.length} />;
}
