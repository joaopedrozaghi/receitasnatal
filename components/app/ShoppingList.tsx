"use client";

import { useActionState, useMemo, useOptimistic, useTransition } from "react";
import { addCustomShoppingItem, checkShopping, deleteShopping, type FormState } from "@/lib/app/actions";
import { aggregateShopping, formatQty } from "@/lib/app/recipe-model";

export interface ShoppingItemDTO {
  id: string;
  name: string;
  qty: number | null;
  unit: string | null;
  checked: boolean;
}

const keyOf = (i: { name: string; unit: string | null }) =>
  `${i.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s*\(.*?\)\s*/g, " ")
    .trim()}|${i.unit ?? ""}`;

/** Lista somada (itens iguais de receitas diferentes viram uma linha só). */
export function ShoppingList({ items }: { items: ShoppingItemDTO[] }) {
  const [optimistic, setOptimistic] = useOptimistic(
    items,
    (state, change: { keys: string[]; checked: boolean }) =>
      state.map((it) => (change.keys.includes(keyOf(it)) ? { ...it, checked: change.checked } : it)),
  );
  const [, start] = useTransition();
  const [addState, addAction] = useActionState<FormState, FormData>(addCustomShoppingItem, {});

  const rows = useMemo(() => {
    const groups = new Map<string, ShoppingItemDTO[]>();
    for (const it of optimistic) groups.set(keyOf(it), [...(groups.get(keyOf(it)) ?? []), it]);
    const summed = aggregateShopping(
      optimistic.map((it) => ({ name: it.name, qty: it.qty, unit: it.unit ?? "", checked: it.checked })),
    );
    return summed.map((s) => {
      const k = keyOf({ name: s.name, unit: s.unit });
      return { ...s, key: k, ids: (groups.get(k) ?? []).map((g) => g.id) };
    });
  }, [optimistic]);

  const pending = rows.filter((r) => !r.checked);
  const done = rows.filter((r) => r.checked);

  const toggle = (row: (typeof rows)[number]) =>
    start(async () => {
      setOptimistic({ keys: [row.key], checked: !row.checked });
      await checkShopping(row.ids, !row.checked);
    });

  const share = async () => {
    const text = `Lista de compras · Receitinhas da Rô\n\n${pending.map((r) => `• ${r.name}${r.qty !== null ? ` — ${formatQty(r.qty, r.unit)}` : ""}`).join("\n")}`;
    if (navigator.share) await navigator.share({ text }).catch(() => undefined);
    else await navigator.clipboard?.writeText(text);
  };

  const Row = ({ row }: { row: (typeof rows)[number] }) => (
    <li>
      <label className="flex min-h-[56px] cursor-pointer items-center gap-4 border-b border-cocoa/10 px-1 py-2">
        <input
          type="checkbox"
          checked={!!row.checked}
          onChange={() => toggle(row)}
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

  return (
    <div className="space-y-6">
      <form action={addAction} className="flex gap-2">
        <label className="sr-only" htmlFor="novo-item">
          Novo item
        </label>
        <input
          id="novo-item"
          name="name"
          placeholder="Adicionar item (ex.: forminhas de papel)"
          className="min-h-[52px] flex-1 rounded-full border border-cocoa/15 bg-white px-5 text-base focus:border-pine focus:outline-none"
        />
        <button type="submit" className="min-h-[52px] rounded-full bg-pine px-5 font-bold text-white">
          +
        </button>
      </form>
      {addState.error ? <p className="text-sm text-berry">{addState.error}</p> : null}

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
            <ul className="mt-2">
              {pending.map((r) => (
                <Row key={r.key} row={r} />
              ))}
            </ul>
          </div>
          {done.length ? (
            <div className="rounded-3xl bg-white/60 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-cocoa-muted">No carrinho ({done.length})</p>
                <button
                  type="button"
                  onClick={() => start(() => deleteShopping("checked"))}
                  className="min-h-[44px] text-sm font-semibold text-berry underline"
                >
                  Remover marcados
                </button>
              </div>
              <ul className="mt-2">
                {done.map((r) => (
                  <Row key={r.key} row={r} />
                ))}
              </ul>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => {
              if (confirm("Apagar a lista inteira?")) start(() => deleteShopping("all"));
            }}
            className="w-full text-center text-sm font-semibold text-cocoa-muted underline"
          >
            Limpar lista
          </button>
        </>
      )}
    </div>
  );
}
