"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Marca [data-reveal] como visível ao entrar na tela (um único observer para a página). */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => {
      // o que já está na tela ao carregar não anima (evita "piscar" e não atrapalha o LCP)
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
      else io.observe(el);
    });
    document.documentElement.classList.add("reveal-ready");
    return () => io.disconnect();
  }, [pathname]); // reexecuta a cada navegação
  return null;
}
