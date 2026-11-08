import { beforeEach, describe, expect, it } from "vitest";

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

describe("entrada sem cadastro", () => {
  beforeEach(() => storage.clear());

  it("começa fora do app e entra com um toque", () => {
    expect(auth.currentUser()).toBeNull();
    const me = auth.enter();
    expect(auth.currentUser()?.id).toBe(me.id);
  });

  it("sair volta para a entrada, mas os dados continuam no aparelho", () => {
    const me = auth.enter();
    storage.setItem(`${auth.userPrefix(me.id)}favoritos`, '["chocotone"]');
    auth.signOut();
    expect(auth.currentUser()).toBeNull();
    const again = auth.enter();
    expect(again.id).toBe(me.id);
    expect(storage.getItem(`${auth.userPrefix(me.id)}favoritos`)).toBe('["chocotone"]');
  });

  it("quem tinha conta na versão anterior mantém os dados", () => {
    storage.setItem("rr:auth:users", JSON.stringify([{ id: "antiga1", name: "Ana", email: "ana@x.com" }]));
    storage.setItem("rr:u:antiga1:lista", "[1]");
    const me = auth.enter();
    expect(me.id).toBe("antiga1");
    expect(me.name).toBe("Ana");
  });

  it("apagar dados remove favoritos, lista e progresso deste aparelho", () => {
    const me = auth.enter();
    storage.setItem(`${auth.userPrefix(me.id)}favoritos`, "[]");
    storage.setItem(`${auth.userPrefix(me.id)}lista`, "[]");
    auth.clearData();
    expect(storage.getItem(`${auth.userPrefix(me.id)}favoritos`)).toBeNull();
    expect(storage.getItem(`${auth.userPrefix(me.id)}lista`)).toBeNull();
    expect(auth.currentUser()).not.toBeNull();
  });
});
