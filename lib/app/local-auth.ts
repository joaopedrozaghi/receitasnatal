"use client";

/**
 * Contas locais (mesmo modelo do app EducaFit):
 * - As contas ficam NESTE aparelho (localStorage). Não há servidor nem banco.
 * - A senha nunca é guardada: só um hash PBKDF2-SHA256 com sal aleatório.
 * - Criar conta pede o CÓDIGO DE ACESSO da compra (o mesmo para todas as compradoras).
 *   No projeto fica só o SHA-256 do código (site.config.ts > app.accessCodeHashes).
 *   É uma barreira leve, não é segurança forte (o hash do código é público).
 * - Cada conta tem os próprios dados (favoritos, lista, progresso).
 */

const USERS_KEY = "rr:auth:users";
const SESSION_KEY = "rr:auth:session";
const ITERATIONS = 120_000;
export const MIN_PASSWORD = 6;
export const AUTH_EVENT = "rr:auth";

export interface LocalUser {
  id: string;
  name: string;
  email: string;
}

interface StoredUser extends LocalUser {
  salt: string;
  hash: string;
  createdAt: number;
}

export type AuthResult = { ok: true; user: LocalUser } | { ok: false; field?: string; error: string };

function ls(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readUsers(): StoredUser[] {
  try {
    const list = JSON.parse(ls()?.getItem(USERS_KEY) ?? "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeUsers(list: StoredUser[]) {
  ls()?.setItem(USERS_KEY, JSON.stringify(list));
}

const toHex = (buf: ArrayBuffer | Uint8Array) =>
  Array.from(new Uint8Array(buf))
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
const fromHex = (hex: string) => new Uint8Array((hex.match(/.{2}/g) ?? []).map((h) => parseInt(h, 16)));

export const normalizeEmail = (s: string) =>
  String(s || "")
    .trim()
    .toLowerCase();
export const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizeEmail(s));
/** Normaliza o código: sem espaços e em MAIÚSCULAS (maiúsculas/minúsculas não importam). */
export const normalizeCode = (s: string) =>
  String(s || "")
    .replace(/\s+/g, "")
    .toUpperCase();

export function canHash(): boolean {
  return typeof window !== "undefined" && !!window.crypto?.subtle;
}

export async function sha256Hex(text: string): Promise<string> {
  return toHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
}

async function derive(password: string, saltHex: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: fromHex(saltHex), iterations: ITERATIONS },
    key,
    256,
  );
  return toHex(bits);
}

function notify() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

/** Conta logada neste aparelho, ou null. */
export function currentUser(): LocalUser | null {
  const s = ls();
  if (!s) return null;
  let session: { id?: string } | null = null;
  try {
    session = JSON.parse(s.getItem(SESSION_KEY) ?? "null");
  } catch {
    session = null;
  }
  if (!session?.id) return null;
  const u = readUsers().find((x) => x.id === session!.id);
  return u ? { id: u.id, name: u.name, email: u.email } : null;
}

export const hasAccounts = () => readUsers().length > 0;
export const listAccounts = () => readUsers().map((u) => ({ name: u.name, email: u.email }));

function startSession(id: string) {
  ls()?.setItem(SESSION_KEY, JSON.stringify({ id, at: Date.now() }));
  notify();
}

export function signOut() {
  ls()?.removeItem(SESSION_KEY);
  notify();
}

export async function codeIsValid(code: string, codeHashes: readonly string[]): Promise<boolean> {
  const norm = normalizeCode(code);
  if (!norm) return false;
  return codeHashes.includes(await sha256Hex(norm));
}

export async function signUp(
  input: { name: string; email: string; password: string; code: string },
  codeHashes: readonly string[],
): Promise<AuthResult> {
  const name = String(input.name || "")
    .trim()
    .slice(0, 40);
  const email = normalizeEmail(input.email);
  if (!name) return { ok: false, field: "name", error: "Como podemos te chamar?" };
  if (!isValidEmail(email)) return { ok: false, field: "email", error: "Confira o e-mail." };
  if (String(input.password || "").length < MIN_PASSWORD)
    return { ok: false, field: "password", error: `Use pelo menos ${MIN_PASSWORD} caracteres na senha.` };
  if (!(await codeIsValid(input.code, codeHashes)))
    return { ok: false, field: "code", error: "Código inválido. Ele está no e-mail da sua compra." };

  const users = readUsers();
  if (users.some((u) => u.email === email))
    return {
      ok: false,
      field: "email",
      error: "Já existe uma conta com esse e-mail neste aparelho. Entre com sua senha.",
    };

  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
  const hash = await derive(input.password, salt);
  const id = toHex(crypto.getRandomValues(new Uint8Array(6)));
  users.push({ id, name, email, salt, hash, createdAt: Date.now() });
  writeUsers(users);
  startSession(id);
  return { ok: true, user: { id, name, email } };
}

export async function signIn(input: { email: string; password: string }): Promise<AuthResult> {
  const email = normalizeEmail(input.email);
  const u = readUsers().find((x) => x.email === email);
  if (!u)
    return {
      ok: false,
      field: "email",
      error: "Não achamos uma conta com esse e-mail neste aparelho. Toque em “Criar conta”.",
    };
  if ((await derive(String(input.password || ""), u.salt)) !== u.hash)
    return { ok: false, field: "password", error: "Senha incorreta." };
  startSession(u.id);
  return { ok: true, user: { id: u.id, name: u.name, email: u.email } };
}

export async function changePassword(current: string, next: string): Promise<AuthResult> {
  const me = currentUser();
  if (!me) return { ok: false, error: "Entre novamente." };
  if (String(next || "").length < MIN_PASSWORD)
    return { ok: false, field: "next", error: `Use pelo menos ${MIN_PASSWORD} caracteres.` };
  const users = readUsers();
  const u = users.find((x) => x.id === me.id)!;
  if ((await derive(String(current || ""), u.salt)) !== u.hash)
    return { ok: false, field: "current", error: "Senha atual incorreta." };
  u.salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
  u.hash = await derive(String(next), u.salt);
  writeUsers(users);
  return { ok: true, user: me };
}

/** Exclui a conta logada e todos os dados dela neste aparelho (pede a senha). */
export async function deleteAccount(password: string): Promise<AuthResult> {
  const me = currentUser();
  if (!me) return { ok: false, error: "Entre novamente." };
  const users = readUsers();
  const u = users.find((x) => x.id === me.id)!;
  if ((await derive(String(password || ""), u.salt)) !== u.hash)
    return { ok: false, field: "password", error: "Senha incorreta." };
  const s = ls()!;
  const prefix = userPrefix(me.id);
  const keys: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const k = s.key(i);
    if (k?.startsWith(prefix)) keys.push(k);
  }
  keys.forEach((k) => s.removeItem(k));
  writeUsers(users.filter((x) => x.id !== me.id));
  signOut();
  return { ok: true, user: me };
}

/** Prefixo das chaves de dados de uma conta. */
export const userPrefix = (id: string) => `rr:u:${id}:`;
