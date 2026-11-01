/**
 * Telas de EXEMPLO do web app (ilustram a experiência; o app real será feito depois).
 * Textos em content/copy.ptBR.ts > phones.
 */
import Image from "next/image";
import { siteConfig } from "@/config/site.config";
import { copy } from "@/content/copy.ptBR";
import { ChefAvatar } from "@/components/chef/ChefPhotos";
import { Icon } from "@/components/ui/Icon";

const tileStyles = [
  "bg-[#F6E3C4] text-gold-text",
  "bg-berry-soft text-berry",
  "bg-pine-soft text-pine",
  "bg-[#F3E1D6] text-cocoa-soft",
  "bg-[#EDE3F2] text-[#5B3D6E]",
  "bg-[#FCEFD3] text-[#9A5B12]",
];
const tileIcons = ["panettone", "truffle", "savory", "roast", "dessert", "cookie"];

/** Foto do panetone (recorte da foto da Roseli segurando o panetone). */
function PanettonePhoto({ className = "", sizes }: { className?: string; sizes: string }) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <Image
        src={siteConfig.chef.photoHero.src}
        alt=""
        fill
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: "50% 52%", transform: "scale(1.9)", transformOrigin: "52% 50%" }}
      />
    </span>
  );
}

export function HomeScreen() {
  const c = copy.phones.home;
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden px-[1.25em] pt-[0.6em]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[0.78em] font-medium text-cocoa-muted">{c.hello}</p>
            <p className="font-display text-[1.55em] leading-[1.05] text-cocoa">{c.question}</p>
          </div>
          <ChefAvatar size={34} className="ring-2 ring-gold/60" />
        </div>
        <div className="mt-[1em] flex items-center gap-[0.5em] rounded-full bg-white px-[0.9em] py-[0.65em] text-[0.78em] text-cocoa-muted shadow-soft">
          <Icon name="search" className="h-[1.2em] w-[1.2em]" strokeWidth={2} />
          {c.search}
        </div>
        <p className="mt-[1.1em] text-[0.82em] font-bold text-cocoa">{c.categoriesTitle}</p>
        <div className="mt-[0.55em] grid grid-cols-3 gap-[0.5em]">
          {c.categories.map((cat, i) => (
            <div
              key={cat}
              className={`flex flex-col items-center gap-[0.3em] rounded-[0.9em] py-[0.75em] ${tileStyles[i]}`}
            >
              <Icon name={tileIcons[i] ?? "sparkle"} className="h-[1.6em] w-[1.6em]" strokeWidth={1.7} />
              <span className="text-[0.66em] font-semibold text-cocoa">{cat}</span>
            </div>
          ))}
        </div>
        <p className="mt-[1.1em] text-[0.82em] font-bold text-cocoa">{c.continueTitle}</p>
        <div className="mt-[0.55em] flex items-center gap-[0.7em] rounded-[1em] bg-white p-[0.55em] shadow-soft">
          <PanettonePhoto className="relative h-[3.6em] w-[3.6em] shrink-0 rounded-[0.7em]" sizes="80px" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.82em] font-bold text-cocoa">{c.continueRecipe}</p>
            <p className="text-[0.68em] text-cocoa-muted">{c.continueMeta}</p>
            <div className="mt-[0.4em] h-[0.35em] rounded-full bg-ivory-deep">
              <div className="h-full w-[38%] rounded-full bg-berry" />
            </div>
          </div>
        </div>
      </div>
      <nav className="flex shrink-0 justify-around border-t border-cocoa/10 bg-white px-[0.5em] pb-[1.6em] pt-[0.6em]">
        {c.nav.map((n, i) => (
          <span
            key={n}
            className={`flex flex-col items-center gap-[0.15em] text-[0.6em] font-semibold ${i === 0 ? "text-berry" : "text-cocoa-muted"}`}
          >
            <Icon
              name={["home", "search", "list", "heart"][i] ?? "home"}
              className="h-[1.9em] w-[1.9em]"
              strokeWidth={1.9}
            />
            {n}
          </span>
        ))}
      </nav>
    </div>
  );
}

