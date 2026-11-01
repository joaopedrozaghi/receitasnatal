"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { AUTH_EVENT, currentUser, type LocalUser } from "@/lib/app/local-auth";

interface AuthCtx {
  user: LocalUser | null;
  ready: boolean;
}

const Ctx = createContext<AuthCtx>({ user: null, ready: false });

export function useAuth(): AuthCtx {
  return useContext(Ctx);
}

/** Lê a conta logada do aparelho e mantém atualizada (entrar/sair em qualquer aba). */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthCtx>({ user: null, ready: false });
  useEffect(() => {
    const sync = () => setState({ user: currentUser(), ready: true });
    sync();
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

/** Área logada: sem conta neste aparelho, vai para a tela de entrar/criar conta. */
export function AuthGate({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (ready && !user) router.replace(`/app/entrar?next=${encodeURIComponent(pathname)}`);
  }, [ready, user, router, pathname]);

  if (!ready || !user) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-ivory" aria-busy="true">
        <span
          className="h-10 w-10 animate-spin rounded-full border-[3px] border-pine/20 border-t-pine"
          aria-hidden="true"
        />
        <span className="sr-only">Carregando…</span>
      </div>
    );
  }
  return <>{children}</>;
}
