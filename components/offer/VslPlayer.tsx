"use client";

import { useRef, useState } from "react";

/**
 * Player da VSL: mostra a capa com um botão grande de play. O vídeo só começa a baixar
 * quando a pessoa toca (preload="none"), para não pesar o carregamento da página.
 */
export function VslPlayer({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    setStarted(true);
    v.muted = false;
    void v.play().catch(() => {
      v.muted = true;
      void v.play().catch(() => {});
    });
  };

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-pine-deep shadow-[0_30px_60px_-25px_rgba(0,0,0,0.7)] ring-1 ring-gold/30">
      <video
        ref={ref}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        controls={started}
        className="h-full w-full object-cover"
        aria-label={label}
      />
      {!started && (
        <button
          type="button"
          onClick={play}
          className="group absolute inset-0 grid place-items-center"
          aria-label={`Assistir: ${label}`}
        >
          <span className="relative grid h-24 w-24 place-items-center rounded-full bg-snow/95 text-pine shadow-[0_12px_30px_-8px_rgba(0,0,0,0.6)] transition-transform group-hover:scale-105 group-active:scale-95">
            <span
              aria-hidden="true"
              className="absolute inset-0 animate-ping rounded-full bg-snow/40 motion-reduce:animate-none"
            />
            <svg
              viewBox="0 0 24 24"
              className="relative ml-1 h-10 w-10"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5Z" />
            </svg>
          </span>
          <span className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap rounded-full bg-pine-deep/80 px-4 py-2 text-sm font-semibold text-snow backdrop-blur">
            ▶ Assista com som · 1min27
          </span>
        </button>
      )}
    </div>
  );
}
