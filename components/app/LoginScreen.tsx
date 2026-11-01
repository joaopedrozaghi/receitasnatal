"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type InputHTMLAttributes } from "react";
import { canHash, hasAccounts, listAccounts, MIN_PASSWORD, signIn, signUp } from "@/lib/app/local-auth";
import { useAuth } from "@/components/app/AuthProvider";
import { Icon } from "@/components/ui/Icon";

type Mode = "login" | "signup";

function FloatField({
  label,
  bad,
  right,
  ...props
}: { label: string; bad?: boolean; right?: React.ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div
      className={`group relative rounded-2xl bg-white ring-1 transition focus-within:ring-2 ${
        bad ? "ring-berry focus-within:ring-berry" : "ring-cocoa/10 focus-within:ring-pine"
      }`}
    >
      <input
        {...props}
        id={props.name}
        placeholder=" "
        className="peer block h-[60px] w-full rounded-2xl bg-transparent px-4 pb-2 pt-6 text-[16px] text-cocoa outline-none"
      />
      <label
        htmlFor={props.name}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-cocoa-muted transition-all peer-focus:top-[18px] peer-focus:text-[11px] peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-[18px] peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold"
      >
        {label}
      </label>
      {right ? <div className="absolute right-2 top-1/2 -translate-y-1/2">{right}</div> : null}
    </div>
  );
}

