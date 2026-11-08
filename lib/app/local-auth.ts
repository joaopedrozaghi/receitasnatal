"use client";

/**
 * Entrada no app sem cadastro: um toque em "Entrar" abre o app e o aparelho lembra.
 * Não há e-mail, senha nem código. Os dados (favoritos, lista, progresso) ficam no
 * próprio aparelho (localStorage), separados por um id local.
 *
 * Quem criou conta na versão anterior (com e-mail e senha) continua com os mesmos dados:
 * ao entrar, o app reaproveita o id dessa conta.
 */

const USERS_KEY = "rr:auth:users"; // contas da versão anterior (só lidas, para manter os dados)
const SESSION_KEY = "rr:auth:session";
const LOCAL_ID = "aparelho";
export const AUTH_EVENT = "rr:auth";

export interface LocalUser {
  id: string;
  name: string;
}

function ls(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function legacyUsers(): { id: string; name: string }[] {
  try {
    const list = JSON.parse(ls()?.getItem(USERS_KEY) ?? "[]");
    return Array.isArray(list) ? list.filter((u) => typeof u?.id === "string") : [];
  } catch {
    return [];
  }
}

function notify() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

function readSession(): { id?: string } | null {
  try {
    return JSON.parse(ls()?.getItem(SESSION_KEY) ?? "null");
  } catch {
    return null;
  }
}

/** Quem está usando o app neste aparelho, ou null se ainda não entrou. */
export function currentUser(): LocalUser | null {
  const id = readSession()?.id;
  if (!id) return null;
  const old = legacyUsers().find((u) => u.id === id);
  return { id, name: old?.name?.trim() ?? "" };
}

/** Entra no app. Reaproveita a conta antiga deste aparelho, se houver. */
export function enter(): LocalUser {
  const s = ls();
  const id = readSession()?.id ?? legacyUsers()[0]?.id ?? LOCAL_ID;
  s?.setItem(SESSION_KEY, JSON.stringify({ id, at: Date.now() }));
  notify();
  return currentUser() ?? { id, name: "" };
}

/** Volta para a tela de entrada. Os dados continuam no aparelho. */
export function signOut() {
  ls()?.removeItem(SESSION_KEY);
  notify();
}

/** Apaga favoritos, lista e progresso deste aparelho. */
export function clearData() {
  const me = currentUser();
  const s = ls();
  if (!me || !s) return;
  const prefix = userPrefix(me.id);
  const keys: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const k = s.key(i);
    if (k?.startsWith(prefix)) keys.push(k);
  }
  keys.forEach((k) => s.removeItem(k));
  notify();
}

/** Prefixo das chaves de dados de quem está usando o app. */
export const userPrefix = (id: string) => `rr:u:${id}:`;
