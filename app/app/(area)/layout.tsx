import { AppNav } from "@/components/app/AppNav";
import { AuthGate } from "@/components/app/AuthProvider";

/** Área logada: sem conta neste aparelho, vai para /app/entrar. */
export default function AreaLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className="min-h-[100dvh] bg-ivory">
        <AppNav />
        <main
          id="conteudo"
          className="pb-[calc(env(safe-area-inset-bottom)+110px)] motion-safe:animate-fade-in lg:pb-10 lg:pl-64"
        >
          {children}
        </main>
      </div>
    </AuthGate>
  );
}
