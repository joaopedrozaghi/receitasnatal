import "server-only";
import { query, queryOne } from "@/lib/app/db";
import {
  generateCode,
  hashPassword,
  hmac,
  newId,
  normalizeEmail,
  safeEqualHex,
  verifyPassword,
} from "@/lib/app/crypto";

export interface AppUser {
  id: string;
  email: string;
  name: string | null;
  status: "active" | "revoked";
  role: "member" | "admin";
  activated: boolean;
}

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  password_hash: string | null;
  status: string;
  role: string;
  activated_at: string | Date | null;
};

const toUser = (r: UserRow): AppUser => ({
  id: r.id,
  email: r.email,
  name: r.name,
  status: r.status === "revoked" ? "revoked" : "active",
  role: r.role === "admin" ? "admin" : "member",
  activated: !!r.activated_at,
});

export const CODE_TTL = {
  /** código enviado no e-mail da compra: a pessoa pode abrir dias depois */
  purchase: 7 * 24 * 60,
  /** código pedido na tela de ativar/esqueci senha */
  request: 30,
};
export const MAX_CODE_ATTEMPTS = 5;
export const MAX_CODES_PER_HOUR = 5;
export const MIN_PASSWORD = 8;

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => normalizeEmail(e))
    .filter(Boolean);
}

export async function findUserByEmail(
  email: string,
): Promise<(AppUser & { passwordHash: string | null }) | null> {
  const r = await queryOne<UserRow>("SELECT * FROM app_users WHERE email = $1", [normalizeEmail(email)]);
  return r ? { ...toUser(r), passwordHash: r.password_hash } : null;
}

export async function findUserById(id: string): Promise<AppUser | null> {
  const r = await queryOne<UserRow>("SELECT * FROM app_users WHERE id = $1", [id]);
  return r ? toUser(r) : null;
}

/** Libera o acesso (compra aprovada ou liberação manual). Idempotente; reativa quem foi revogado. */
export async function grantAccess(
  email: string,
  opts: { name?: string | null; source: string },
): Promise<AppUser> {
  const e = normalizeEmail(email);
  const role = adminEmails().includes(e) ? "admin" : "member";
  const r = await queryOne<UserRow>(
    `INSERT INTO app_users (id, email, name, source, role, status)
     VALUES ($1, $2, $3, $4, $5, 'active')
     ON CONFLICT (email) DO UPDATE SET status = 'active', name = COALESCE(app_users.name, EXCLUDED.name)
     RETURNING *`,
    [newId(), e, opts.name ?? null, opts.source, role],
  );
  return toUser(r as UserRow);
}

/** Reembolso/chargeback: bloqueia o acesso e derruba as sessões. */
export async function revokeAccess(email: string): Promise<boolean> {
  const r = await query<{ id: string }>(
    "UPDATE app_users SET status = 'revoked' WHERE email = $1 RETURNING id",
    [normalizeEmail(email)],
  );
  if (r[0]) await query("DELETE FROM app_sessions WHERE user_id = $1", [r[0].id]);
  return r.length > 0;
}

export type CodePurpose = "activate" | "reset";

/** Gera um código novo (invalida os anteriores do mesmo tipo). Retorna null se passou do limite por hora. */
export async function issueCode(
  email: string,
  purpose: CodePurpose,
  ttlMinutes: number,
): Promise<string | null> {
  const e = normalizeEmail(email);
  const recent = await queryOne<{ n: number | string }>(
    "SELECT COUNT(*) AS n FROM app_codes WHERE email = $1 AND created_at > now() - interval '1 hour'",
    [e],
  );
  if (Number(recent?.n ?? 0) >= MAX_CODES_PER_HOUR) return null;
  await query("UPDATE app_codes SET used_at = now() WHERE email = $1 AND purpose = $2 AND used_at IS NULL", [
    e,
    purpose,
  ]);
  const code = generateCode();
  await query(
    `INSERT INTO app_codes (id, email, purpose, code_hash, expires_at)
     VALUES ($1, $2, $3, $4, now() + make_interval(mins => $5::int))`,
    [newId(), e, purpose, hmac(`${e}:${purpose}:${code}`), ttlMinutes],
  );
  return code;
}

export type CodeCheck = "ok" | "invalid" | "expired" | "too_many_attempts";

/** Confere o código (uso único, limite de tentativas, validade). */
export async function consumeCode(email: string, purpose: CodePurpose, code: string): Promise<CodeCheck> {
  const e = normalizeEmail(email);
  const row = await queryOne<{ id: string; code_hash: string; attempts: number; expired: boolean }>(
    `SELECT id, code_hash, attempts, (expires_at < now()) AS expired FROM app_codes
     WHERE email = $1 AND purpose = $2 AND used_at IS NULL ORDER BY created_at DESC LIMIT 1`,
    [e, purpose],
  );
  if (!row) return "invalid";
  if (row.attempts >= MAX_CODE_ATTEMPTS) return "too_many_attempts";
  if (row.expired) return "expired";
  const clean = code.replace(/\D/g, "");
  if (!safeEqualHex(row.code_hash, hmac(`${e}:${purpose}:${clean}`))) {
    await query("UPDATE app_codes SET attempts = attempts + 1 WHERE id = $1", [row.id]);
    return row.attempts + 1 >= MAX_CODE_ATTEMPTS ? "too_many_attempts" : "invalid";
  }
  await query("UPDATE app_codes SET used_at = now() WHERE id = $1", [row.id]);
  return "ok";
}

export async function setPassword(userId: string, password: string, name?: string | null): Promise<void> {
  await query(
    `UPDATE app_users SET password_hash = $2, activated_at = COALESCE(activated_at, now()),
       name = COALESCE($3, name) WHERE id = $1`,
    [userId, await hashPassword(password), name?.trim() || null],
  );
  // troca de senha derruba as outras sessões
  await query("DELETE FROM app_sessions WHERE user_id = $1", [userId]);
}

/** Login: e-mail + senha. Tempo constante mesmo quando o e-mail não existe. */
export async function checkCredentials(email: string, password: string): Promise<AppUser | null> {
  const user = await findUserByEmail(email);
  const ok = await verifyPassword(
    password,
    user?.passwordHash ??
      "scrypt$16384$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  );
  if (!user || !ok || user.status !== "active" || !user.activated) return null;
  return user;
}

export async function listUsers(limit = 200) {
  return query<{
    email: string;
    name: string | null;
    status: string;
    source: string | null;
    granted_at: string;
    activated_at: string | null;
  }>(
    "SELECT email, name, status, source, granted_at, activated_at FROM app_users ORDER BY granted_at DESC LIMIT $1",
    [limit],
  );
}
