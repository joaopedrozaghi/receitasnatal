"use client";

import { useActionState } from "react";
import { login, type FormState } from "@/lib/app/actions";
import { Alert, Field, SubmitButton } from "@/components/app/Form";

/** Login padrão: o mesmo login e senha para todas as compradoras (enviados pela plataforma após a compra). */
export function LoginForm({ next, supportEmail }: { next?: string; supportEmail: string }) {
  const [state, action] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next ?? ""} />
      <Field
        label="Login"
        name="login"
        defaultValue={state.login ?? ""}
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="Seu login"
        required
      />
      <Field
        label="Senha"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="Sua senha"
        required
      />
      {state.error ? <Alert>{state.error}</Alert> : null}
      <SubmitButton>Entrar</SubmitButton>
      <p className="pt-2 text-center text-sm leading-relaxed text-cocoa-muted">
        O login e a senha chegaram no e-mail da sua compra. Não encontrou? Olhe em Spam e Promoções ou escreva
        para{" "}
        <a href={`mailto:${supportEmail}`} className="font-semibold text-pine underline">
          {supportEmail}
        </a>
        .
      </p>
    </form>
  );
}
