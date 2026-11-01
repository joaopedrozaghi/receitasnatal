"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

const items = [
  { href: "/app", label: "Início", icon: "home" },
  { href: "/app/buscar", label: "Buscar", icon: "search" },
  { href: "/app/lista", label: "Lista", icon: "list" },
  { href: "/app/favoritos", label: "Favoritos", icon: "heart" },
  { href: "/app/mais", label: "Mais", icon: "sparkle" },
];

function isActive(pathname: string, href: string) {
  if (href === "/app")
    return (
      pathname === "/app" || pathname.startsWith("/app/receita") || pathname.startsWith("/app/categoria")
    );
  if (href === "/app/mais")
    return ["/app/mais", "/app/sos", "/app/calculadora", "/app/bonus", "/app/conta", "/app/admin"].some((p) =>
      pathname.startsWith(p),
    );
  return pathname.startsWith(href);
}

/** Menu: barra inferior no celular, lateral no computador. */
export function AppNav() {
  const pathname = usePathname();
  if (pathname.endsWith("/cozinhar")) return null; // modo cozinha usa a tela inteira
  return (
    <nav
      aria-label="Menu do app"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-cocoa/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:inset-y-0 lg:left-0 lg:right-auto lg:w-60 lg:border-r lg:border-t-0 lg:bg-pine-deep lg:pb-0"
    >
      <Link href="/app" className="hidden px-6 py-7 font-display text-2xl text-snow lg:block">
        Receitinhas <span className="italic text-gold">da Rô</span>
      </Link>
      <ul className="mx-auto flex max-w-md justify-around lg:mx-0 lg:block lg:max-w-none lg:space-y-1 lg:px-3">
        {items.map((it) => {
          const active = isActive(pathname, it.href);
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[60px] min-w-[64px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold lg:min-h-[48px] lg:flex-row lg:justify-start lg:gap-3 lg:rounded-xl lg:px-4 lg:text-[15px] ${
                  active
                    ? "text-berry lg:bg-white/10 lg:text-gold-light"
                    : "text-cocoa-muted lg:text-snow/75 lg:hover:bg-white/5 lg:hover:text-snow"
                }`}
              >
                <Icon name={it.icon} className="h-6 w-6" strokeWidth={active ? 2.1 : 1.7} />
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
