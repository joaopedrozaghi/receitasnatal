import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IPhone } from "@/components/phone/IPhone";
import { CookScreen, HomeScreen, PricingScreen, RecipeScreen } from "@/components/phone/Screens";

export const metadata: Metadata = { title: "Tela", robots: { index: false, follow: false } };

/**
 * Uma tela do app sozinha, para virar a textura do iPhone 3D dos criativos.
 * O script de exportação fotografa só o elemento [data-screen] (sem moldura nem ilha).
 */
export default async function TelaPage({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { s = "home" } = await searchParams;
  const screen =
    s === "recipe" ? (
      <RecipeScreen />
    ) : s === "cook" ? (
      <CookScreen />
    ) : s === "pricing" ? (
      <PricingScreen />
    ) : (
      <HomeScreen />
    );
  return (
    <>
      <style>
        {"nextjs-portal{display:none!important}body{margin:0;background:#000}[data-island]{display:none}"}
      </style>
      <div style={{ width: 420, padding: 0 }}>
        <IPhone label="Tela" dark={s === "cook"} overlayStatus={s === "recipe"}>
          {screen}
        </IPhone>
      </div>
    </>
  );
}
