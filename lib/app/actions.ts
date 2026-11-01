"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getRecipe } from "@/content/recipes";
import {
  CODE_TTL,
  MIN_PASSWORD,
  adminEmails,
  checkCredentials,
  consumeCode,
  findUserByEmail,
  grantAccess,
  issueCode,
  revokeAccess,
  setPassword,
  type CodeCheck,
} from "@/lib/app/accounts";
import { normalizeEmail, verifyPassword } from "@/lib/app/crypto";
import { query } from "@/lib/app/db";
import { activationEmail, emailConfigured, requestCodeEmail, sendEmail } from "@/lib/app/email";
import { scaleIngredients } from "@/lib/app/recipe-model";
import { createSession, destroySession, requireAdmin, requireUser } from "@/lib/app/session";
import {
  addShoppingItems,
  removeShopping,
  saveProgressDb,
  setShoppingChecked,
  toggleFavoriteDb,
} from "@/lib/app/userdata";

export interface FormState {
  ok?: boolean;
  error?: string;
  message?: string;
  step?: "email" | "code";
  email?: string;
  /** só em desenvolvimento sem provedor de e-mail: mostra o código na tela para testar */
  devCode?: string;
}

const emailSchema = z.string().trim().toLowerCase().email();
const passwordSchema = z
  .string()
  .min(MIN_PASSWORD, `A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres.`)
  .max(128);

const showDevCode = () => process.env.NODE_ENV !== "production" && !emailConfigured();

// Limite simples de tentativas de login (por instância). Combinado ao limite de códigos no banco.
const attempts = new Map<string, number[]>();
function tooManyAttempts(key: string, limit = 8, windowMs = 15 * 60_000): boolean {
  const now = Date.now();
  const list = (attempts.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  attempts.set(key, list);
  return list.length > limit;
}
async function clientKey(email: string) {
  const h = await headers();
  return `${h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local"}|${email}`;
}

const codeErrors: Record<Exclude<CodeCheck, "ok">, string> = {
  invalid: "Código incorreto. Confira os 6 números do e-mail.",
  expired: "Este código expirou. Peça um novo.",
  too_many_attempts: "Muitas tentativas. Peça um novo código.",
};

// ───────────────────────── Ativação ─────────────────────────

export async function requestActivation(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = emailSchema.safeParse(fd.get("email"));
  if (!parsed.success) return { step: "email", error: "Digite um e-mail válido." };
  const email = parsed.data;
  let user = await findUserByEmail(email);
  if (!user && adminEmails().includes(email))
    user = { ...(await grantAccess(email, { source: "admin" })), passwordHash: null };

  const generic: FormState = {
    step: "code",
    email,
    message:
      "Se existe uma compra com este e-mail, enviamos um código de 6 números. Confira também Spam e Promoções.",
  };
  if (!user || user.status !== "active" || user.activated) return generic;

  const code = await issueCode(email, "activate", CODE_TTL.request);
  if (!code)
    return {
      step: "code",
      email,
      error: "Você pediu muitos códigos. Aguarde alguns minutos e tente de novo.",
    };
  await sendEmail(requestCodeEmail(email, code, "activate"));
  return { ...generic, devCode: showDevCode() ? code : undefined };
}

export async function activateAccount(_: FormState, fd: FormData): Promise<FormState> {
  const email = normalizeEmail(String(fd.get("email") ?? ""));
  const code = String(fd.get("code") ?? "");
  const name = String(fd.get("name") ?? "")
    .trim()
    .slice(0, 60);
  const pw = passwordSchema.safeParse(fd.get("password"));
  if (!pw.success) return { step: "code", email, error: pw.error.issues[0]?.message };
  if (pw.data !== fd.get("confirm")) return { step: "code", email, error: "As senhas não são iguais." };

  const user = await findUserByEmail(email);
  if (!user || user.status !== "active") return { step: "code", email, error: codeErrors.invalid };
  if (user.activated)
    return { step: "code", email, error: "Esta conta já está ativa. Entre com a sua senha." };

  const check = await consumeCode(email, "activate", code);
  if (check !== "ok") return { step: "code", email, error: codeErrors[check] };

  await setPassword(user.id, pw.data, name || null);
  await createSession(user.id);
  redirect("/app?bemvinda=1");
}

// ───────────────────────── Login / sair ─────────────────────────

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const email = normalizeEmail(String(fd.get("email") ?? ""));
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { error: "Preencha e-mail e senha." };
  if (tooManyAttempts(await clientKey(email)))
    return { error: "Muitas tentativas. Aguarde 15 minutos ou redefina a senha." };

  const user = await checkCredentials(email, password);
  if (!user) {
    const existing = await findUserByEmail(email);
    if (existing && existing.status === "active" && !existing.activated)
      return {
        error: "Seu acesso ainda não foi ativado. Use o código que enviamos por e-mail em “Ativar acesso”.",
      };
    return { error: "E-mail ou senha incorretos." };
  }
  await createSession(user.id);
  const next = String(fd.get("next") ?? "");
  redirect(next.startsWith("/app") ? next : "/app");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/app/entrar");
}

// ───────────────────────── Esqueci a senha ─────────────────────────

