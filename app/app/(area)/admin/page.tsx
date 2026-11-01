import type { Metadata } from "next";
import { adminRevoke, adminStats } from "@/lib/app/actions";
import { listUsers } from "@/lib/app/accounts";
import { requireAdmin } from "@/lib/app/session";
import { Container, PageHeader } from "@/components/app/PageHeader";
import { AdminGrantForm } from "@/components/app/Tools";

export const metadata: Metadata = { title: "Admin" };

const fmt = (d: string | Date | null) =>
  d
    ? new Date(d).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "America/Sao_Paulo",
      })
    : "—";

export default async function AdminPage() {
  await requireAdmin();
  const [stats, users] = await Promise.all([adminStats(), listUsers(300)]);
  return (
    <>
      <PageHeader
        back="/app/mais"
        title="Admin"
        subtitle="Libere acessos manualmente e acompanhe as compradoras."
      />
      <Container className="space-y-6 py-6">
        <ul className="grid grid-cols-3 gap-3">
          {(
            [
              ["Liberados", stats.total],
              ["Com acesso ativo", stats.active],
              ["Já ativaram", stats.activated],
            ] as const
          ).map(([label, value]) => (
            <li key={label} className="rounded-2xl bg-white p-4 text-center shadow-soft">
              <p className="font-display text-3xl text-pine">{value}</p>
              <p className="text-xs text-cocoa-muted">{label}</p>
            </li>
          ))}
        </ul>
        <section className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="text-2xl">Liberar acesso</h2>
          <p className="mt-1 text-sm text-cocoa-muted">
            Use quando a compra não chegou pelo aviso automático (ou para dar acesso de cortesia).
          </p>
          <div className="mt-4">
            <AdminGrantForm />
          </div>
        </section>
        <section className="overflow-x-auto rounded-3xl bg-white p-2 shadow-soft">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-cocoa-muted">
              <tr>
                <th className="p-3">E-mail</th>
                <th className="p-3">Origem</th>
                <th className="p-3">Liberado</th>
                <th className="p-3">Ativou</th>
                <th className="p-3">Status</th>
                <th className="p-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email} className="border-t border-cocoa/10">
                  <td className="p-3 font-medium text-cocoa">
                    {u.email}
                    {u.name ? <span className="block text-xs text-cocoa-muted">{u.name}</span> : null}
                  </td>
                  <td className="p-3">{u.source ?? "—"}</td>
                  <td className="p-3">{fmt(u.granted_at)}</td>
                  <td className="p-3">{fmt(u.activated_at)}</td>
                  <td className="p-3">{u.status === "active" ? "Ativo" : "Bloqueado"}</td>
                  <td className="p-3">
                    {u.status === "active" ? (
                      <form action={adminRevoke.bind(null, u.email)}>
                        <button type="submit" className="text-xs font-semibold text-berry underline">
                          Bloquear
                        </button>
                      </form>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </Container>
    </>
  );
}
