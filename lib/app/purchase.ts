/**
 * Receptor de compras: entende o aviso (webhook) das plataformas mais comuns
 * e um formato genérico. Função pura (testável); a rota /api/app/compra aplica o resultado.
 */
export type PurchaseAction = "grant" | "revoke" | "ignore";

export interface PurchaseEvent {
  id: string; // para não processar o mesmo aviso duas vezes
  email: string | null;
  name: string | null;
  action: PurchaseAction;
  rawStatus: string;
}

type Json = Record<string, unknown>;
const get = (obj: unknown, path: string): unknown =>
  path
    .split(".")
    .reduce<unknown>((acc, k) => (acc && typeof acc === "object" ? (acc as Json)[k] : undefined), obj);
const str = (v: unknown): string | null =>
  typeof v === "string" && v.trim() ? v.trim() : typeof v === "number" ? String(v) : null;
const first = (obj: unknown, paths: string[]): string | null => {
  for (const p of paths) {
    const v = str(get(obj, p));
    if (v) return v;
  }
  return null;
};

const GRANT =
  /^(approved|paid|aprovad[ao]|pago|complete[d]?|purchase_approved|purchase_complete|order_approved|sale_approved|3|active|ativ[ao])$/i;
const REVOKE =
  /^(refunded|reembolsad[ao]|chargeback|purchase_refunded|purchase_chargeback|purchase_protest|order_refunded|canceled|cancelled|cancelad[ao]|7|revoke[d]?)$/i;

export function parsePurchase(body: unknown): PurchaseEvent {
  const email = first(body, [
    "email",
    "buyer.email",
    "customer.email",
    "Customer.email",
    "data.buyer.email",
    "data.customer.email",
    "cus_email",
    "client_email",
  ]);
  const name = first(body, [
    "name",
    "buyer.name",
    "customer.name",
    "Customer.full_name",
    "data.buyer.name",
    "data.customer.name",
    "cus_name",
    "client_name",
  ]);
  const rawStatus =
    first(body, [
      "status",
      "event",
      "order_status",
      "webhook_event_type",
      "data.purchase.status",
      "trans_status",
    ]) ?? "";
  const id =
    first(body, ["id", "order_id", "transaction", "data.purchase.transaction", "trans_cod", "order_ref"]) ??
    `${email ?? "sem-email"}:${rawStatus}`;
  const action: PurchaseAction = GRANT.test(rawStatus)
    ? "grant"
    : REVOKE.test(rawStatus)
      ? "revoke"
      : "ignore";
  return { id: `${id}:${action}`, email: email ? email.toLowerCase() : null, name, action, rawStatus };
}
