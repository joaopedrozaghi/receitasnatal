"use client";

import { useMemo, useState } from "react";
import { KEYS, newId, useLocalStore, type ShoppingItem } from "@/lib/app/local-store";
import { aggregateShopping, formatQty } from "@/lib/app/recipe-model";

const keyOf = (i: { name: string; unit: string }) =>
  `${i.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s*\(.*?\)\s*/g, " ")
    .trim()}|${i.unit}`;

/** Lista de compras salva no aparelho. Itens iguais de receitas diferentes viram uma linha só. */
export function ShoppingList() {
  const [items, setItems, ready] = useLocalStore<ShoppingItem[]>(KEYS.shopping, []);
  const [newItem, setNewItem] = useState("");

  const rows = useMemo(() => {
    const groups = new Map<string, ShoppingItem[]>();
    for (const it of items) groups.set(keyOf(it), [...(groups.get(keyOf(it)) ?? []), it]);
    return aggregateShopping(
      items.map((it) => ({ name: it.name, qty: it.qty, unit: it.unit, checked: it.checked })),
    ).map((s) => {
      const k = keyOf(s);
      return { ...s, key: k, ids: (groups.get(k) ?? []).map((g) => g.id) };
    });
  }, [items]);

  const pending = rows.filter((r) => !r.checked);
  const done = rows.filter((r) => r.checked);

  const toggle = (row: (typeof rows)[number]) =>
    setItems((prev) => prev.map((it) => (row.ids.includes(it.id) ? { ...it, checked: !row.checked } : it)));

  const share = async () => {
    const text = `Lista de compras · Receitinhas da Rô\n\n${pending
      .map((r) => `• ${r.name}${r.qty !== null && r.unit ? ` — ${formatQty(r.qty, r.unit)}` : ""}`)
      .join("\n")}`;
    if (navigator.share) await navigator.share({ text }).catch(() => undefined);
    else await navigator.clipboard?.writeText(text);
  };

  const renderRow = (row: (typeof rows)[number]) => (
    <li key={row.key}>
      <label className="flex min-h-[56px] cursor-pointer items-center gap-4 border-b border-cocoa/10 px-1 py-2">
        <input
          type="checkbox"
          checked={!!row.checked}
          onChange={() => toggle(row)}
          aria-label={row.name}
          className="h-6 w-6 shrink-0 accent-pine"
        />
        <span
          className={`flex-1 text-[16px] ${row.checked ? "text-cocoa-muted line-through" : "text-cocoa"}`}
        >
          {row.name}
        </span>
        {row.qty !== null && row.unit ? (
          <span className="shrink-0 font-bold text-cocoa">{formatQty(row.qty, row.unit)}</span>
        ) : null}
      </label>
    </li>
  );

  if (!ready) return <div className="h-40 animate-pulse rounded-3xl bg-white/60" />;

  return (
    <div className="space-y-6">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const name = newItem.trim();
          if (!name) return;
          setItems((prev) => [
            ...prev,
            { id: newId(), name, qty: null, unit: "", recipe: null, checked: false },
          ]);
          setNewItem("");
        }}
      >
        <label className="sr-only" htmlFor="novo-item">
          Novo item
        </label>
        <input
          id="novo-item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Adicionar item (ex.: forminhas de papel)"
          className="min-h-[52px] min-w-0 flex-1 rounded-full border border-cocoa/15 bg-white px-5 text-base focus:border-pine focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Adicionar"
          className="min-h-[52px] rounded-full bg-pine px-5 font-bold text-white"
        >
          +
        </button>
      </form>

      {rows.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center shadow-soft">
          <p className="font-display text-2xl text-cocoa">Sua lista está vazia</p>
          <p className="mt-2 text-cocoa-muted">
            Abra uma receita e toque em “Adicionar à lista de compras”. Itens repetidos são somados
            automaticamente.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-3xl bg-white p-4 shadow-soft sm:p-6">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-cocoa">{pending.length} itens para comprar</p>
              <button
                type="button"
                onClick={share}
                className="min-h-[44px] text-sm font-semibold text-pine underline"
              >
                Compartilhar
              </button>
            </div>
            <ul className="mt-2">{pending.map(renderRow)}</ul>
          </div>
          {done.length ? (
            <div className="rounded-3xl bg-white/60 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-cocoa-muted">No carrinho ({done.length})</p>
                <button
                  type="button"
                  onClick={() => setItems((prev) => prev.filter((it) => !it.checked))}
                  className="min-h-[44px] text-sm font-semibold text-berry underline"
                >
                  Remover marcados
                </button>
              </div>
              <ul className="mt-2">{done.map(renderRow)}</ul>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => {
              if (confirm("Apagar a lista inteira?")) setItems(() => []);
            }}
            className="w-full text-center text-sm font-semibold text-cocoa-muted underline"
          >
            Limpar lista
          </button>
        </>
      )}
      <p className="text-center text-xs text-cocoa-muted">A lista fica salva neste aparelho.</p>
    </div>
  );
}
