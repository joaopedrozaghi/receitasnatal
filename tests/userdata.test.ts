import { describe, expect, it } from "vitest";
import { grantAccess } from "@/lib/app/accounts";
import {
  addShoppingItems,
  isFavorite,
  listShopping,
  removeShopping,
  saveProgressDb,
  recentProgress,
  setShoppingChecked,
  toggleFavoriteDb,
} from "@/lib/app/userdata";

describe("dados da usuária (banco PGlite em memória)", () => {
  it("lista de compras: adicionar, marcar e remover", async () => {
    const u = await grantAccess("lista@exemplo.com", { source: "teste" });
    await addShoppingItems(
      u.id,
      [
        { name: "Açúcar", qty: 100, unit: "g" },
        { name: "Ovos", qty: 2, unit: "un" },
      ],
      "x",
    );
    let items = await listShopping(u.id);
    expect(items).toHaveLength(2);
    await setShoppingChecked(u.id, [items[0]!.id], true);
    items = await listShopping(u.id);
    expect(items.find((i) => i.name === "Açúcar")?.checked).toBe(true);
    await removeShopping(u.id, "checked");
    expect(await listShopping(u.id)).toHaveLength(1);
    await removeShopping(u.id, "all");
    expect(await listShopping(u.id)).toHaveLength(0);
  });

  it("favoritos e progresso", async () => {
    const u = await grantAccess("fav@exemplo.com", { source: "teste" });
    expect(await toggleFavoriteDb(u.id, "chocotone")).toBe(true);
    expect(await isFavorite(u.id, "chocotone")).toBe(true);
    expect(await toggleFavoriteDb(u.id, "chocotone")).toBe(false);
    await saveProgressDb(u.id, "chocotone", 3);
    await saveProgressDb(u.id, "chocotone", 4);
    expect(await recentProgress(u.id)).toEqual([{ recipe_slug: "chocotone", step: 4 }]);
  });
});
