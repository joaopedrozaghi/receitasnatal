import { NextResponse, type NextRequest } from "next/server";
import { CODE_TTL, grantAccess, issueCode, revokeAccess } from "@/lib/app/accounts";
import { safeEqualHex, hmac } from "@/lib/app/crypto";
import { query } from "@/lib/app/db";
import { activationEmail, sendEmail } from "@/lib/app/email";
import { parsePurchase } from "@/lib/app/purchase";

export const dynamic = "force-dynamic";

/**
 * Aviso de compra (webhook). Configure na plataforma de checkout a URL:
 *   https://SEU-DOMINIO/api/app/compra?token=APP_WEBHOOK_TOKEN
 * (ou envie o token no header "x-webhook-token").
 * Compra aprovada → libera acesso e envia o código por e-mail. Reembolso/chargeback → bloqueia.
 */
function authorized(req: NextRequest): boolean {
  const expected = process.env.APP_WEBHOOK_TOKEN;
  if (!expected) return false;
  const got = req.nextUrl.searchParams.get("token") ?? req.headers.get("x-webhook-token") ?? "";
  return safeEqualHex(hmac(got), hmac(expected));
}

async function readBody(req: NextRequest): Promise<unknown> {
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("application/json")) return req.json();
  const form = await req.formData();
  return Object.fromEntries(form.entries());
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await readBody(req);
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const event = parsePurchase(body);
  if (!event.email || event.action === "ignore") {
    return NextResponse.json({ ok: true, ignored: true, status: event.rawStatus });
  }

  const fresh = await query(
    "INSERT INTO app_purchase_events (id, email, status) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING RETURNING id",
    [event.id.slice(0, 200), event.email, event.action],
  );
  if (!fresh.length) return NextResponse.json({ ok: true, duplicate: true });

  if (event.action === "revoke") {
    await revokeAccess(event.email);
    return NextResponse.json({ ok: true, revoked: true });
  }

  const user = await grantAccess(event.email, { name: event.name, source: "compra" });
  if (!user.activated) {
    const code = await issueCode(user.email, "activate", CODE_TTL.purchase);
    if (code) await sendEmail(activationEmail(user.email, code, event.name));
  }
  return NextResponse.json({ ok: true, granted: true });
}
