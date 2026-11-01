import { createHmac, randomBytes, randomInt, randomUUID, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt) as (
  pw: string,
  salt: Buffer,
  keylen: number,
  opts: object,
) => Promise<Buffer>;
const SCRYPT = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export function appSecret(): string {
  const s = process.env.APP_SECRET;
  if (!s || s.length < 16) {
    if (process.env.NODE_ENV === "production")
      throw new Error("APP_SECRET ausente ou curto (mínimo 16 caracteres)");
    return "dev-only-secret-change-me-please";
  }
  return s;
}

/** Senha: scrypt com sal aleatório. Formato: scrypt$N$sal$hash */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password.normalize("NFKC"), salt, 64, SCRYPT);
  return `scrypt$${SCRYPT.N}$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string | null | undefined): Promise<boolean> {
  if (!stored) return false;
  const [algo, n, saltB64, hashB64] = stored.split("$");
  if (algo !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64url");
  const actual = await scryptAsync(
    password.normalize("NFKC"),
    Buffer.from(saltB64, "base64url"),
    expected.length,
    {
      ...SCRYPT,
      N: Number(n),
    },
  );
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Código numérico de 6 dígitos (sem viés). */
export const generateCode = (): string => String(randomInt(0, 1_000_000)).padStart(6, "0");

/** Hash com segredo do servidor: o banco nunca guarda o código/token em texto puro. */
export const hmac = (value: string): string => createHmac("sha256", appSecret()).update(value).digest("hex");

export const newToken = (): string => randomBytes(32).toString("base64url");
export const newId = (): string => randomUUID();

export function safeEqualHex(a: string, b: string): boolean {
  const ba = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  return ba.length === bb.length && ba.length > 0 && timingSafeEqual(ba, bb);
}

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();
