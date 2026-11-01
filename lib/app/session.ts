import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { query, queryOne } from "@/lib/app/db";
import { hmac, newToken } from "@/lib/app/crypto";
import { findUserById, type AppUser } from "@/lib/app/accounts";

export const SESSION_COOKIE = "rr_app_session";
const SESSION_DAYS = 60;

/** Cria a sessão: o cookie guarda um token aleatório; o banco guarda só o hash dele. */
export async function createSession(userId: string): Promise<void> {
  const token = newToken();
  await query(
    `INSERT INTO app_sessions (token_hash, user_id, expires_at) VALUES ($1, $2, now() + make_interval(days => $3::int))`,
    [hmac(token), userId, SESSION_DAYS],
  );
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const row = await queryOne<{ user_id: string }>(
    "SELECT user_id FROM app_sessions WHERE token_hash = $1 AND expires_at > now()",
    [hmac(token)],
  );
  if (!row) return null;
  const user = await findUserById(row.user_id);
  if (!user || user.status !== "active" || !user.activated) return null;
  return user;
}

/** Para páginas internas: sem sessão válida, volta para o login. */
export async function requireUser(): Promise<AppUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/app/entrar");
  return user;
}

export async function requireAdmin(): Promise<AppUser> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/app");
  return user;
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await query("DELETE FROM app_sessions WHERE token_hash = $1", [hmac(token)]);
  jar.delete(SESSION_COOKIE);
}
