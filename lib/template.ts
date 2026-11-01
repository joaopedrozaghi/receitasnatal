/** Substitui {{chave}} e {{a.b}} por valores. Chaves ausentes ficam intactas (fácil de achar na revisão). */
export function interpolate(text: string, vars: Record<string, unknown>): string {
  return text.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, key: string) => {
    const value = key.split(".").reduce<unknown>((acc, k) => {
      if (acc && typeof acc === "object" && k in (acc as Record<string, unknown>)) {
        return (acc as Record<string, unknown>)[k];
      }
      return undefined;
    }, vars);
    return value === undefined || value === null ? match : String(value);
  });
}
