"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/components/app/AuthProvider";

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
    return ["/app/mais", "/app/sos", "/app/calculadora", "/app/bonus", "/app/conta"].some((p) =>
      pathname.startsWith(p),
    );
  return pathname.startsWith(href);
}

/** Menu: barra flutuante no celular, lateral no computador. */
export function AppNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  if (pathname.endsWith("/cozinhar")) return null; // modo cozinha usa a tela inteira

  return (
    <>
      {/* celular: pílula flutuante de vidro */}
      <nav
        aria-label="Menu do app"
        className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+10px)] z-40 mx-auto max-w-md rounded-[1.75rem] bg-white/80 p-1.5 shadow-[0_18px_40px_-12px_rgba(43,26,20,0.35)] ring-1 ring-cocoa/10 backdrop-blur-xl backdrop-saturate-150 lg:hidden"
      >
        <ul className="grid grid-cols-5">
          {items.map((it) => {
            const active = isActive(pathname, it.href);
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-[1.35rem] text-[11px] font-semibold transition-colors duration-200 ${
                    active ? "bg-pine text-white shadow-soft" : "text-cocoa-muted active:bg-cocoa/5"
                  }`}
                >
                  <Icon name={it.icon} className="h-[22px] w-[22px]" strokeWidth={active ? 2.2 : 1.8} />
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* computador: barra lateral */}
      <nav
        aria-label="Menu do app"
        className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-pine-deep text-snow lg:flex"
      >
        <Link href="/app" className="flex items-center gap-2.5 px-6 py-7">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-gold-light ring-1 ring-white/15">
            <Icon name="panettone" className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span className="font-display text-xl">
            Receitinhas <span className="italic text-gold">da Rô</span>
          </span>
        </Link>
        <ul className="space-y-1 px-3">
          {items.map((it) => {
            const active = isActive(pathname, it.href);
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[48px] items-center gap-3 rounded-2xl px-4 text-[15px] font-semibold transition ${
                    active ? "bg-white/10 text-gold-light" : "text-snow/75 hover:bg-white/5 hover:text-snow"
                  }`}
                >
                  <Icon name={it.icon} className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
        {user ? (
          <Link
            href="/app/conta"
            className="mx-3 mb-5 mt-auto flex items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 hover:bg-white/10"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-light text-pine-deep">
              <Icon name="user" className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{user.name || "Meu app"}</span>
              <span className="block truncate text-xs text-snow/60">Ajustes e instalação</span>
            </span>
          </Link>
        ) : null}
      </nav>
    </>
  );
}
