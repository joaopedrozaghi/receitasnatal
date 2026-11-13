"use client";

import { Children, useEffect, useRef, useState } from "react";

/**
 * Faixa que desliza para o lado (no lugar de uma grade comprida). Avança sozinha devagar enquanto
 * está na tela; para quando a pessoa toca, arrasta ou passa o mouse, e não anda em reduced motion.
 * Fica dentro da margem da página: arrastar a partir da borda da tela é o gesto de voltar do iPhone.
 */
export function SideScroller({
  children,
  label,
  itemClassName = "w-[78%] sm:w-[45%] lg:w-[calc(25%-12px)]",
  interval = 3500,
  tone = "light",
}: {
  children: React.ReactNode;
  label: string;
  itemClassName?: string;
  interval?: number;
  /** "dark" para seções de fundo escuro (bolinhas e setas claras) */
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const ref = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  // paradas possíveis (uma por cartão, até onde a faixa ainda anda): viram as bolinhas
  const [count, setCount] = useState(0);
  const paused = useRef(false);
  const visible = useRef(false);
  const items = Children.toArray(children);

  const stops = () => {
    const el = ref.current;
    if (!el) return [0];
    const max = el.scrollWidth - el.clientWidth;
    const out: number[] = [];
    for (const k of [...el.children] as HTMLElement[]) {
      const x = Math.min(max, Math.max(0, k.offsetLeft - 8));
      if (!out.length || x - out[out.length - 1]! > 4) out.push(x);
    }
    return out;
  };
  const current = () => {
    const el = ref.current;
    const s = stops();
    if (!el) return 0;
    let best = 0;
    s.forEach((x, i) => {
      if (Math.abs(x - el.scrollLeft) < Math.abs(s[best]! - el.scrollLeft)) best = i;
    });
    return best;
  };
  const go = (i: number) => {
    const s = stops();
    ref.current?.scrollTo({ left: s[Math.max(0, Math.min(s.length - 1, i))], behavior: "smooth" });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setCount(stops().length);
      setActive(current());
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const io = new IntersectionObserver(([e]) => (visible.current = !!e?.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setInterval(() => {
      if (reduce || paused.current || !visible.current || document.hidden) return;
      const i = current();
      go(i + 1 >= stops().length ? 0 : i + 1);
    }, interval);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      io.disconnect();
      window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- funções leem o DOM na hora
  }, [interval]);
  const atEnd = active >= count - 1;

  // depois de mexer, volta a andar sozinho só um tempo depois
  const resume = useRef<number | undefined>(undefined);
  const hold = () => {
    paused.current = true;
    window.clearTimeout(resume.current);
  };
  const release = (ms = 6000) => {
    window.clearTimeout(resume.current);
    resume.current = window.setTimeout(() => (paused.current = false), ms);
  };

  const arrow = (dir: -1 | 1) => (
    <button
      type="button"
      aria-label={dir < 0 ? "Anterior" : "Próximo"}
      disabled={dir < 0 ? active === 0 : atEnd}
      onClick={() => {
        hold();
        go(current() + dir);
        release();
      }}
      className={`grid h-11 w-11 place-items-center rounded-full transition disabled:opacity-35 ${
        dark
          ? "bg-white/10 text-snow ring-1 ring-white/15 hover:bg-gold hover:text-pine-deep disabled:hover:bg-white/10 disabled:hover:text-snow"
          : "bg-white text-cocoa shadow-soft ring-1 ring-cocoa/10 hover:bg-pine hover:text-snow disabled:hover:bg-white disabled:hover:text-cocoa"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d={dir < 0 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );

  return (
    <div
      onMouseEnter={hold}
      onMouseLeave={() => release(1500)}
      onTouchStart={hold}
      onTouchEnd={() => release()}
      onFocus={hold}
      onBlur={() => release()}
    >
      <ul
        ref={ref}
        aria-label={label}
        className="relative -mx-2 flex snap-x snap-mandatory scroll-px-2 gap-4 overflow-x-auto overscroll-x-contain px-2 pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((child, i) => (
          <li key={i} className={`flex shrink-0 snap-start ${itemClassName}`}>
            {child}
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center justify-center gap-4">
        <span className="hidden sm:block">{arrow(-1)}</span>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir para ${i + 1}`}
              onClick={() => {
                hold();
                go(i);
                release();
              }}
              className="grid h-6 place-items-center px-0.5"
            >
              <span
                className={`block h-2 rounded-full transition-all ${
                  i === active
                    ? dark
                      ? "w-6 bg-gold"
                      : "w-6 bg-pine"
                    : dark
                      ? "w-2 bg-white/25"
                      : "w-2 bg-cocoa/20"
                }`}
              />
            </button>
          ))}
        </div>
        <span className="hidden sm:block">{arrow(1)}</span>
      </div>
    </div>
  );
}
