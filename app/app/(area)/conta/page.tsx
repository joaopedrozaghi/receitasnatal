import type { Metadata } from "next";
import { logout } from "@/lib/app/actions";
import { requireUser } from "@/lib/app/session";
import { Container, PageHeader } from "@/components/app/PageHeader";
import { InstallHint } from "@/components/app/InstallHint";
import { ChangePasswordForm } from "@/components/app/Tools";

export const metadata: Metadata = { title: "Minha conta" };

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <>
      <PageHeader back="/app/mais" title="Minha conta" subtitle={user.email} />
      <Container className="grid gap-6 py-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="text-2xl">Instalar o app</h2>
          <div className="mt-3">
            <InstallHint />
          </div>
        </section>
        <section className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="text-2xl">Alterar senha</h2>
          <div className="mt-4">
            <ChangePasswordForm />
          </div>
        </section>
        <form action={logout} className="lg:col-span-2">
          <button
            type="submit"
            className="min-h-[52px] w-full rounded-full font-bold text-berry ring-1 ring-berry/30 hover:bg-berry-soft"
          >
            Sair da conta
          </button>
        </form>
      </Container>
    </>
  );
}
