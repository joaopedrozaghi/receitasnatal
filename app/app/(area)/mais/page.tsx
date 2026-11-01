import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/app/session";
import { Container, PageHeader } from "@/components/app/PageHeader";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Mais" };

export default async function MorePage() {
  const user = await requireUser();
  const links = [
    {
      href: "/app/sos",
      icon: "sos",
      title: "Guia SOS",
      text: "Massa não cresceu? Brigadeiro mole? Diagnóstico e solução.",
    },
    {
      href: "/app/calculadora",
      icon: "calculator",
      title: "Calculadora de preço",
      text: "Custo por unidade e preço de venda sem prejuízo.",
    },
    {
      href: "/app/bonus#cronograma",
      icon: "calendar",
      title: "Cronograma da ceia em 72 h",
      text: "Checklist do que fazer em cada dia.",
    },
    {
      href: "/app/bonus#substituicoes",
      icon: "swap",
      title: "Guia de substituições",
      text: "Faltou um ingrediente? Versões sem lactose.",
    },
    {
      href: "/app/bonus#embalagem",
      icon: "gift",
      title: "Embalagem e apresentação",
      text: "Como embalar, etiquetar e montar cestas.",
    },
    { href: "/app/conta", icon: "lock", title: "Minha conta", text: "Senha, instalar o app e sair." },
    ...(user.role === "admin"
      ? [{ href: "/app/admin", icon: "shield", title: "Admin", text: "Liberar acessos e ver compradoras." }]
      : []),
  ];
  return (
    <>
      <PageHeader title="Mais" subtitle="Bônus, ferramentas e a sua conta." />
      <Container className="py-6">
        <ul className="grid gap-3 sm:grid-cols-2">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="flex h-full gap-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-cocoa/5 hover:ring-gold/50"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold-light/40 text-gold-text">
                  <Icon name={l.icon} className="h-6 w-6" />
                </span>
                <span>
                  <span className="block font-display text-xl text-cocoa">{l.title}</span>
                  <span className="mt-0.5 block text-sm text-cocoa-muted">{l.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
