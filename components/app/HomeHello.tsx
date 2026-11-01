"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/app/AuthProvider";

/** Saudação com o nome da conta e o atalho do perfil (no topo da tela inicial). */
export function HomeHello() {
  const { user } = useAuth();
  const [hello, setHello] = useState("Olá");
  useEffect(() => {
    const h = new Date().getHours();
    setHello(h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite");
  }, []);
  const first = user?.name.trim().split(/\s+/)[0] ?? "";

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-snow/70">
          {hello}
          {first ? "," : "!"}
        </p>
        <p className="truncate font-display text-2xl text-snow">{first || "Receitinhas da Rô"}</p>
      </div>
      <Link
        href="/app/conta"
        aria-label="Minha conta"
        className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold-light to-gold text-lg font-bold text-pine-deep shadow-lift ring-2 ring-white/20"
      >
        {first ? first.charAt(0).toUpperCase() : "R"}
      </Link>
    </div>
  );
}