export async function requestReset(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = emailSchema.safeParse(fd.get("email"));
  if (!parsed.success) return { step: "email", error: "Digite um e-mail válido." };
  const email = parsed.data;
  const generic: FormState = {
    step: "code",
    email,
    message: "Se existe uma conta ativa com este e-mail, enviamos um código de 6 números.",
  };
  const user = await findUserByEmail(email);
  if (!user || user.status !== "active" || !user.activated) return generic;
  const code = await issueCode(email, "reset", CODE_TTL.request);
  if (!code) return { step: "code", email, error: "Você pediu muitos códigos. Aguarde alguns minutos." };
  await sendEmail(requestCodeEmail(email, code, "reset"));
  return { ...generic, devCode: showDevCode() ? code : undefined };
}

export async function resetPassword(_: FormState, fd: FormData): Promise<FormState> {
  const email = normalizeEmail(String(fd.get("email") ?? ""));
  const pw = passwordSchema.safeParse(fd.get("password"));
  if (!pw.success) return { step: "code", email, error: pw.error.issues[0]?.message };
  if (pw.data !== fd.get("confirm")) return { step: "code", email, error: "As senhas não são iguais." };
  const user = await findUserByEmail(email);
  if (!user || user.status !== "active") return { step: "code", email, error: codeErrors.invalid };
  const check = await consumeCode(email, "reset", String(fd.get("code") ?? ""));
  if (check !== "ok") return { step: "code", email, error: codeErrors[check] };
  await setPassword(user.id, pw.data);
  await createSession(user.id);
  redirect("/app");
}

export async function changePassword(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const full = await findUserByEmail(user.email);
  if (!(await verifyPassword(String(fd.get("current") ?? ""), full?.passwordHash)))
    return { error: "Senha atual incorreta." };
  const pw = passwordSchema.safeParse(fd.get("password"));
  if (!pw.success) return { error: pw.error.issues[0]?.message };
  if (pw.data !== fd.get("confirm")) return { error: "As senhas não são iguais." };
  await setPassword(user.id, pw.data);
  await createSession(user.id);
  return { ok: true, message: "Senha alterada." };
}

// ───────────────────────── Favoritos, lista e progresso ─────────────────────────

export async function toggleFavorite(slug: string): Promise<boolean> {
  const user = await requireUser();
  if (!getRecipe(slug)) return false;
  const fav = await toggleFavoriteDb(user.id, slug);
  revalidatePath("/app/favoritos");
  return fav;
}

export async function addRecipeToShopping(slug: string, servings: number): Promise<number> {
  const user = await requireUser();
  const recipe = getRecipe(slug);
  if (!recipe) return 0;
  const target = Math.min(Math.max(servings, 0.5), recipe.yieldQty * 20);
  const items = scaleIngredients(recipe, target).map((i) => ({ name: i.name, qty: i.qty, unit: i.unit }));
  await addShoppingItems(user.id, items, slug);
  revalidatePath("/app/lista");
  return items.length;
}

export async function addCustomShoppingItem(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const name = String(fd.get("name") ?? "").trim();
  if (!name) return { error: "Digite o nome do item." };
  await addShoppingItems(user.id, [{ name, qty: null, unit: "" }], null);
  revalidatePath("/app/lista");
  return { ok: true };
}

export async function checkShopping(ids: string[], checked: boolean): Promise<void> {
  const user = await requireUser();
  await setShoppingChecked(user.id, ids.slice(0, 200), checked);
  revalidatePath("/app/lista");
}

export async function deleteShopping(target: string[] | "checked" | "all"): Promise<void> {
  const user = await requireUser();
  await removeShopping(user.id, Array.isArray(target) ? target.slice(0, 200) : target);
  revalidatePath("/app/lista");
}

export async function saveProgress(slug: string, step: number): Promise<void> {
  const user = await requireUser();
  if (!getRecipe(slug)) return;
  await saveProgressDb(user.id, slug, Math.max(0, Math.min(step, 99)));
}

// ───────────────────────── Admin ─────────────────────────

export async function adminGrant(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = emailSchema.safeParse(fd.get("email"));
  if (!parsed.success) return { error: "E-mail inválido." };
  const name = String(fd.get("name") ?? "").trim() || null;
  const user = await grantAccess(parsed.data, { name, source: "admin" });
  if (user.activated) {
    revalidatePath("/app/admin");
    return { ok: true, message: `${user.email} já tinha conta ativa. Acesso confirmado.` };
  }
  const code = await issueCode(user.email, "activate", CODE_TTL.purchase);
  const sent = code ? await sendEmail(activationEmail(user.email, code, name)) : false;
  revalidatePath("/app/admin");
  return {
    ok: true,
    message: sent
      ? `Acesso liberado e código enviado para ${user.email}.`
      : `Acesso liberado para ${user.email}, mas o e-mail não foi enviado (confira o Resend).`,
    devCode: showDevCode() && code ? code : undefined,
  };
}

export async function adminRevoke(email: string): Promise<void> {
  await requireAdmin();
  await revokeAccess(email);
  revalidatePath("/app/admin");
}

export async function adminStats() {
  await requireAdmin();
  const [row] = await query<{ total: string; active: string; activated: string }>(
    `SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status = 'active') AS active,
            COUNT(*) FILTER (WHERE activated_at IS NOT NULL) AS activated FROM app_users`,
  );
  return {
    total: Number(row?.total ?? 0),
    active: Number(row?.active ?? 0),
    activated: Number(row?.activated ?? 0),
  };
}
