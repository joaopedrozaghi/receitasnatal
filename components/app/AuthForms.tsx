"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  activateAccount,
  login,
  requestActivation,
  requestReset,
  resetPassword,
  type FormState,
} from "@/lib/app/actions";
import { Alert, DevCode, Field, SubmitButton } from "@/components/app/Form";

const linkCls =
  "font-semibold text-pine underline decoration-gold decoration-2 underline-offset-4 hover:text-berry";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="E-mail" name="email" type="email" autoComplete="email" inputMode="email" required />
      <Field label="Senha" name="password" type="password" autoComplete="current-password" required />
      {state.error ? <Alert>{state.error}</Alert> : null}
      <SubmitButton>Entrar</SubmitButton>
      <div className="flex flex-col items-center gap-3 pt-2 text-sm">
        <Link href="/app/esqueci" className={linkCls}>
          Esqueci a senha
        </Link>
        <p className="text-cocoa-muted">
          Primeiro acesso?{" "}
          <Link href="/app/ativar" className={linkCls}>
            Ativar meu acesso
          </Link>
        </p>
      </div>
    </form>
  );
}

function CodeField() {
  return (
    <Field
      label="Código de 6 números"
      name="code"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="[0-9 ]{6,7}"
      maxLength={7}
      placeholder="000000"
      required
      className="text-center text-2xl tracking-[0.5em]"
    />
  );
}

/** Ativação: 1) e-mail → código; 2) código + nome + senha. */
export function ActivateForm({ initialEmail }: { initialEmail?: string }) {
  const [emailState, sendCode] = useActionState<FormState, FormData>(requestActivation, {
    step: initialEmail ? "code" : "email",
    email: initialEmail,
  });
  const [state, activate] = useActionState<FormState, FormData>(activateAccount, {});
  const [changing, setChanging] = useState(false);
  const email = emailState.email ?? initialEmail ?? "";

  if (emailState.step !== "code" || changing) {
    return (
      <form action={(fd) => (setChanging(false), sendCode(fd))} className="space-y-4">
        <Field
          label="E-mail usado na compra"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={email}
          required
        />
        {emailState.error ? <Alert>{emailState.error}</Alert> : null}
        <SubmitButton>Receber código</SubmitButton>
        <p className="text-center text-sm text-cocoa-muted">
          Já ativou?{" "}
          <Link href="/app/entrar" className={linkCls}>
            Entrar
          </Link>
        </p>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      {emailState.message && !initialEmail ? <Alert tone="success">{emailState.message}</Alert> : null}
      {initialEmail && !emailState.message ? (
        <Alert tone="info">Digite o código que chegou no e-mail da compra e crie a sua senha.</Alert>
      ) : null}
      {emailState.error ? <Alert>{emailState.error}</Alert> : null}
      <DevCode code={emailState.devCode} />
      <form action={activate} className="space-y-4">
        <input type="hidden" name="email" value={email} />
        <p className="text-sm text-cocoa-muted">
          E-mail: <strong className="text-cocoa">{email}</strong>{" "}
          <button type="button" onClick={() => setChanging(true)} className={linkCls}>
            trocar
          </button>
        </p>
        <CodeField />
        <Field
          label="Como quer ser chamada(o)?"
          name="name"
          autoComplete="given-name"
          placeholder="Seu primeiro nome"
        />
        <Field
          label="Crie uma senha"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          hint="Mínimo de 8 caracteres."
        />
        <Field
          label="Repita a senha"
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        {state.error ? <Alert>{state.error}</Alert> : null}
        <SubmitButton>Ativar e entrar</SubmitButton>
      </form>
      <form action={sendCode}>
        <input type="hidden" name="email" value={email} />
        <button type="submit" className={`w-full text-center text-sm ${linkCls}`}>
          Não recebeu? Enviar novo código
        </button>
      </form>
    </div>
  );
}

export function ResetForm() {
  const [emailState, sendCode] = useActionState<FormState, FormData>(requestReset, { step: "email" });
  const [state, reset] = useActionState<FormState, FormData>(resetPassword, {});

  if (emailState.step !== "code") {
    return (
      <form action={sendCode} className="space-y-4">
        <Field label="E-mail da sua conta" name="email" type="email" autoComplete="email" required />
        {emailState.error ? <Alert>{emailState.error}</Alert> : null}
        <SubmitButton>Enviar código</SubmitButton>
        <p className="text-center text-sm">
          <Link href="/app/entrar" className={linkCls}>
            Voltar para o login
          </Link>
        </p>
      </form>
    );
  }
  return (
    <div className="space-y-4">
      {emailState.message ? <Alert tone="success">{emailState.message}</Alert> : null}
      {emailState.error ? <Alert>{emailState.error}</Alert> : null}
      <DevCode code={emailState.devCode} />
      <form action={reset} className="space-y-4">
        <input type="hidden" name="email" value={emailState.email ?? ""} />
        <CodeField />
        <Field
          label="Nova senha"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <Field
          label="Repita a nova senha"
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        {state.error ? <Alert>{state.error}</Alert> : null}
        <SubmitButton>Salvar senha e entrar</SubmitButton>
      </form>
    </div>
  );
}
