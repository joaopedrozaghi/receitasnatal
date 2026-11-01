import type { Metadata } from "next";
import { requireUser } from "@/lib/app/session";
import { listShopping } from "@/lib/app/userdata";
import { Container, PageHeader } from "@/components/app/PageHeader";
import { ShoppingList } from "@/components/app/ShoppingList";

export const metadata: Metadata = { title: "Lista de compras" };

export default async function ListPage() {
  const user = await requireUser();
  const items = await listShopping(user.id);
  return (
    <>
      <PageHeader
        title="Lista de compras"
        subtitle="Montada a partir das receitas que você escolheu, com as quantidades somadas."
      />
      <Container className="py-6">
        <ShoppingList
          items={items.map((i) => ({
            id: i.id,
            name: i.name,
            qty: i.qty === null ? null : Number(i.qty),
            unit: i.unit,
            checked: !!i.checked,
          }))}
        />
      </Container>
    </>
  );
}
