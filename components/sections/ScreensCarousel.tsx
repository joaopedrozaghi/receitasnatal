"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IPhone } from "@/components/phone/IPhone";

type Screen = { src: string; alt: string; caption: string };

/**
 * Carrossel das telas do app no celular: a tela do meio fica em destaque e as vizinhas
 * diminuem e esmaecem conforme a pessoa desliza (efeito de zoom). No computador vira uma grade.
 */
export function ScreensCarousel({ screens }: { screens: readonly Screen[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    const update = () => {
      raf = 0;
      const items = [...list.querySelectorAll<HTMLElement>("[data-card]")];
      if (desktop.matches) {
        items.forEach((el) => {
          el.style.transform = "";
          el.style.opacity = "";
        });
        return;
      }
      const box = list.getBoundingClientRect();
      const center = box.left + box.width / 2;
      let best = 0;
      let bestD = Infinity;
      items.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = (r.left + r.width / 2 - center) / r.width; // distância em "cartões"
        const k = Math.min(1, Math.abs(d));
        if (Math.abs(d) < bestD) {
          bestD = Math.abs(d);
          best = i;
        }
        if (reduce.matches) return;
        el.style.transform = `scale(${1 - k * 0.16}) translateX(${-d * 6}%)`;
        el.style.opacity = String(1 - k * 0.5);
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    list.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      list.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = (i: number) => {
    const list = listRef.current;
    const el = list?.querySelectorAll<HTMLElement>("li")[i];
    if (!list || !el) return;
    list.scrollTo({ left: el.offsetLeft - (list.clientWidth - el.clientWidth) / 2, behavior: "smooth" });
  };

  return (
    <div className="-mx-5 mt-8 sm:-mx-8 lg:mx-0">
      <ul
        ref={listRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 pt-3 [scrollbar-width:none] lg:grid lg:grid-cols-6 lg:gap-5 lg:overflow-visible lg:!px-0 [&::-webkit-scrollbar]:hidden"
        style={{ paddingInline: "calc(50% - min(30vw, 120px))" }}
      >
        {screens.map((s) => (
          <li key={s.src} className="w-[min(60vw,240px)] shrink-0 snap-center lg:w-auto">
            <div
              data-card
              className="origin-center transition-[transform,opacity] duration-150 ease-out will-change-transform"
            >
              <IPhone dark screenClassName="bg-pine" label={s.alt} className="w-full">
                <Image
                  src={s.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 200px, 62vw"
                  className="object-cover object-top"
                />
              </IPhone>
              <p className="mt-4 text-center text-[15px] font-semibold leading-snug text-cocoa">
                {s.caption}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {/* bolinhas: mostram em qual tela está e levam até ela */}
      <div className="mt-5 flex justify-center gap-2 lg:hidden">
        {screens.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ver tela: ${s.caption}`}
            aria-current={i === active}
            className={`h-2.5 rounded-full transition-all duration-300 ${i === active ? "w-7 bg-pine" : "w-2.5 bg-pine/25"}`}
          />
        ))}
      </div>
    </div>
  );
}
