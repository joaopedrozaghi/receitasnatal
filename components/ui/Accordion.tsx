"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";

/** Acordeão acessível (botão com aria-expanded/aria-controls, região rotulada). */
export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <div className="divide-y divide-cocoa/10 rounded-3xl bg-white shadow-soft ring-1 ring-cocoa/5">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btn = `${base}-b${i}`;
        const panel = `${base}-p${i}`;
        return (
          <div key={item.q}>
            <h3 className="font-sans text-base">
              <button
                id={btn}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-[64px] w-full items-center justify-between gap-4 px-5 py-4 text-left text-[17px] font-semibold text-cocoa sm:px-7"
              >
                {item.q}
                <Icon
                  name="chevron"
                  className={`h-5 w-5 shrink-0 text-berry transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  strokeWidth={2}
                />
              </button>
            </h3>
            <div
              id={panel}
              role="region"
              aria-labelledby={btn}
              hidden={!isOpen}
              className="px-5 pb-6 leading-relaxed sm:px-7"
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
