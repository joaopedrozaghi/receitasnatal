import "server-only";
import { query } from "@/lib/app/db";
import { newId } from "@/lib/app/crypto";

export async function listFavorites(userId: string): Promise<string[]> {
  const rows = await query<{ recipe_slug: string }>(
    "SELECT recipe_slug FROM app_favorites WHERE user_id = $1 ORDER BY created_at DESC",
    [userId],
  );
  return rows.map((r) => r.recipe_slug);
}

export async function isFavorite(userId: string, slug: string): Promise<boolean> {
  const rows = await query("SELECT 1 FROM app_favorites WHERE user_id = $1 AND recipe_slug = $2", [
    userId,
    slug,
  ]);
  return rows.length > 0;
}

export async function toggleFavoriteDb(userId: string, slug: string): Promise<boolean> {
  const removed = await query(
    "DELETE FROM app_favorites WHERE user_id = $1 AND recipe_slug = $2 RETURNING 1",
    [userId, slug],
  );
  if (removed.length) return false;
  await query("INSERT INTO app_favorites (user_id, recipe_slug) VALUES ($1, $2) ON CONFLICT DO NOTHING", [
    userId,
    slug,
  ]);
  return true;
}

export interface ShoppingRow {
  id: string;
  name: string;
  qty: number | null;
  unit: string | null;
  recipe_slug: string | null;
  checked: boolean;
}

export async function listShopping(userId: string): Promise<ShoppingRow[]> {
  return query<ShoppingRow & Record<string, unknown>>(
    "SELECT id, name, qty, unit, recipe_slug, checked FROM app_shopping WHERE user_id = $1 ORDER BY created_at",
    [userId],
  );
}

export async function addShoppingItems(
  userId: string,
  items: { name: string; qty: number | null; unit: string }[],
  recipeSlug: string | null,
): Promise<void> {
  for (const it of items) {
    await query(
      "INSERT INTO app_shopping (id, user_id, name, qty, unit, recipe_slug) VALUES ($1, $2, $3, $4, $5, $6)",
      [newId(), userId, it.name.slice(0, 120), it.qty, it.unit.slice(0, 30), recipeSlug],
    );
  }
}

export async function setShoppingChecked(userId: string, ids: string[], checked: boolean): Promise<void> {
  if (!ids.length) return;
  await query("UPDATE app_shopping SET checked = $3 WHERE user_id = $1 AND id = ANY($2::text[])", [
    userId,
    ids,
    checked,
  ]);
}

export async function removeShopping(userId: string, ids: string[] | "checked" | "all"): Promise<void> {
  if (ids === "all") await query("DELETE FROM app_shopping WHERE user_id = $1", [userId]);
  else if (ids === "checked")
    await query("DELETE FROM app_shopping WHERE user_id = $1 AND checked", [userId]);
  else if (ids.length)
    await query("DELETE FROM app_shopping WHERE user_id = $1 AND id = ANY($2::text[])", [userId, ids]);
}

export async function saveProgressDb(userId: string, slug: string, step: number): Promise<void> {
  await query(
    `INSERT INTO app_progress (user_id, recipe_slug, step, updated_at) VALUES ($1, $2, $3, now())
     ON CONFLICT (user_id, recipe_slug) DO UPDATE SET step = EXCLUDED.step, updated_at = now()`,
    [userId, slug, step],
  );
}

export async function recentProgress(
  userId: string,
  limit = 3,
): Promise<{ recipe_slug: string; step: number }[]> {
  return query<{ recipe_slug: string; step: number }>(
    "SELECT recipe_slug, step FROM app_progress WHERE user_id = $1 ORDER BY updated_at DESC LIMIT $2",
    [userId, limit],
  );
}
