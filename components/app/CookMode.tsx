"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { saveProgress } from "@/lib/app/actions";
import { formatQty, type Recipe } from "@/lib/app/recipe-model";
import { StepTimer } from "@/components/app/StepTimer";

type WakeLockSentinelLike = { release: () => Promise<void> };

/** Mantém a tela acesa enquanto o modo cozinha está aberto (quando o navegador permite). */
function useWakeLock() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    let lock: WakeLockSentinelLike | null = null;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (t: "screen") => Promise<WakeLockSentinelLike> };
    };
    const request = async () => {
      try {
        if (nav.wakeLock && document.visibilityState === "visible") {
          lock = await nav.wakeLock.request("screen");
          setActive(true);
        }
      } catch {
        setActive(false);
      }
    };
    void request();
    const onVis = () => void (document.visibilityState === "visible" && request());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      void lock?.release();
    };
  }, []);
  return active;
}

export function CookMode({ recipe, initialStep }: { recipe: Recipe; initialStep: number }) {
  const total = recipe.steps.length;
  const [i, setI] = useState(Math.min(Math.max(initialStep, 0), total - 1));
  const [showIng, setShowIng] = useState(false);
  const awake = useWakeLock();
  const touch = useRef<number | null>(null);
  const step = recipe.steps[i]!;

  const go = useCallback(
    (to: number) => {
      const n = Math.min(Math.max(to, 0), total - 1);
      setI(n);
      void saveProgress(recipe.slug, n);
    },
    [recipe.slug, total],
  );

  useEffect(() => {
    void saveProgress(recipe.slug, i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, i]);

  const last = i === total - 1;

  return (
    <div
      className="grain fixed inset-0 z-50 flex flex-col bg-pine-deep text-snow"
      onTouchStart={(e) => (touch.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        const start = touch.current;
        const end = e.changedTouches[0]?.clientX;
        if (start == null || end == null) return;
        if (end - start < -70) go(i + 1);
        if (end - start > 70) go(i - 1);
      }}
    >
      <header className="flex items-center justify-between gap-3 px-5 pt-[calc(env(safe-area-inset-top)+14px)]">
        <Link
          href={`/app/receita/${recipe.slug}`}
          className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-snow/80"
        >
          ✕ Sair
        </Link>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gold-light">
          Modo cozinha{awake ? " · tela acesa" : ""}
        </span>
        <button
          type="button"
          onClick={() => setShowIng(true)}
          className="min-h-[44px] text-sm font-semibold text-snow/80 underline"
        >
          Ingredientes
        </button>
      </header>

      <div className="px-5 pt-4">
        <p className="truncate text-sm text-snow/70">{recipe.title}</p>
        <div className="mt-2 flex gap-1" aria-hidden="true">
          {recipe.steps.map((_, k) => (
            <span key={k} className={`h-1.5 flex-1 rounded-full ${k <= i ? "bg-gold" : "bg-white/15"}`} />
          ))}
        </div>
        <p className="mt-2 text-sm font-semibold text-gold-light" aria-live="polite">
          Passo {i + 1} de {total}
        </p>
      </div>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-y-auto px-5 py-6">
        <p
          key={i}
          className="font-display text-[1.9rem] leading-[1.18] motion-safe:animate-price-in sm:text-[2.4rem]"
        >
          {step.text}
        </p>
        {step.timer ? (
          <div className="mt-8">
            <StepTimer
              key={`t-${i}`}
              minutes={step.timer}
              label={`${recipe.title} · passo ${i + 1}`}
              size="lg"
            />
          </div>
        ) : null}
        {step.why ? (
          <div className="mt-8 rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
            <p className="font-bold text-gold-light">Por quê?</p>
            <p className="mt-1 text-[17px] leading-relaxed text-snow/90">{step.why}</p>
          </div>
        ) : null}
      </main>

      <footer className="flex gap-3 px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3">
        <button
          type="button"
          onClick={() => go(i - 1)}
          disabled={i === 0}
          className="min-h-[60px] flex-1 rounded-full bg-white/10 font-bold ring-1 ring-white/20 disabled:opacity-30"
        >
          ← Anterior
        </button>
        {last ? (
          <Link
            href={`/app/receita/${recipe.slug}`}
            className="flex min-h-[60px] flex-[2] items-center justify-center rounded-full bg-gold font-bold text-pine-deep"
          >
            Concluir 🎉
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => go(i + 1)}
            className="min-h-[60px] flex-[2] rounded-full bg-white font-bold text-pine-deep"
          >
            Próximo passo →
          </button>
        )}
      </footer>

      {showIng ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ingredientes"
          className="fixed inset-0 z-[60] flex items-end bg-black/50"
          onClick={() => setShowIng(false)}
        >
          <div
            className="max-h-[80dvh] w-full overflow-y-auto rounded-t-[2rem] bg-ivory p-6 pb-[calc(env(safe-area-inset-bottom)+24px)] text-cocoa"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl">Ingredientes</p>
              <button
                type="button"
                onClick={() => setShowIng(false)}
                className="min-h-[44px] px-2 font-semibold underline"
              >
                Fechar
              </button>
            </div>
            <p className="text-sm text-cocoa-muted">
              Receita original: {recipe.yieldQty} {recipe.yieldUnit}
            </p>
            <ul className="mt-3">
              {recipe.ingredients.map((ing, k) => (
                <li
                  key={k}
                  className="flex justify-between gap-4 border-b border-dashed border-cocoa/15 py-2.5"
                >
                  <span>{ing.name}</span>
                  <strong className="shrink-0">{formatQty(ing.qty, ing.unit)}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
