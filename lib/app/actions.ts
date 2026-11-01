"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkCredentials, getCredentials } from "@/lib/app/auth-core";
import { createSession, destroySession } from "@/lib/app/session";

export interface FormState {
  error?: string;
  /** devolve o login digitado para o campo não ficar vazio depois de um erro */
  login?: string;
}

// Limite simples de tentativas por IP (por instância do servidor).
const attempts = new Map<string, number[]>();
function tooManyAttempts(key: string, limit = 10, windowMs = 15 * 60_000): boolean {
  const now = Date.now();
  const list = (attempts.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  attempts.set(key, list);
  return list.length > limit;
}

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const user = String(fd.get("login") ?? "");
  const password = String(fd.get("password") ?? "");
  if (!user || !password) return { error: "Preencha o login e a senha.", login: user };
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (tooManyAttempts(ip))
    return { error: "Muitas tentativas. Aguarde 15 minutos e tente de novo.", login: user };
  if (!checkCredentials(user, password, getCredentials())) {
    return { error: "Login ou senha incorretos. Confira o e-mail da sua compra.", login: user };
  }
  await createSession();
  const next = String(fd.get("next") ?? "");
  redirect(next.startsWith("/app") ? next : "/app");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/app/entrar");
}
