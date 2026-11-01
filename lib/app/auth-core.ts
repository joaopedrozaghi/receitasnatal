/**
 * Login padrão (conta única, igual para todas as compradoras) — sem banco de dados.
 * Login e senha ficam nas variáveis de ambiente APP_LOGIN e APP_PASSWORD (nunca no código:
 * o repositório é público). A sessão é um cookie assinado com HMAC.
 */
import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_DAYS = 90;

export interface Credentials {
  login: string;
  password: string;
}

/** Credenciais configuradas. Em desenvolvimento há um padrão para testar; em produção é obrigatório configurar. */
export function getCredentials(env: NodeJS.ProcessEnv = process.env): Credentials | null {
  const login = env.APP_LOGIN?.trim();
  const password = env.APP_PASSWORD;
  if (login && password) return { login, password };
  if (env.NODE_ENV !== "production") return { login: "natal", password: "panetone" };
  return null;
}

const norm = (s: string) => s.trim().toLowerCase();

function safeEqual(a: string, b: string): boolean {
  const ha = createHmac("sha256", "cmp").update(a).digest();
  const hb = createHmac("sha256", "cmp").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/** Confere login (sem diferenciar maiúsculas) e senha (exata). */
export function checkCredentials(login: string, password: string, creds: Credentials | null): boolean {
  if (!creds) return false;
  const okLogin = safeEqual(norm(login), norm(creds.login));
  const okPass = safeEqual(password, creds.password);
  return okLogin && okPass;
}

/**
 * Chave de assinatura: APP_SECRET (opcional) + login + senha.
 * Trocar a senha (ex.: na próxima edição) desloga todo mundo automaticamente.
 */
function signingKey(creds: Credentials, env: NodeJS.ProcessEnv = process.env): string {
  return `rr:${env.APP_SECRET ?? ""}:${creds.login}:${creds.password}`;
}

export function signSession(
  creds: Credentials,
  now = Date.now(),
  env: NodeJS.ProcessEnv = process.env,
): string {
  const exp = String(now + SESSION_DAYS * 86_400_000);
  const sig = createHmac("sha256", signingKey(creds, env)).update(`v1.${exp}`).digest("base64url");
  return `v1.${exp}.${sig}`;
}

export function verifySession(
  token: string | undefined,
  creds: Credentials | null,
  now = Date.now(),
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  if (!token || !creds) return false;
  const [v, exp, sig] = token.split(".");
  if (v !== "v1" || !exp || !sig || Number(exp) < now) return false;
  const expected = createHmac("sha256", signingKey(creds, env)).update(`v1.${exp}`).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
