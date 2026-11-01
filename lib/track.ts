/**
 * Eventos para os pixels. Só dispara se o pixel foi carregado (ou seja, após o consentimento).
 * Cada evento leva um event_id único (deduplicação com a Conversions API da plataforma de checkout).
 */
type Fbq = (cmd: string, name: string, params?: Record<string, unknown>, opts?: { eventID: string }) => void;
type Gtag = (cmd: string, name: string, params?: Record<string, unknown>) => void;
interface Ttq {
  track: (name: string, params?: Record<string, unknown>, opts?: { event_id: string }) => void;
}

declare global {
  interface Window {
    fbq?: Fbq;
    gtag?: Gtag;
    ttq?: Ttq;
  }
}

export type TrackEvent = "ViewContent" | "InitiateCheckout" | "OrderBumpSelected";

const GA_NAME: Record<TrackEvent, string> = {
  ViewContent: "view_item",
  InitiateCheckout: "begin_checkout",
  OrderBumpSelected: "order_bump_selected",
};
const TT_NAME: Record<TrackEvent, string> = {
  ViewContent: "ViewContent",
  InitiateCheckout: "InitiateCheckout",
  OrderBumpSelected: "AddToCart",
};

export function newEventId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function track(name: TrackEvent, params: { value?: number; currency?: "BRL" } = {}): string {
  const eventId = newEventId();
  if (typeof window === "undefined") return eventId;
  const p = { ...params, currency: params.value ? "BRL" : undefined, content_name: "Especial de Natal" };
  try {
    if (window.fbq) {
      if (name === "OrderBumpSelected") window.fbq("trackCustom", name, p, { eventID: eventId });
      else window.fbq("track", name, p, { eventID: eventId });
    }
    window.gtag?.("event", GA_NAME[name], { ...p, event_id: eventId });
    window.ttq?.track(TT_NAME[name], p, { event_id: eventId });
  } catch {
    /* nunca quebrar a página por causa de rastreamento */
  }
  return eventId;
}
