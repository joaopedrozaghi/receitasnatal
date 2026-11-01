"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { KEYS, newId, useLocalStore, type ShoppingItem } from "@/lib/app/local-store";
import { formatQty, scaleIngredients, type Recipe } from "@/lib/app/recipe-model";
import { Icon } from "@/components/ui/Icon";

/** Favoritar: salvo no próprio aparelho. */
export function FavoriteButton({ slug }: { slug: string }) {
  const [favs, setFavs] = useLocalStore<string[]>(KEYS.favorites, []);
  const fav = favs.includes(slug);
  return (
    <button
      type="button"
      aria-pressed={fav}
      onClick={() =>
        setFavs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev]))
      }
      className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-sm font-bold ring-1 transition ${
        fav ? "bg-berry text-white ring-berry" : "bg-white/10 text-snow ring-white/25 hover:bg-white/20"
      }`}
    >
      <Icon name="heart" className="h-5 w-5" strokeWidth={2} />
      {fav ? "Favorita" : "Favoritar"}
    </button>
  );
}

/** Ingredientes com porções ajustáveis + enviar para a lista de compras. */
export function IngredientsPanel({ recipe }: { recipe: Recipe }) {
  const step =
    recipe.yieldQty >= 10 ? Math.max(1, Math.round(recipe.yieldQty / 5)) : recipe.yieldQty === 1 ? 0.5 : 1;
  const [qty, setQty] = useState(recipe.yieldQty);
  const [added, setAdded] = useState<number | null>(null);
  const [, setList] = useLocalStore<ShoppingItem[]>(KEYS.shopping, []);
  const items = useMemo(() => scaleIngredients(recipe, qty), [recipe, qty]);
  const groups = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const i of items) {
      const key = i.group ?? "";
      map.set(key, [...(map.get(key) ?? []), i]);
    }
    return [...map.entries()];
  }, [items]);

  const fmtYield = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1).replace(".", ","));

  return (
    <section
      aria-labelledby="ingredientes"
      className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-cocoa/5 sm:p-7"
    >
      <h2 id="ingredientes" className="text-2xl">
        Ingredientes
      </h2>
      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-ivory px-4 py-3">
        <span className="text-sm text-cocoa-muted">Rendimento</span>
        <span className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Diminuir porções"
            onClick={() => setQty((q) => Math.max(step, +(q - step).toFixed(1)))}
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-xl font-bold text-cocoa ring-1 ring-cocoa/15"
          >
            −
          </button>
          <span className="min-w-[7rem] text-center text-[15px] font-bold text-cocoa" aria-live="polite">
            {fmtYield(qty)} {recipe.yieldUnit}
          </span>
          <button
            type="button"
            aria-label="Aumentar porções"
            onClick={() => setQty((q) => Math.min(recipe.yieldQty * 20, +(q + step).toFixed(1)))}
            className="grid h-10 w-10 place-items-center rounded-full bg-berry text-xl font-bold text-white"
          >
            +
          </button>
        </span>
      </div>
      {qty !== recipe.yieldQty ? (
        <button
          type="button"
          onClick={() => setQty(recipe.yieldQty)}
          className="mt-2 text-sm font-semibold text-pine underline"
        >
          Voltar para a receita original
        </button>
      ) : null}

      <div className="mt-5 space-y-5">
        {groups.map(([group, list]) => (
          <div key={group}>
            {group ? (
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-gold-text">{group}</p>
            ) : null}
            <ul>
              {list.map((i, idx) => (
                <li
                  key={`${i.name}-${idx}`}
                  className="flex items-baseline justify-between gap-4 border-b border-dashed border-cocoa/15 py-2.5 text-[15px]"
                >
                  <span className="text-cocoa-soft">{i.name}</span>
                  <span className="shrink-0 font-bold text-cocoa">{formatQty(i.qty, i.unit)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          const toAdd: ShoppingItem[] = items.map((i) => ({
            id: newId(),
            name: i.name,
            qty: i.qty,
            unit: i.unit,
            recipe: recipe.slug,
            checked: false,
          }));
          setList((prev) => [...prev, ...toAdd]);
          setAdded(toAdd.length);
        }}
        className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-pine px-5 font-bold text-white disabled:opacity-60"
      >
        <Icon name="list" className="h-5 w-5" strokeWidth={2} />
        Adicionar à lista de compras
      </button>
      {added !== null ? (
        <p role="status" className="mt-3 text-center text-sm font-semibold text-pine">
          {added} itens adicionados.{" "}
          <Link href="/app/lista" className="underline">
            Ver lista
          </Link>
        </p>
      ) : null}
    </section>
  );
}
