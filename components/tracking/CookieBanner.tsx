"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { copy } from "@/content/copy.ptBR";
import { OPEN_PREFERENCES_EVENT, readConsent, writeConsent } from "@/lib/consent";
import { CLARITY, UTMIFY } from "@/components/tracking/Pixels";

// O banner só existe quando há algum pixel configurado (é o que exige o consentimento).
const HAS_PIXELS = Boolean(
  process.env.NEXT_PUBLIC_META_PIXEL_ID ||
    process.env.NEXT_PUBLIC_GA4_ID ||
    process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ||
    UTMIFY ||
    CLARITY,
);

/** Banner LGPD: cookies não essenciais ficam bloqueados até o aceite. */
export function CookieBanner() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const current = readConsent();
    if (!current) setOpen(true);
    const reopen = () => {
      const c = readConsent();
      setAnalytics(!!c?.analytics);
      setMarketing(!!c?.marketing);
      setCustom(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, reopen);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, reopen);
  }, []);

  // dentro do app (área de membros) não há pixels nem anúncios: só cookie essencial de sessão
  if (!HAS_PIXELS || !open || pathname.startsWith("/app") || pathname.startsWith("/criativos")) return null;

  const save = (choice: { analytics: boolean; marketing: boolean }) => {
    writeConsent(choice);
    setOpen(false);
  };

  const c = copy.cookies;
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-3xl bg-white p-5 text-sm shadow-lift ring-1 ring-cocoa/10 sm:bottom-5"
    >
      <p id="cookie-title" className="leading-relaxed text-cocoa-soft">
        {c.text}{" "}
        <Link href="/privacidade" className="font-semibold text-cocoa underline underline-offset-2">
          {c.policy}
        </Link>
        .
      </p>

      {custom ? (
        <fieldset className="mt-4 space-y-3">
          <legend className="sr-only">{c.customize}</legend>
          {[
            { label: c.analytics, value: analytics, set: setAnalytics, id: "ck-analytics" },
            { label: c.marketing, value: marketing, set: setMarketing, id: "ck-marketing" },
          ].map((o) => (
            <label key={o.id} htmlFor={o.id} className="flex min-h-[44px] items-center gap-3 text-cocoa">
              <input
                id={o.id}
                type="checkbox"
                checked={o.value}
                onChange={(e) => o.set(e.target.checked)}
                className="h-5 w-5 accent-pine"
              />
              {o.label}
            </label>
          ))}
        </fieldset>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {custom ? (
          <button
            type="button"
            onClick={() => save({ analytics, marketing })}
            className="min-h-[48px] flex-1 rounded-full bg-pine px-5 font-bold text-white"
          >
            {c.save}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => save({ analytics: true, marketing: true })}
            className="min-h-[48px] flex-1 rounded-full bg-pine px-5 font-bold text-white"
          >
            {c.accept}
          </button>
        )}
        <button
          type="button"
          onClick={() => save({ analytics: false, marketing: false })}
          className="min-h-[48px] flex-1 rounded-full px-5 font-bold text-cocoa ring-1 ring-cocoa/20"
        >
          {c.reject}
        </button>
        {!custom ? (
          <button
            type="button"
            onClick={() => setCustom(true)}
            className="min-h-[48px] w-full px-3 font-semibold text-cocoa underline underline-offset-2 sm:w-auto"
          >
            {c.customize}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function ManageCookiesButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT))}
    >
      {children}
    </button>
  );
}
