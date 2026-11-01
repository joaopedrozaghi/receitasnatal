"use client";

import { useMemo, useState } from "react";
import { useLocalStore } from "@/lib/app/local-store";

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const num = (s: string) => {
  const n = Number(s.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

/** Calculadora de preço: custo por unidade + margem = preço sugerido. */
export function PriceCalculator() {
  const [rows, setRows] = useState([
    { label: "Ingredientes (receita inteira)", value: "29,60" },
    { label: "Embalagens", value: "7,00" },
    { label: "Gás e energia", value: "3,40" },
  ]);
  const [units, setUnits] = useState("2");
  const [margin, setMargin] = useState("100");
  const [fee, setFee] = useState("0");

  const total = rows.reduce((s, r) => s + num(r.value), 0);
  const u = Math.max(1, num(units));
  const unitCost = total / u;
  const price = unitCost * (1 + num(margin) / 100);
  const priceWithFee = price / (1 - Math.min(num(fee), 90) / 100);
  const profit = priceWithFee * (1 - num(fee) / 100) - unitCost;

  const input =
    "min-h-[48px] w-full min-w-0 rounded-xl border border-cocoa/15 bg-white px-3 text-right text-base focus:border-pine focus:outline-none";
  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-2 [&>div]:min-w-0">
      <div className="space-y-3 rounded-3xl bg-white p-5 shadow-soft sm:p-6">
        <p className="font-display text-xl text-cocoa">Custos da receita</p>
        {rows.map((r, idx) => (
          <div key={idx} className="grid grid-cols-[minmax(0,1fr)_6.5rem_2.5rem] items-center gap-2">
            <input
              aria-label="Descrição do custo"
              value={r.label}
              onChange={(e) => setRows(rows.map((x, k) => (k === idx ? { ...x, label: e.target.value } : x)))}
              className="min-h-[48px] w-full min-w-0 rounded-xl border border-cocoa/15 bg-white px-3 text-sm focus:border-pine focus:outline-none"
            />
            <input
              aria-label={`Valor de ${r.label}`}
              inputMode="decimal"
              value={r.value}
              onChange={(e) => setRows(rows.map((x, k) => (k === idx ? { ...x, value: e.target.value } : x)))}
              className={input}
            />
            <button
              type="button"
              aria-label="Remover"
              onClick={() => setRows(rows.filter((_, k) => k !== idx))}
              className="h-10 w-10 rounded-full text-cocoa-muted hover:text-berry"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setRows([...rows, { label: "Outro custo", value: "0" }])}
          className="min-h-[44px] text-sm font-semibold text-pine underline"
        >
          + Adicionar custo
        </button>
        <div className="grid grid-cols-2 gap-3 pt-2 [&>label]:min-w-0">
          <label className="text-sm font-semibold text-cocoa">
            Rende quantas unidades?
            <input
              inputMode="numeric"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              className={`${input} mt-1`}
            />
          </label>
          <label className="text-sm font-semibold text-cocoa">
            Margem de lucro (%)
            <input
              inputMode="decimal"
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              className={`${input} mt-1`}
            />
          </label>
          <label className="col-span-2 text-sm font-semibold text-cocoa">
            Taxa da maquininha ou app de entrega (%)
            <input
              inputMode="decimal"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className={`${input} mt-1`}
            />
          </label>
        </div>
      </div>
      <div className="space-y-3">
        <div className="rounded-3xl bg-white p-5 shadow-soft sm:p-6">
          <p className="flex justify-between text-cocoa-soft">
            Custo total <strong className="text-cocoa">{brl(total)}</strong>
          </p>
          <p className="mt-2 flex justify-between text-cocoa-soft">
            Custo por unidade <strong className="text-cocoa">{brl(unitCost)}</strong>
          </p>
          <p className="mt-2 flex justify-between text-cocoa-soft">
            Lucro por unidade <strong className="text-pine">{brl(profit)}</strong>
          </p>
        </div>
        <div className="grain rounded-3xl bg-pine p-6 text-center text-snow">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-light">
            Preço sugerido por unidade
          </p>
          <p className="mt-1 font-display text-5xl">{brl(priceWithFee)}</p>
          <p className="mt-2 text-sm text-snow/70">
            Arredonde para um valor redondo (ex.: R$ 39,90 ou R$ 40,00).
          </p>
        </div>
        <p className="text-xs leading-relaxed text-cocoa-muted">
          Os valores iniciais são exemplos: troque pelos preços do seu mercado. A calculadora não garante
          vendas nem lucro; ela ajuda a não vender no prejuízo.
        </p>
      </div>
    </div>
  );
}

/** Checklist salvo no aparelho, separado por conta. */
export function Checklist({
  storageKey,
  groups,
}: {
  storageKey: string;
  groups: { title: string; items: { id: string; label: string }[] }[];
}) {
  const [done, update] = useLocalStore<Record<string, boolean>>(storageKey, {});
  const toggle = (id: string) => update((prev) => ({ ...prev, [id]: !prev[id] }));
  const total = useMemo(() => groups.reduce((s, g) => s + g.items.length, 0), [groups]);
  const count = Object.values(done).filter(Boolean).length;
  return (
    <div>
      <p className="text-sm font-semibold text-pine">
        {count} de {total} tarefas feitas
      </p>
      <div className="mt-4 space-y-5">
        {groups.map((g) => (
          <div key={g.title} className="rounded-3xl bg-white p-5 shadow-soft">
            <p className="font-display text-xl text-cocoa">{g.title}</p>
            <ul className="mt-2">
              {g.items.map((it) => (
                <li key={it.id}>
                  <label className="flex min-h-[52px] cursor-pointer items-center gap-4 border-b border-cocoa/10 py-2">
                    <input
                      type="checkbox"
                      checked={!!done[it.id]}
                      onChange={() => toggle(it.id)}
                      className="h-6 w-6 shrink-0 accent-pine"
                    />
                    <span className={done[it.id] ? "text-cocoa-muted line-through" : "text-cocoa"}>
                      {it.label}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
