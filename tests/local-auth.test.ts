import { beforeEach, describe, expect, it } from "vitest";
import { createHash } from "crypto";
import { siteConfig } from "@/config/site.config";

// localStorage simples para rodar no Node
class MemStorage {
  private m = new Map<string, string>();
  get length() {
    return this.m.size;
  }
  key(i: number) {
    return [...this.m.keys()][i] ?? null;
  }
  getItem(k: string) {
    return this.m.has(k) ? this.m.get(k)! : null;
  }
  setItem(k: string, v: string) {
    this.m.set(k, String(v));
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
  clear() {
    this.m.clear();
  }
}
const storage = new MemStorage();
const g = globalThis as unknown as { window: unknown };
g.window = Object.assign(globalThis, { localStorage: storage, dispatchEvent: () => true });

const auth = await import("@/lib/app/local-auth");
const CODE = "TESTE123";
const hashes = [createHash("sha256").update(CODE).digest("hex")];

describe("contas no aparelho com código de acesso", () => {
  beforeEach(() => storage.clear());

  it("o código padrão da config confere (NATAL2026)", async () => {
    expect(await auth.codeIsValid(" natal2026 ", siteConfig.app.accessCodeHashes)).toBe(true);
    expect(await auth.codeIsValid("errado", siteConfig.app.accessCodeHashes)).toBe(false);
  });

  it("criar conta exige código válido e não guarda a senha em texto", async () => {
    const bad = await auth.signUp(
      { name: "Ana", email: "ana@x.com", password: "123456", code: "NADA" },
      hashes,
    );
    expect(bad).toMatchObject({ ok: false, field: "code" });
    const ok = await auth.signUp(
      { name: "Ana", email: "Ana@X.com", password: "123456", code: "teste123" },
      hashes,
    );
    expect(ok.ok).toBe(true);
    expect(auth.currentUser()?.email).toBe("ana@x.com");
    expect(
      JSON.stringify([...Array(storage.length)].map((_, i) => storage.getItem(storage.key(i)!))),
    ).not.toContain("123456");
  });

  it("entrar, senha errada, e-mail duplicado e sair", async () => {
    await auth.signUp({ name: "Ana", email: "ana@x.com", password: "segredo", code: CODE }, hashes);
    auth.signOut();
    expect(auth.currentUser()).toBeNull();
    expect(await auth.signIn({ email: "ana@x.com", password: "errada" })).toMatchObject({
      ok: false,
      field: "password",
    });
    expect(await auth.signIn({ email: "outra@x.com", password: "segredo" })).toMatchObject({
      ok: false,
      field: "email",
    });
    expect((await auth.signIn({ email: "ANA@x.com", password: "segredo" })).ok).toBe(true);
    const dup = await auth.signUp(
      { name: "Ana 2", email: "ana@x.com", password: "outra1", code: CODE },
      hashes,
    );
    expect(dup).toMatchObject({ ok: false, field: "email" });
  });

  it("trocar senha e excluir conta apaga os dados dela", async () => {
    const res = await auth.signUp(
      { name: "Bia", email: "bia@x.com", password: "antiga1", code: CODE },
      hashes,
    );
    if (!res.ok) throw new Error("falhou");
    storage.setItem(`${auth.userPrefix(res.user.id)}favoritos`, '["chocotone"]');
    expect((await auth.changePassword("errada", "nova123")).ok).toBe(false);
    expect((await auth.changePassword("antiga1", "nova123")).ok).toBe(true);
    auth.signOut();
    expect((await auth.signIn({ email: "bia@x.com", password: "nova123" })).ok).toBe(true);
    expect((await auth.deleteAccount("nova123")).ok).toBe(true);
    expect(storage.getItem(`${auth.userPrefix(res.user.id)}favoritos`)).toBeNull();
    expect(auth.hasAccounts()).toBe(false);
  });
});
