"use client";

/**
 * Dados da cliente guardados no próprio aparelho (localStorage), sem banco na nuvem:
 * favoritos, lista de compras e progresso nas receitas.
 * Obs.: ficam no celular/navegador onde ela usa o app (não sincronizam entre aparelhos).
 */
import { useCallback, useEffect, useState } from "react";

const EVENT = "rr:local-store";

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

/** Estado persistido no aparelho e sincronizado entre componentes e abas. */
export function useLocalStore<T>(key: string, fallback: T): [T, (update: (prev: T) => T) => void, boolean] {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setValue(read(key, fallback));
    setReady(true);
    const onChange = (e: Event) => {
      const changed = e instanceof StorageEvent ? e.key : (e as CustomEvent<string>).detail;
      if (changed === key) setValue(read(key, fallback));
    };
    window.addEventListener("storage", onChange);
    window.addEventListener(EVENT, onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener(EVENT, onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (fn: (prev: T) => T) => {
      const next = fn(read(key, fallback));
      write(key, next);
      setValue(next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  return [value, update, ready];
}

export const KEYS = {
  favorites: "rr_app_favoritos",
  shopping: "rr_app_lista",
  progress: "rr_app_progresso",
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
