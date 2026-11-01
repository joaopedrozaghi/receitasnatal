import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/app/PageHeader";
import { ShoppingList } from "@/components/app/ShoppingList";

export const metadata: Metadata = { title: "Lista de compras" };

export default function ListPage() {
  return (
    <>
      <PageHeader
        title="Lista de compras"
        subtitle="Montada a partir das receitas que você escolheu, com as quantidades somadas."
      />
      <Container className="py-6">
        <ShoppingList />
      </Container>
    </>
  );
}