export function RecipeScreen() {
  const c = copy.phones.recipe;
  return (
    <div className="absolute inset-x-0 bottom-0 top-[-2.9em] flex flex-col">
      <div className="relative h-[40%] shrink-0">
        <PanettonePhoto className="absolute inset-0" sizes="320px" />
        <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-black/35 to-transparent" />
        <span className="absolute left-[1em] top-[3.4em] grid h-[2em] w-[2em] place-items-center rounded-full bg-white/90 text-cocoa">
          <svg
            viewBox="0 0 24 24"
            className="h-[1.1em] w-[1.1em]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </span>
        <span className="absolute right-[1em] top-[3.4em] grid h-[2em] w-[2em] place-items-center rounded-full bg-white/90 text-berry">
          <Icon name="heart" className="h-[1.1em] w-[1.1em]" strokeWidth={2.2} />
        </span>
      </div>
      <div className="relative -mt-[1.3em] flex flex-1 flex-col rounded-t-[1.4em] bg-ivory px-[1.2em] pt-[1.1em]">
        <p className="font-display text-[1.35em] leading-[1.05] text-cocoa">{c.title}</p>
        <div className="mt-[0.6em] flex gap-[0.35em]">
          {c.meta.map((m) => (
            <span
              key={m}
              className="rounded-full bg-pine-soft px-[0.6em] py-[0.2em] text-[0.62em] font-semibold text-pine"
            >
              {m}
            </span>
          ))}
        </div>
        <div className="mt-[0.8em] flex items-center justify-between rounded-[0.8em] bg-white px-[0.8em] py-[0.5em] shadow-soft">
          <span className="text-[0.7em] text-cocoa-muted">{c.servingsLabel}</span>
          <span className="flex items-center gap-[0.5em] text-[0.74em] font-bold text-cocoa">
            <span className="grid h-[1.5em] w-[1.5em] place-items-center rounded-full bg-ivory-deep">−</span>
            {c.servings}
            <span className="grid h-[1.5em] w-[1.5em] place-items-center rounded-full bg-berry text-white">
              +
            </span>
          </span>
        </div>
        <p className="mt-[0.9em] text-[0.8em] font-bold text-cocoa">{c.ingredientsTitle}</p>
        <ul className="mt-[0.3em]">
          {c.ingredients.map(([name, qty]) => (
            <li
              key={name}
              className="flex items-center justify-between border-b border-dashed border-cocoa/15 py-[0.38em] text-[0.7em]"
            >
              <span className="text-cocoa-soft">{name}</span>
              <span className="font-bold text-cocoa">{qty}</span>
            </li>
          ))}
        </ul>
        <span className="mb-[1.8em] mt-auto flex items-center justify-center gap-[0.4em] rounded-full bg-berry py-[0.75em] text-[0.74em] font-bold text-white">
          <Icon name="flame" className="h-[1.2em] w-[1.2em]" strokeWidth={2} />
          {c.start}
        </span>
      </div>
    </div>
  );
}

export function CookScreen() {
  const c = copy.phones.cook;
  const progress = 0.62;
  const r = 42;
  const len = 2 * Math.PI * r;
  return (
    <div className="grain flex h-full flex-col px-[1.3em] pb-[1.8em] pt-[0.6em] text-snow">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-white/10 px-[0.7em] py-[0.25em] text-[0.64em] font-semibold text-gold-light">
          {c.badge}
        </span>
        <span className="text-[0.68em] text-white/70">{c.step}</span>
      </div>
      <div className="mt-[0.6em] flex gap-[0.25em]">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className={`h-[0.25em] flex-1 rounded-full ${i < 4 ? "bg-gold" : "bg-white/15"}`} />
        ))}
      </div>
      <p className="mt-[1.1em] font-display text-[1.45em] leading-[1.12]">{c.instruction}</p>
      <div className="relative mx-auto mt-[1.1em] aspect-square w-[58%]">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="#D4A24C"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={len}
            strokeDashoffset={len * (1 - progress)}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-display text-[2.2em]">{c.timer}</span>
      </div>
      <span className="mx-auto mt-[0.7em] rounded-full bg-gold px-[1.2em] py-[0.5em] text-[0.72em] font-bold text-pine-deep">
        {c.timerLabel}
      </span>
      <div className="mt-[1em] rounded-[1em] bg-white/10 p-[0.8em] ring-1 ring-white/10">
        <p className="text-[0.7em] font-bold text-gold-light">{c.whyTitle}</p>
        <p className="mt-[0.2em] text-[0.68em] leading-[1.4] text-white/85">{c.why}</p>
      </div>
      <span className="mt-auto flex items-center justify-center gap-[0.4em] rounded-full bg-white py-[0.7em] text-[0.74em] font-bold text-pine-deep">
        {c.next} →
      </span>
    </div>
  );
}

export function PricingScreen() {
  const c = copy.phones.pricing;
  return (
    <div className="flex h-full flex-col px-[1.3em] pb-[1.8em] pt-[0.6em]">
      <p className="font-display text-[1.45em] text-cocoa">{c.title}</p>
      <p className="text-[0.72em] text-cocoa-muted">{c.item}</p>
      <div className="mt-[0.9em] rounded-[1em] bg-white p-[0.9em] shadow-soft">
        {c.rows.map(([k, v]) => (
          <div key={k} className="flex justify-between border-b border-cocoa/10 py-[0.45em] text-[0.74em]">
            <span className="text-cocoa-soft">{k}</span>
            <span className="font-semibold text-cocoa">{v}</span>
          </div>
        ))}
        <div className="flex justify-between pt-[0.55em] text-[0.78em] font-bold text-cocoa">
          <span>{c.costLabel}</span>
          <span>{c.cost}</span>
        </div>
      </div>
      <div className="mt-[0.8em] flex items-center justify-between rounded-[1em] bg-white px-[0.9em] py-[0.7em] shadow-soft">
        <span className="text-[0.74em] text-cocoa-soft">{c.marginLabel}</span>
        <span className="rounded-full bg-pine-soft px-[0.7em] py-[0.2em] text-[0.74em] font-bold text-pine">
          {c.margin}
        </span>
      </div>
      <div className="mt-[0.8em] rounded-[1em] bg-pine p-[1em] text-center text-snow">
        <p className="text-[0.7em] uppercase tracking-[0.14em] text-gold-light">{c.priceLabel}</p>
        <p className="font-display text-[2.3em] leading-none">{c.price}</p>
      </div>
      <p className="mt-auto text-center text-[0.62em] text-cocoa-muted">{c.note}</p>
    </div>
  );
}
