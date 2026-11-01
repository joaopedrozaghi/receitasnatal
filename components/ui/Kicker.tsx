/** Etiqueta acima dos títulos: estrelinha + texto em caixa alta. */
export function Kicker({
  children,
  tone = "light",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const style =
    tone === "dark"
      ? "bg-white/10 text-gold-light ring-1 ring-white/15"
      : "bg-pine-soft text-pine ring-1 ring-pine/10";
  return (
    <p className={`kicker ${style} ${className}`}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M12 1.5l2.2 7.3 7.3 2.2-7.3 2.2L12 22.5l-2.2-9.3L2.5 11l7.3-2.2z" />
      </svg>
      {children}
    </p>
  );
}
