import type { Metadata } from "next";
import { logout } from "@/lib/app/actions";
import { Container, PageHeader } from "@/components/app/PageHeader";
import { InstallHint } from "@/components/app/InstallHint";

export const metadata: Metadata = { title: "Minha conta" };

export default function AccountPage() {
  return (
    <>
      <PageHeader
        back="/app/mais"
        title="Minha conta"
        subtitle="Instale o app no celular para abrir com um toque."
      />
      <Container className="grid gap-6 py-6">
        <section className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="text-2xl">Instalar o app</h2>
          <div className="mt-3">
            <InstallHint />
          </div>
        </section>
        <p className="text-sm text-cocoa-muted">
          Favoritos, lista de compras e o progresso nas receitas ficam salvos neste aparelho.
        </p>
        <form action={logout}>
          <button
            type="submit"
            className="min-h-[52px] w-full rounded-full font-bold text-berry ring-1 ring-berry/30 hover:bg-berry-soft"
          >
            Sair do app
          </button>
        </form>
      </Container>
    </>
  );
}
