"use client";

/**
 * Dados de cada conta guardados no próprio aparelho (localStorage), sem banco na nuvem:
 * favoritos, lista de compras e progresso nas receitas. Cada conta tem as suas chaves.
 */
import { useCallback, useEffect, useState } from "react";
import { AUTH_EVENT, currentUser, userPrefix } from "@/lib/app/local-auth";

const EVENT = "rr:local-store";

/** Chave completa da conta logada (ex.: rr:u:ab12cd:favoritos). */
function scoped(base: string): string {
  const u = currentUser();
  return u ? `${userPrefix(u.id)}${base}` : `rr:anon:${base}`;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* modo privado / sem espaço: segue só na memória */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
}

/** Estado salvo no aparelho, por conta, sincronizado entre componentes e abas. */
export function useLocalStore<T>(base: string, fallback: T): [T, (update: (prev: T) => T) => void, boolean] {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => setValue(read(scoped(base), fallback));
    load();
    setReady(true);
    const onChange = (e: Event) => {
      const changed = e instanceof StorageEvent ? e.key : (e as CustomEvent<string>).detail;
      if (changed === scoped(base)) load();
    };
    window.addEventListener("storage", onChange);
    window.addEventListener(EVENT, onChange);
    window.addEventListener(AUTH_EVENT, load);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener(AUTH_EVENT, load);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base]);

  const update = useCallback(
    (fn: (prev: T) => T) => {
      const key = scoped(base);
      const next = fn(read(key, fallback));
      write(key, next);
      setValue(next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [base],
  );

  return [value, update, ready];
}

export const KEYS = {
  favorites: "favoritos",
  shopping: "lista",
  progress: "progresso",
  checklist: "cronograma",
} as const;

export interface ShoppingItem {
  id: string;
  name: string;
  qty: number | null;
  unit: string;
  recipe: string | null;
  checked: boolean;
}

export type ProgressMap = Record<string, { step: number; at: number }>;

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
