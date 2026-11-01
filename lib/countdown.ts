export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  expired: boolean;
}

/** Tempo restante até `endsAt`. Nunca negativo e nunca "reinicia". */
export function getCountdown(endsAt: number, now: number): CountdownParts {
  const totalMs = Math.max(0, endsAt - now);
  const totalSeconds = Math.floor(totalMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalMs,
    expired: totalMs === 0,
  };
}

export const pad2 = (n: number): string => String(n).padStart(2, "0");

export function formatCountdown(p: CountdownParts): string {
  return `${p.days}d ${pad2(p.hours)}h ${pad2(p.minutes)}m ${pad2(p.seconds)}s`;
}

/** "15/11 às 23h59" no fuso informado. */
export function formatDeadline(iso: string | number, timeZone: string): string {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", timeZone }).format(d);
  const time = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone })
    .format(d)
    .replace(":", "h");
  return `${date} às ${time}`;
}