export function LoginScreen({
  codeHashes,
  supportEmail,
  next,
}: {
  codeHashes: string[];
  supportEmail: string;
  next?: string;
}) {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [mode, setMode] = useState<Mode>("signup");
  const [accounts, setAccounts] = useState<{ name: string; email: string }[]>([]);
  const [email, setEmail] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<{ msg: string; field?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [secure, setSecure] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  const go = () =>
    router.replace(next?.startsWith("/app") && !next.startsWith("/app/entrar") ? next : "/app");

  useEffect(() => {
    setSecure(canHash());
    setMode(hasAccounts() ? "login" : "signup");
    setAccounts(listAccounts());
  }, []);

  useEffect(() => {
    if (ready && user) go();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, user]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      password: String(fd.get("password") ?? ""),
      code: String(fd.get("code") ?? ""),
    };
    setBusy(true);
    setError(null);
    try {
      const res = mode === "login" ? await signIn(data) : await signUp(data, codeHashes);
      if (!res.ok) {
        setError({ msg: res.error, field: res.field });
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
          formRef.current?.animate(
            [0, -6, 6, -6, 6, 0].map((x) => ({ transform: `translateX(${x}px)` })),
            { duration: 350 },
          );
        formRef.current?.querySelector<HTMLInputElement>(`[name="${res.field}"]`)?.focus();
        return;
      }
      go();
    } catch {
      setError({ msg: "Algo deu errado. Tente de novo." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-pine-deep">
      {/* foto de fundo */}
      <div className="absolute inset-x-0 top-0 h-[42dvh] lg:inset-y-0 lg:left-0 lg:right-auto lg:h-auto lg:w-1/2">
        <Image
          src="/images/receitas/panetones-trufados.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pine-deep/30 via-pine-deep/40 to-pine-deep lg:bg-gradient-to-r lg:from-transparent lg:via-pine-deep/30 lg:to-pine-deep" />
        <div className="absolute inset-x-6 bottom-16 hidden text-snow lg:block">
          <p className="font-display text-5xl leading-tight">
            Massa boa não tem pressa. <em className="text-gold-light">Mas tem método.</em>
          </p>
          <p className="mt-4 font-script text-4xl text-gold-light">Roseli Monteiro</p>
        </div>
      </div>

      <main
        id="conteudo"
        className="relative flex min-h-[100dvh] flex-col items-center justify-end px-4 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-[22dvh] lg:ml-[50%] lg:justify-center lg:pt-10"
      >
        <div className="mb-5 flex items-center gap-2.5 text-snow lg:mb-8">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-gold-light ring-1 ring-white/20 backdrop-blur">
            <Icon name="panettone" className="h-6 w-6" strokeWidth={1.8} />
          </span>
          <span className="font-display text-2xl">
            Receitinhas <span className="italic text-gold">da Rô</span>
          </span>
        </div>

        <div className="w-full max-w-md rounded-[2rem] bg-ivory/95 p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/30 backdrop-blur-xl sm:p-7">
          {!secure ? (
            <p className="p-2 text-center text-cocoa">
              Para entrar, abra o app pelo endereço seguro que começa com https://
            </p>
          ) : (
            <>
              {/* abas */}
              <div
                role="tablist"
                aria-label="Entrar ou criar conta"
                className="relative grid grid-cols-2 rounded-full bg-cocoa/[0.06] p-1"
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-white shadow-soft transition-transform duration-300 ease-out ${
                    mode === "signup" ? "translate-x-[calc(100%+0px)]" : "translate-x-0"
                  }`}
                  style={{ left: 4 }}
                />
                {(["login", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="tab"
                    aria-selected={mode === m}
                    onClick={() => switchMode(m)}
                    className={`relative z-10 min-h-[44px] rounded-full text-sm font-bold transition ${
                      mode === m ? "text-cocoa" : "text-cocoa-muted"
                    }`}
                  >
                    {m === "login" ? "Entrar" : "Criar conta"}
                  </button>
                ))}
              </div>

              <h1 className="mt-6 text-[1.9rem] leading-tight">
                {mode === "login" ? "Que bom te ver de novo" : "Crie sua conta"}
              </h1>
              <p className="mt-1 text-[15px] text-cocoa-muted">
                {mode === "login"
                  ? "Entre para continuar de onde parou."
                  : "Use o código de acesso que chegou no e-mail da sua compra."}
              </p>

              {mode === "login" && accounts.length ? (
                <ul className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  {accounts.map((a) => (
                    <li key={a.email}>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail(a.email);
                          formRef.current?.querySelector<HTMLInputElement>('[name="password"]')?.focus();
                        }}
                        className={`flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 text-left ring-1 transition ${
                          email === a.email
                            ? "bg-pine text-white ring-pine"
                            : "bg-white text-cocoa ring-cocoa/10"
                        }`}
                      >
                        <span
                          className={`grid h-9 w-9 place-items-center rounded-full font-bold ${email === a.email ? "bg-white/15" : "bg-gold-light/60 text-gold-text"}`}
                        >
                          {a.name.trim().charAt(0).toUpperCase()}
                        </span>
                        <span className="text-sm font-semibold">{a.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              <form ref={formRef} key={mode} onSubmit={submit} noValidate className="mt-5 space-y-3">
                {mode === "signup" ? (
                  <FloatField
                    label="Seu nome"
                    name="name"
                    autoComplete="given-name"
                    maxLength={40}
                    bad={error?.field === "name"}
                  />
                ) : null}
                <FloatField
                  label="E-mail"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bad={error?.field === "email"}
                />
                <FloatField
                  label={mode === "signup" ? `Crie uma senha (mín. ${MIN_PASSWORD})` : "Senha"}
                  name="password"
                  type={showPw ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  bad={error?.field === "password"}
                  right={
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Esconder senha" : "Mostrar senha"}
                      className="grid h-11 w-11 place-items-center rounded-full text-cocoa-muted hover:text-cocoa"
                    >
                      <Icon name={showPw ? "eyeOff" : "eye"} className="h-5 w-5" />
                    </button>
                  }
                />
                {mode === "signup" ? (
                  <FloatField
                    label="Código de acesso"
                    name="code"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    bad={error?.field === "code"}
                  />
                ) : null}

                {error ? (
                  <p
                    role="alert"
                    className="rounded-2xl bg-berry-soft px-4 py-3 text-sm font-medium text-berry-hover"
                  >
                    {error.msg}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={busy}
                  className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#D81F3D] to-berry font-bold text-white shadow-cta transition active:scale-[0.99] disabled:opacity-70"
                >
                  {busy ? (
                    <span
                      className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                      aria-hidden="true"
                    />
                  ) : null}
                  {busy ? "Aguarde…" : mode === "login" ? "Entrar" : "Criar conta e entrar"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-5 max-w-md text-center text-xs leading-relaxed text-snow/70">
          Sua conta e seu progresso ficam salvos neste aparelho. Dúvidas?{" "}
          <a href={`mailto:${supportEmail}`} className="underline">
            {supportEmail}
          </a>
        </p>
      </main>
    </div>
  );
}
