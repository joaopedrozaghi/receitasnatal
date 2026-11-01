import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_DAYS, getCredentials, signSession, verifySession } from "@/lib/app/auth-core";

export const SESSION_COOKIE = "rr_app_session";

export function isAuthConfigured(): boolean {
  return getCredentials() !== null;
}

export async function createSession(): Promise<void> {
  const creds = getCredentials();
  if (!creds) return;
  const jar = await cookies();
  jar.set(SESSION_COOKIE, signSession(creds), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
}

export async function isLoggedIn(): Promise<boolean> {
  const jar = await cookies();
  return verifySession(jar.get(SESSION_COOKIE)?.value, getCredentials());
}

/** Páginas internas: sem sessão válida, volta para o login. */
export async function requireUser(): Promise<void> {
  if (!(await isLoggedIn())) redirect("/app/entrar");
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
