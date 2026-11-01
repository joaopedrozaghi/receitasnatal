import type { ReactNode } from "react";

/**
 * Entrada suave ao rolar. O conteúdo vem VISÍVEL no HTML; só anima quando o JS está ativo
 * (classe .reveal-ready no <html>) e o elemento entra na tela (ver RevealObserver).
 * Use as="li" dentro de listas para manter a semântica (<ul> > <li>).
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  return (
    <Tag data-reveal="" className={className} style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </Tag>
  );
}
