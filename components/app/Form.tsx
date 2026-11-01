"use client";

import { useFormStatus } from "react-dom";
import type { InputHTMLAttributes, ReactNode } from "react";

export function Field({
  label,
  hint,
  ...props
}: { label: string; hint?: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-cocoa">{label}</span>
      <input
        {...props}
        className={`block min-h-[52px] w-full rounded-2xl border border-cocoa/15 bg-white px-4 text-base text-cocoa placeholder:text-cocoa-muted/70 focus:border-pine focus:outline-none focus:ring-4 focus:ring-pine/15 ${props.className ?? ""}`}
      />
      {hint ? <span className="mt-1.5 block text-xs text-cocoa-muted">{hint}</span> : null}
    </label>
  );
}

export function SubmitButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending || undefined}
      className={`flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#D81F3D] to-berry px-6 font-bold uppercase tracking-wide text-white shadow-cta transition hover:from-berry hover:to-berry-hover disabled:opacity-60 ${className}`}
    >
      {pending ? (
        <span
          className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
        />
      ) : null}
      {pending ? "Aguarde…" : children}
    </button>
  );
}

export function Alert({
  tone = "error",
  children,
}: {
  tone?: "error" | "info" | "success";
  children: ReactNode;
}) {
  const styles =
    tone === "error"
      ? "bg-berry-soft text-berry-hover ring-berry/20"
      : tone === "success"
        ? "bg-pine-soft text-pine ring-pine/20"
        : "bg-gold-light/40 text-cocoa ring-gold/40";
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-2xl px-4 py-3 text-sm font-medium ring-1 ${styles}`}
    >
      {children}
    </p>
  );
}
