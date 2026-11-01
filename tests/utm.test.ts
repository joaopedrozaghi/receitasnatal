import { describe, expect, it } from "vitest";
import { appendParams, extractUtms } from "@/lib/utm";
import { interpolate } from "@/lib/template";

describe("UTMs para o checkout externo", () => {
  it("extrai só os parâmetros conhecidos", () => {
    expect(extractUtms("?utm_source=ig&utm_campaign=natal&x=1&fbclid=abc")).toEqual({
      utm_source: "ig",
      utm_campaign: "natal",
      fbclid: "abc",
    });
  });
  it("acrescenta sem sobrescrever o que já existe no link", () => {
    const url = appendParams("https://pay.exemplo.com/abc?utm_source=site", {
      utm_source: "ig",
      utm_medium: "story",
    });
    expect(url).toBe("https://pay.exemplo.com/abc?utm_source=site&utm_medium=story");
  });
  it("ignora link vazio ou âncora", () => {
    expect(appendParams("", { utm_source: "ig" })).toBe("");
    expect(appendParams("#oferta", { utm_source: "ig" })).toBe("#oferta");
  });
});

describe("interpolação da copy", () => {
  it("substitui variáveis e mantém as ausentes visíveis", () => {
    expect(interpolate("R$ {{price}} até {{x}}", { price: "37" })).toBe("R$ 37 até {{x}}");
    expect(interpolate("{{a.b}}", { a: { b: 1 } })).toBe("1");
  });
});
