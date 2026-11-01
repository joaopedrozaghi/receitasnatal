import type { ReactNode } from "react";

/**
 * Moldura de iPhone em CSS puro (sem imagem). O conteúdo da tela usa unidades "em",
 * que escalam com a largura do aparelho (container query), então o mesmo layout
 * funciona do mockup pequeno ao grande.
 */
export function IPhone({
  children,
  className = "",
  dark = false,
  label,
}: {
  children: ReactNode;
  className?: string;
  /** barra de status clara (para telas escuras) */
  dark?: boolean;
  /** descrição acessível da tela */
  label: string;
}) {
  return (
    <figure
      role="img"
      aria-label={label}
      className={`relative aspect-[9/19.4] rounded-[15.5%/7.2%] bg-[#0d0d0f] p-[2.4%] shadow-phone ring-[1.5px] ring-[#8d8a86] ${className}`}
    >
      {/* botões laterais */}
      <span
        aria-hidden="true"
        className="absolute -left-[1.4%] top-[18%] h-[5%] w-[1.6%] rounded-l bg-[#8d8a86]"
      />
      <span
        aria-hidden="true"
        className="absolute -left-[1.4%] top-[26%] h-[9%] w-[1.6%] rounded-l bg-[#8d8a86]"
      />
      <span
        aria-hidden="true"
        className="absolute -right-[1.4%] top-[24%] h-[13%] w-[1.6%] rounded-r bg-[#8d8a86]"
      />
      {/* tela */}
      <div
        aria-hidden="true"
        className={`relative h-full w-full overflow-hidden rounded-[13.2%/6.2%] ${dark ? "bg-pine-deep" : "bg-ivory"}`}
        style={{ containerType: "inline-size" }}
      >
        <div className="flex h-full flex-col" style={{ fontSize: "4.3cqw" }}>
          <div
            className={`relative z-20 flex h-[2.9em] shrink-0 items-center justify-between px-[1.7em] pt-[0.5em] text-[0.82em] font-semibold ${
              dark ? "text-white" : "text-cocoa"
            }`}
          >
            <span>9:41</span>
            <span className="flex items-center gap-[0.3em]">
              <svg viewBox="0 0 18 12" className="h-[0.75em] w-auto" fill="currentColor">
                <rect x="0" y="8" width="3" height="4" rx="1" />
                <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
                <rect x="10" y="3" width="3" height="9" rx="1" />
                <rect x="15" y="0" width="3" height="12" rx="1" />
              </svg>
              <svg viewBox="0 0 26 12" className="h-[0.8em] w-auto" fill="none" stroke="currentColor">
                <rect x="0.5" y="0.5" width="22" height="11" rx="3" strokeOpacity=".5" />
                <rect x="2" y="2" width="16" height="8" rx="1.8" fill="currentColor" stroke="none" />
                <path d="M24.5 4v4" strokeWidth="1.6" strokeLinecap="round" strokeOpacity=".5" />
              </svg>
            </span>
          </div>
          <span className="absolute left-1/2 top-[1.15%] z-30 h-[3.7%] w-[31%] -translate-x-1/2 rounded-full bg-black" />
          <div className="relative min-h-0 flex-1">{children}</div>
          <span
            className={`absolute bottom-[0.9%] left-1/2 z-30 h-[0.55%] w-[36%] -translate-x-1/2 rounded-full ${
              dark ? "bg-white/70" : "bg-cocoa/80"
            }`}
          />
        </div>
      </div>
    </figure>
  );
}
