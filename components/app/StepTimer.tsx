"use client";

import { useEffect, useRef, useState } from "react";

function fmt(totalSec: number): string {
  const s = Math.max(0, Math.round(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

function alarm(label: string) {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.35, 0.7].forEach((t) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.3);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.32);
    });
  } catch {
    /* sem áudio */
  }
  navigator.vibrate?.([300, 150, 300, 150, 300]);
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification("⏰ Tempo esgotado", { body: label, icon: "/images/app/icon-192.png" });
    } catch {
      /* alguns navegadores só permitem via service worker */
    }
  }
}

/**
 * Timer de etapa. Guarda o horário de término (não conta "ticks"), então continua certo
 * mesmo se o celular bloquear a tela ou a aba ficar em segundo plano.
 */
export function StepTimer({
  minutes,
  label,
  size = "md",
}: {
  minutes: number;
  label: string;
  size?: "md" | "lg";
}) {
  const total = minutes * 60;
  const [endAt, setEndAt] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(total);
  const [done, setDone] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    if (!endAt) return;
    const tick = () => {
      const left = (endAt - Date.now()) / 1000;
      setRemaining(left);
      if (left <= 0 && !fired.current) {
        fired.current = true;
        setDone(true);
        setEndAt(null);
        alarm(label);
      }
    };
    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [endAt, label]);

  const start = () => {
    if ("Notification" in window && Notification.permission === "default")
      void Notification.requestPermission();
    fired.current = false;
    setDone(false);
    setEndAt(Date.now() + (remaining > 0 ? remaining : total) * 1000);
  };
  const pause = () => setEndAt(null);
  const reset = () => {
    setEndAt(null);
    setDone(false);
    setRemaining(total);
  };

  const running = endAt !== null;
  const progress = 1 - Math.max(0, remaining) / total;
  const big = size === "lg";

  return (
    <div
      className={`inline-flex max-w-full flex-wrap items-center gap-2 rounded-[1.5rem] ${done ? "bg-berry text-white" : big ? "bg-white/10 text-snow ring-1 ring-white/15" : "bg-gold-light/40 text-cocoa ring-1 ring-gold/40"} ${big ? "p-2 pl-5" : "p-1 pl-3"}`}
      role="timer"
      aria-live={done ? "assertive" : "off"}
    >
      <span className={`font-bold tabular-nums ${big ? "text-2xl" : "text-sm"}`}>
        {done ? "Pronto!" : fmt(remaining)}
      </span>
      {!running && !done ? (
        <button
          type="button"
          onClick={start}
          className={`rounded-full font-bold ${big ? "min-h-[48px] bg-gold px-5 text-pine-deep" : "min-h-[36px] bg-pine px-3 text-xs text-white"}`}
        >
          {remaining < total ? "Continuar" : `Iniciar ${minutes >= 60 ? fmt(total) : `${minutes} min`}`}
        </button>
      ) : null}
      {running ? (
        <button
          type="button"
          onClick={pause}
          className={`rounded-full font-bold ${big ? "min-h-[48px] bg-white px-5 text-pine-deep" : "min-h-[36px] bg-white px-3 text-xs text-cocoa"}`}
        >
          Pausar
        </button>
      ) : null}
      {(remaining < total || done) && !running ? (
        <button
          type="button"
          onClick={reset}
          className={`rounded-full font-semibold underline ${big ? "px-3 text-sm" : "px-2 text-xs"}`}
        >
          Zerar
        </button>
      ) : null}
      <span className="sr-only">{Math.round(progress * 100)}% concluído</span>
    </div>
  );
}
