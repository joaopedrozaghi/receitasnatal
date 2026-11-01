/** Captura UTMs/fbclid/ttclid da visita e repassa para o link do checkout externo. */
export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "ttclid",
  "src",
  "sck",
] as const;

const STORAGE_KEY = "rr_utm";
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export function extractUtms(search: string): UtmParams {
  const params = new URLSearchParams(search);
  const out: UtmParams = {};
  for (const key of UTM_KEYS) {
    const v = params.get(key);
    if (v) out[key] = v.slice(0, 200);
  }
  return out;
}

/** Acrescenta os parâmetros ao link sem sobrescrever os que já existem nele. */
export function appendParams(url: string, params: UtmParams): string {
  if (!url || !/^https?:\/\//.test(url)) return url;
  const u = new URL(url);
  for (const [k, v] of Object.entries(params)) {
    if (v && !u.searchParams.has(k)) u.searchParams.set(k, v);
  }
  return u.toString();
}

/** Guarda as UTMs da visita (last-touch, 30 dias) — dado funcional, sem informação pessoal. */
export function rememberUtms(): UtmParams {
  try {
    const current = extractUtms(window.location.search);
    if (Object.keys(current).length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ at: Date.now(), params: current }));
      return current;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as { at: number; params: UtmParams };
      if (Date.now() - saved.at < THIRTY_DAYS) return saved.params;
    }
  } catch {
    /* navegador sem storage (modo privado / in-app): segue sem UTMs salvas */
  }
  return {};
}
