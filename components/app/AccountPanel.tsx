"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { clearData, signOut } from "@/lib/app/local-auth";
import { useAuth } from "@/components/app/AuthProvider";
import { InstallHint } from "@/components/app/InstallHint";

/** Ajustes do app: instalar na tela inicial, sair e apagar os dados deste aparelho. */
export function AccountPanel() {
  const { user } = useAuth();
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [cleared, setCleared] = useState(false);

  if (!user) return null;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-cocoa/5 lg:col-span-2">
        <h2 className="text-2xl">Instalar o app</h2>
        <div className="mt-3">
          <InstallHint />
        </div>
        <p className="mt-4 text-sm text-cocoa-muted">
          Favoritos, lista de compras e progresso ficam salvos neste aparelho. Em outro celular, é só abrir o
          link e tocar em Entrar.
        </p>
      </section>

      <button
        type="button"
        onClick={() => {
          signOut();
          router.replace("/app/entrar");
        }}
        className="min-h-[52px] rounded-2xl bg-white font-bold text-cocoa shadow-soft ring-1 ring-cocoa/10"
      >
        Voltar para a tela de entrada
      </button>

      <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-cocoa/5">
        <h2 className="text-xl">Apagar meus dados</h2>
        <p className="mt-1 text-sm text-cocoa-muted">
          Remove favoritos, lista de compras e progresso deste aparelho.
        </p>
        {cleared ? (
          <p
            role="status"
            className="mt-4 rounded-2xl bg-pine-soft px-4 py-3 text-sm font-semibold text-pine"
          >
            Pronto, os dados deste aparelho foram apagados.
          </p>
        ) : !confirm ? (
          <button
            type="button"
            onClick={() => setConfirm(true)}
            className="mt-4 text-sm font-semibold text-berry underline"
          >
            Apagar dados deste aparelho
          </button>
        ) : (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => {
                clearData();
                setConfirm(false);
                setCleared(true);
              }}
              className="min-h-[48px] flex-1 rounded-2xl bg-berry font-bold text-white"
            >
              Apagar
            </button>
            <button
              type="button"
              onClick={() => setConfirm(false)}
              className="min-h-[48px] flex-1 rounded-2xl bg-ivory font-bold text-cocoa"
            >
              Cancelar
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
