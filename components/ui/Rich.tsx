import { Fragment, type ReactNode } from "react";

/**
 * Renderiza ênfases simples da copy: **negrito**, *itálico* e ~~riscado~~.
 * Não aceita HTML (seguro para texto vindo da config).
 */
export function Rich({
  text,
  emClassName = "",
  strongClassName = "font-semibold text-cocoa",
}: {
  text: string;
  emClassName?: string;
  strongClassName?: string;
}): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|~~[^~]+~~|\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return (
            <strong key={i} className={strongClassName}>
              {part.slice(2, -2)}
            </strong>
          );
        if (part.startsWith("~~") && part.endsWith("~~"))
          return (
            <s key={i} className="opacity-70">
              {part.slice(2, -2)}
            </s>
          );
        if (part.startsWith("*") && part.endsWith("*"))
          return (
            <em key={i} className={emClassName}>
              {part.slice(1, -1)}
            </em>
          );
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

/** Título de seção com destaque em itálico (dourado no escuro, cereja no claro). */
export function Title({
  text,
  as: Tag = "h2",
  className = "h2",
  tone = "light",
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <Tag className={`${className} ${tone === "dark" ? "!text-snow" : ""}`}>
      <Rich text={text} emClassName={tone === "dark" ? "text-gold-light" : "text-berry"} />
    </Tag>
  );
}
