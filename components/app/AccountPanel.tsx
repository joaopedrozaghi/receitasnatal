"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { changePassword, deleteAccount, MIN_PASSWORD, signOut } from "@/lib/app/local-auth";
import { useAuth } from "@/components/app/AuthProvider";
import { InstallHint } from "@/components/app/InstallHint";
import { Alert, Field } from "@/components/app/Form";

export function AccountPanel() {
  const { user } = useAuth();
  const router = useRouter();
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [delMsg, setDelMsg] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!user) return null;

  const onChangePw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("next") !== fd.get("confirm"))
      return setPwMsg({ ok: false, text: "As senhas novas não são iguais." });
    const res = await changePassword(String(fd.get("current")), String(fd.get("next")));
    setPwMsg(res.ok ? { ok: true, text: "Senha alterada." } : { ok: false, text: res.error });
    if (res.ok) e.currentTarget.reset();
  };

  const onDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await deleteAccount(String(new FormData(e.currentTarget).get("password")));
    if (!res.ok) return setDelMsg(res.error);
    router.replace("/app/entrar");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-cocoa/5 lg:col-span-2">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold-light to-gold text-xl font-bold text-pine-deep">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0">
          <span className="block font-display text-2xl text-cocoa">{user.name}</span>
          <span className="block truncate text-sm text-cocoa-muted">{user.email}</span>
        </span>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-cocoa/5">
        <h2 className="text-2xl">Instalar o app</h2>
        <div className="mt-3">
          <InstallHint />
        </div>
        <p className="mt-4 text-sm text-cocoa-muted">
          Sua conta, favoritos, lista de compras e progresso ficam salvos neste aparelho. Em outro celular,
          crie a conta de novo com o mesmo código de acesso.
        </p>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-cocoa/5">
        <h2 className="text-2xl">Alterar senha</h2>
        <form onSubmit={onChangePw} className="mt-4 space-y-3">
          <Field
            label="Senha atual"
            name="current"
            type="password"
            autoComplete="current-password"
            required
          />
          <Field
            label="Nova senha"
            name="next"
            type="password"
            autoComplete="new-password"
            minLength={MIN_PASSWORD}
            required
          />
          <Field
            label="Repita a nova senha"
            name="confirm"
            type="password"
            autoComplete="new-password"
            minLength={MIN_PASSWORD}
            required
          />
          {pwMsg ? <Alert tone={pwMsg.ok ? "success" : "error"}>{pwMsg.text}</Alert> : null}
          <button type="submit" className="min-h-[52px] w-full rounded-2xl bg-pine font-bold text-white">
            Salvar nova senha
          </button>
        </form>
      </section>

      <button
        type="button"
        onClick={() => {
          signOut();
          router.replace("/app/entrar");
        }}
        className="min-h-[52px] rounded-2xl bg-white font-bold text-cocoa shadow-soft ring-1 ring-cocoa/10 lg:col-span-2"
      >
        Sair da conta
      </button>

      <section className="rounded-3xl p-2 lg:col-span-2">
        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="text-sm font-semibold text-berry underline"
          >
            Excluir minha conta deste aparelho
          </button>
        ) : (
          <form onSubmit={onDelete} className="space-y-3 rounded-3xl bg-berry-soft p-5">
            <p className="text-sm font-semibold text-berry-hover">
              Isso apaga a conta e todos os dados dela neste aparelho. Confirme com a sua senha.
            </p>
            <Field label="Senha" name="password" type="password" autoComplete="current-password" required />
            {delMsg ? <Alert>{delMsg}</Alert> : null}
            <div className="flex gap-2">
              <button type="submit" className="min-h-[48px] flex-1 rounded-2xl bg-berry font-bold text-white">
                Excluir conta
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="min-h-[48px] flex-1 rounded-2xl bg-white font-bold text-cocoa"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
