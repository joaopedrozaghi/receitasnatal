"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

/** Ensina a adicionar o app à tela inicial (botão nativo no Android/Chrome; instruções no iPhone). */
export function InstallHint({ compact = false }: { compact?: boolean }) {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<"ios" | "android" | "other">("other");
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setPlatform(/iphone|ipad|ipod/i.test(ua) ? "ios" : /android/i.test(ua) ? "android" : "other");
    setInstalled(window.matchMedia("(display-mode: standalone)").matches);
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (installed) return null;

  return (
    <div
      className={`${compact ? "mt-4" : ""} rounded-2xl bg-ivory p-4 text-sm leading-relaxed ring-1 ring-cocoa/10`}
    >
      <p className="font-semibold text-cocoa">📲 Adicione à tela inicial</p>
      {promptEvent ? (
        <button
          type="button"
          onClick={() => promptEvent.prompt().then(() => setPromptEvent(null))}
          className="mt-2 min-h-[44px] rounded-full bg-pine px-5 font-bold text-white"
        >
          Instalar o app
        </button>
      ) : platform === "ios" ? (
        <p className="mt-1 text-cocoa-soft">
          No Safari, toque em <strong>Compartilhar</strong> (quadrado com seta) e depois em{" "}
          <strong>Adicionar à Tela de Início</strong>.
        </p>
      ) : (
        <p className="mt-1 text-cocoa-soft">
          No Chrome, toque nos <strong>três pontinhos</strong> e em <strong>Adicionar à tela inicial</strong>{" "}
          (ou <strong>Instalar app</strong>).
        </p>
      )}
    </div>
  );
}
