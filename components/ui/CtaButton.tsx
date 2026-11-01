import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface BaseProps {
  children: ReactNode;
  size?: "md" | "lg";
  className?: string;
  /** largura total no mobile */
  block?: boolean;
}

function Inner({ children }: { children: ReactNode }) {
  return (
    <>
      {/* brilho que passa pelo botão (desligado em reduced motion) */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent motion-safe:animate-shine" />
      </span>
      <span className="relative py-3">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="relative h-5 w-5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h13M13 6l6 6-6 6" />
      </svg>
    </>
  );
}

const classes = (size: "md" | "lg", block?: boolean, extra?: string) =>
  [
    "group relative isolate inline-flex items-center justify-center gap-3 rounded-full px-7 text-center font-sans font-bold uppercase tracking-[0.04em] text-white",
    "bg-gradient-to-b from-[#D81F3D] to-berry shadow-cta ring-1 ring-inset ring-white/15",
    "transition duration-200 hover:-translate-y-0.5 hover:from-berry hover:to-berry-hover active:translate-y-0",
    "disabled:cursor-not-allowed disabled:opacity-60",
    size === "lg" ? "min-h-[60px] text-[15px] sm:text-base" : "min-h-[56px] text-sm",
    block ? "w-full sm:w-auto" : "",
    extra ?? "",
  ].join(" ");

/** Botão de compra (cereja). Usado SOMENTE para ações. */
export function CtaLink({
  href,
  children,
  size = "lg",
  className,
  block,
  ...rest
}: BaseProps & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "href">) {
  if (href.startsWith("http"))
    return (
      <a href={href} className={classes(size, block, className)} {...rest}>
        <Inner>{children}</Inner>
      </a>
    );
  return (
    <Link href={href} className={classes(size, block, className)} {...rest}>
      <Inner>{children}</Inner>
    </Link>
  );
}
