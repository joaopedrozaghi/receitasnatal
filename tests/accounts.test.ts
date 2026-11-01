import { describe, expect, it } from "vitest";
import {
  checkCredentials,
  consumeCode,
  findUserByEmail,
  grantAccess,
  issueCode,
  revokeAccess,
  setPassword,
} from "@/lib/app/accounts";

describe("conta: liberar → código → senha → login (banco PGlite em memória)", () => {
  it("fluxo completo", async () => {
    const user = await grantAccess("Maria@Exemplo.com", { name: "Maria", source: "teste" });
    expect(user.email).toBe("maria@exemplo.com");
    expect(user.activated).toBe(false);

    const code = await issueCode("maria@exemplo.com", "activate", 30);
    expect(code).toMatch(/^\d{6}$/);
    expect(await consumeCode("maria@exemplo.com", "activate", "000000" === code ? "111111" : "000000")).toBe(
      "invalid",
    );
    expect(await consumeCode("maria@exemplo.com", "activate", code!)).toBe("ok");
    expect(await consumeCode("maria@exemplo.com", "activate", code!)).toBe("invalid"); // uso único

    await setPassword(user.id, "senha-forte-123", "Maria");
    expect((await checkCredentials("maria@exemplo.com", "senha-forte-123"))?.email).toBe("maria@exemplo.com");
    expect(await checkCredentials("maria@exemplo.com", "errada")).toBeNull();

    await revokeAccess("maria@exemplo.com");
    expect(await checkCredentials("maria@exemplo.com", "senha-forte-123")).toBeNull();
    expect((await findUserByEmail("maria@exemplo.com"))?.status).toBe("revoked");
  });

  it("bloqueia depois de 5 tentativas erradas", async () => {
    await grantAccess("joao@exemplo.com", { source: "teste" });
    const code = await issueCode("joao@exemplo.com", "activate", 30);
    const wrong = code === "123456" ? "654321" : "123456";
    for (let i = 0; i < 4; i++)
      expect(await consumeCode("joao@exemplo.com", "activate", wrong)).toBe("invalid");
    expect(await consumeCode("joao@exemplo.com", "activate", wrong)).toBe("too_many_attempts");
    expect(await consumeCode("joao@exemplo.com", "activate", code!)).toBe("too_many_attempts");
  });

  it("limita envio de códigos por hora", async () => {
    await grantAccess("lu@exemplo.com", { source: "teste" });
    for (let i = 0; i < 5; i++) expect(await issueCode("lu@exemplo.com", "activate", 30)).not.toBeNull();
    expect(await issueCode("lu@exemplo.com", "activate", 30)).toBeNull();
  });
});
