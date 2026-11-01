import Link from "next/link";
import type { ReactNode } from "react";

/** Cabeçalho das telas internas do app. */
export function PageHeader({
  title,
  subtitle,
  back,
  action,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  back?: string;
  action?: ReactNode;
}) {
  return (
    <header className="grain rounded-b-[2.25rem] bg-pine-deep px-5 pb-8 pt-[calc(env(safe-area-inset-top)+20px)] text-snow sm:px-8 lg:rounded-none">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-3">
          {back ? (
            <Link
              href={back}
              className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-snow/80 hover:text-gold-light"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M15 6l-6 6 6 6" />
              </svg>
              Voltar
            </Link>
          ) : (
            <span className="font-display text-xl lg:hidden">
              Receitinhas <span className="italic text-gold">da Rô</span>
            </span>
          )}
          {action}
        </div>
        <h1 className="mt-4 text-[2.1rem] leading-[1.05] !text-snow sm:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-[15px] text-snow/75">{subtitle}</p> : null}
      </div>
    </header>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-4xl px-5 sm:px-8 ${className}`}>{children}</div>;
}
