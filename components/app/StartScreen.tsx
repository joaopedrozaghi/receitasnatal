"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { enter } from "@/lib/app/local-auth";
import { useAuth } from "@/components/app/AuthProvider";
import { Icon } from "@/components/ui/Icon";

/**
 * Tela de abertura do app: a foto da Rô, o nome, o que tem dentro e um botão "Entrar".
 * Sem cadastro: o aparelho lembra que a pessoa entrou.
 */
export function StartScreen({ next, recipesCount }: { next?: string; recipesCount: number }) {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [going, setGoing] = useState(false);

  const target =
    next?.startsWith("/app") && !next.startsWith("/app/entrar") && !next.startsWith("/app/conta")
      ? next
      : "/app";

  // quem já entrou neste aparelho vai direto
  useEffect(() => {
    if (ready && user) router.replace(target);
  }, [ready, user, router, target]);

  const onEnter = () => {
    setGoing(true);
    enter();
    router.replace(target);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-pine-deep text-snow lg:grid lg:grid-cols-[1.15fr_1fr]">
      {/* a Rô com o panetone: ocupa o espaço que sobrar, o botão fica sempre na tela */}
      <figure className="relative min-h-[34dvh] flex-1 overflow-hidden lg:h-[100dvh]">
        <Image
          src="/images/ro-panetone.jpg"
          alt="Roseli Monteiro mostrando um panetone recém-assado"
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="start-photo object-cover"
          style={{ objectPosition: "50% 30%" }}
        />
      </figure>

      <main
        id="conteudo"
        className="mx-auto flex w-full max-w-xl flex-col px-6 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-6 lg:mx-0 lg:max-w-none lg:justify-center lg:px-16 lg:py-16 xl:px-24"
      >
        <span className="start-in hidden h-16 w-16 place-items-center rounded-2xl bg-white/10 text-gold-light lg:grid">
          <Icon name="panettone" className="h-8 w-8" strokeWidth={1.7} />
        </span>

        <h1 className="start-in font-display text-[2.75rem] font-bold leading-[0.95] tracking-[-0.035em] !text-snow sm:text-[3.6rem] lg:mt-8 lg:text-[5.6rem]">
          Receitinhas da Rô
        </h1>
        <p className="start-in mt-4 max-w-md text-[18px] leading-[1.5] text-snow lg:mt-6 lg:text-[22px]">
          {recipesCount} receitas de Natal da Roseli Monteiro, com passo a passo: panetones, docinhos,
          salgados e a ceia inteira.
        </p>

        <button
          type="button"
          onClick={onEnter}
          disabled={going}
          className="start-in mt-7 flex min-h-[60px] w-full items-center justify-center gap-3 rounded-full bg-snow text-[19px] font-bold text-pine-deep transition-transform duration-150 hover:bg-white active:scale-[0.98] disabled:opacity-80 lg:mt-12 lg:max-w-sm"
        >
          {going ? "Abrindo…" : "Entrar"}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          >
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <p className="start-in mt-4 text-[15px] leading-relaxed text-snow/75">
          Sem cadastro. Seus favoritos e sua lista ficam salvos neste aparelho.
        </p>
      </main>
    </div>
  );
}
