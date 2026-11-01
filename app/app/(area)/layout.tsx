import { AppNav } from "@/components/app/AppNav";
import { requireUser } from "@/lib/app/session";

export const dynamic = "force-dynamic";

/** Área logada: sem sessão válida, vai para /app/entrar. */
export default async function AreaLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return (
    <div className="min-h-[100dvh] bg-ivory">
      <AppNav />
      <div className="pb-[calc(env(safe-area-inset-bottom)+84px)] lg:pb-10 lg:pl-60">{children}</div>
    </div>
  );
}
