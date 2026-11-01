import "server-only";

/**
 * Banco de dados do app.
 * - Produção: Postgres (Neon / Vercel Postgres) via DATABASE_URL.
 * - Desenvolvimento e testes: PGlite (Postgres embutido) gravado em .data/pglite.
 * Em produção SEM DATABASE_URL o app recusa iniciar (evita perder contas num banco temporário).
 */
export type Row = Record<string, unknown>;
type Runner = (text: string, params?: unknown[]) => Promise<Row[]>;

/**
 * Conexão única por processo. Fica em globalThis porque o Next (em desenvolvimento) pode carregar
 * este módulo mais de uma vez; duas cópias do banco local não enxergariam as gravações uma da outra.
 */
const g = globalThis as unknown as {
  __rrDb?: { runner: Promise<Runner> | null; schema: Promise<void> | null };
};
const state = (g.__rrDb ??= { runner: null, schema: null });

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL não configurada. Veja README > App > Banco de dados.");
  }
}

export function isDatabaseConfigured(): boolean {
  return (
    !!process.env.DATABASE_URL ||
    process.env.NODE_ENV !== "production" ||
    process.env.APP_ALLOW_PGLITE === "1"
  );
}

async function createRunner(): Promise<Runner> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(url);
    return async (text, params = []) => (await sql.query(text, params)) as Row[];
  }
  if (!isDatabaseConfigured()) throw new DatabaseNotConfiguredError();
  const { PGlite } = await import("@electric-sql/pglite");
  const dataDir = process.env.PGLITE_DIR ?? (process.env.VITEST ? "memory://" : "./.data/pglite");
  if (!dataDir.startsWith("memory://")) {
    const { mkdirSync } = await import("fs");
    mkdirSync(dataDir, { recursive: true });
  }
  const db = new PGlite(dataDir);
  await db.waitReady;
  return async (text, params = []) => (await db.query<Row>(text, params)).rows;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS app_users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT,
  password_hash TEXT,
  status        TEXT NOT NULL DEFAULT 'active',
  role          TEXT NOT NULL DEFAULT 'member',
  source        TEXT,
  granted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  activated_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS app_codes (
  id          TEXT PRIMARY KEY,
  email       TEXT NOT NULL,
  purpose     TEXT NOT NULL,
  code_hash   TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  attempts    INTEGER NOT NULL DEFAULT 0,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS app_codes_email_idx ON app_codes (email, purpose, created_at);
CREATE TABLE IF NOT EXISTS app_sessions (
  token_hash  TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS app_favorites (
  user_id     TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  recipe_slug TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, recipe_slug)
);
CREATE TABLE IF NOT EXISTS app_shopping (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  qty         DOUBLE PRECISION,
  unit        TEXT,
  recipe_slug TEXT,
  checked     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS app_shopping_user_idx ON app_shopping (user_id);
CREATE TABLE IF NOT EXISTS app_progress (
  user_id     TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  recipe_slug TEXT NOT NULL,
  step        INTEGER NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, recipe_slug)
);
CREATE TABLE IF NOT EXISTS app_purchase_events (
  id          TEXT PRIMARY KEY,
  email       TEXT,
  status      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

async function runner(): Promise<Runner> {
  if (!state.runner) state.runner = createRunner();
  try {
    return await state.runner;
  } catch (e) {
    state.runner = null;
    throw e;
  }
}

async function ensureSchema(run: Runner) {
  if (!state.schema) {
    state.schema = (async () => {
      for (const stmt of SCHEMA.split(";")
        .map((s) => s.trim())
        .filter(Boolean))
        await run(stmt);
    })();
  }
  try {
    await state.schema;
  } catch (e) {
    state.schema = null;
    throw e;
  }
}

/** Executa SQL com parâmetros ($1, $2…). Sempre use parâmetros: nunca concatene dados do usuário. */
export async function query<T extends Row = Row>(text: string, params: unknown[] = []): Promise<T[]> {
  const run = await runner();
  await ensureSchema(run);
  return (await run(text, params)) as T[];
}

export async function queryOne<T extends Row = Row>(text: string, params: unknown[] = []): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
