/** Consentimento de cookies (LGPD). Guardado num cookie próprio, sem dados pessoais. */
export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  at: string;
  v: 1;
}

export const CONSENT_COOKIE = "rr_consent";
export const CONSENT_EVENT = "rr:consent";
export const OPEN_PREFERENCES_EVENT = "rr:cookie-preferences";

export function readConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`))
    ?.split("=")[1];
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as ConsentState;
    return parsed.v === 1 ? parsed : null;
  } catch {
    return null;
  }
}

export function writeConsent(choice: { analytics: boolean; marketing: boolean }): ConsentState {
  const state: ConsentState = { ...choice, at: new Date().toISOString(), v: 1 };
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(state))}; Max-Age=${60 * 60 * 24 * 180}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
  return state;
}
