import { describe, expect, it } from "vitest";
import { formatCountdown, formatDeadline, getCountdown } from "@/lib/countdown";

describe("contagem regressiva", () => {
  const end = Date.parse("2026-11-15T23:59:00-03:00");
  it("calcula dias, horas, minutos e segundos", () => {
    const p = getCountdown(end, Date.parse("2026-11-14T22:58:30-03:00"));
    expect(p).toMatchObject({ days: 1, hours: 1, minutes: 0, seconds: 30, expired: false });
    expect(formatCountdown(p)).toBe("1d 01h 00m 30s");
  });
  it("nunca fica negativa e não reinicia", () => {
    const p = getCountdown(end, end + 5000);
    expect(p.totalMs).toBe(0);
    expect(p.expired).toBe(true);
    expect(formatCountdown(p)).toBe("0d 00h 00m 00s");
  });
  it("formata o prazo no fuso de São Paulo", () => {
    expect(formatDeadline("2026-11-15T23:59:00-03:00", "America/Sao_Paulo")).toBe("15/11 às 23h59");
  });
});
