/**
 * Telas de EXEMPLO do web app (ilustram a experiência; o app real será feito depois).
 * Textos e fotos em content/copy.ptBR.ts > phones.
 */
import Image from "next/image";
import { copy } from "@/content/copy.ptBR";
import { Icon } from "@/components/ui/Icon";

/** Foto dentro da tela do celular. */
function Photo({
  src,
  sizes,
  focus = "50% 50%",
  className = "",
}: {
  src: string;
  sizes: string;
  focus?: string;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden bg-ivory-deep ${className}`}>
      <Image src={src} alt="" fill sizes={sizes} className="object-cover" style={{ objectPosition: focus }} />
    </span>
  );
}

const navIcons = ["home", "search", "list", "heart"];

function BottomNav({ active = 0 }: { active?: number }) {
  return (
    <nav className="flex shrink-0 justify-around border-t border-cocoa/10 bg-white/95 px-[0.4em] pb-[1.5em] pt-[0.55em]">
      {copy.phones.home.nav.map((n, i) => (
        <span
          key={n}
          className={`flex flex-col items-center gap-[0.1em] text-[0.58em] font-semibold ${
            i === active ? "text-berry" : "text-cocoa-muted"
          }`}
        >
          <Icon name={navIcons[i] ?? "home"} className="h-[1.9em] w-[1.9em]" strokeWidth={1.9} />
          {n}
        </span>
      ))}
    </nav>
  );
}

export function HomeScreen() {
  const c = copy.phones.home;
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden px-[1.1em] pt-[0.4em]">
        <p className="text-[0.66em] font-bold uppercase tracking-[0.12em] text-berry">{c.label}</p>
        <p className="mt-[0.1em] font-display text-[1.5em] leading-[1.05] text-cocoa">{c.question}</p>

        {/* destaque */}
        <div className="relative mt-[0.8em] h-[8.4em] overflow-hidden rounded-[1.1em]">
          <Photo
            src={c.categories[0]?.photo ?? ""}
            sizes="300px"
            focus="50% 40%"
            className="absolute inset-0"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute left-[0.7em] top-[0.7em] rounded-full bg-white/90 px-[0.6em] py-[0.15em] text-[0.58em] font-bold text-berry">
            {c.featuredTag}
          </span>
          <span className="absolute inset-x-[0.8em] bottom-[0.7em] flex items-end justify-between gap-[0.4em]">
            <span className="font-display text-[1.15em] leading-tight text-white">{c.featuredTitle}</span>
            <span className="shrink-0 rounded-full bg-berry px-[0.7em] py-[0.3em] text-[0.58em] font-bold text-white">
              {c.featuredCta}
            </span>
          </span>
        </div>

        {/* categorias */}
        <p className="mt-[0.9em] text-[0.78em] font-bold text-cocoa">{c.categoriesTitle}</p>
        <div className="mt-[0.45em] grid grid-cols-4 gap-[0.45em]">
          {c.categories.map((cat) => (
            <span key={cat.name} className="flex flex-col items-center gap-[0.3em]">
              <Photo
                src={cat.photo}
                sizes="80px"
                focus={cat.focus}
                className="relative aspect-square w-full rounded-full shadow-soft ring-2 ring-white"
              />
              <span className="text-[0.6em] font-semibold text-cocoa">{cat.name}</span>
            </span>
          ))}
        </div>

        {/* continuar */}
        <p className="mt-[0.9em] text-[0.78em] font-bold text-cocoa">{c.continueTitle}</p>
        <div className="mt-[0.45em] flex items-center gap-[0.65em] rounded-[1em] bg-white p-[0.5em] shadow-soft">
          <Photo
            src={c.continuePhoto}
            sizes="80px"
            focus="50% 30%"
            className="relative h-[3.2em] w-[3.2em] shrink-0 rounded-[0.7em]"
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.78em] font-bold text-cocoa">{c.continueRecipe}</span>
            <span className="block text-[0.62em] text-cocoa-muted">{c.continueMeta}</span>
            <span className="mt-[0.35em] block h-[0.32em] rounded-full bg-ivory-deep">
              <span className="block h-full w-1/2 rounded-full bg-berry" />
            </span>
          </span>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

/** Use com <IPhone overlayStatus>: a foto vai até o topo, por baixo da barra de status. */
export function RecipeScreen() {
  const c = copy.phones.recipe;
  return (
    <div className="flex h-full flex-col">
      <div className="relative h-[38%] shrink-0">
        <Photo src={c.photo} sizes="320px" focus="35% 75%" className="absolute inset-0" />
        <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/45 to-transparent" />
        <span className="absolute left-[0.9em] top-[3em] grid h-[1.9em] w-[1.9em] place-items-center rounded-full bg-white/90 text-cocoa">
          <svg
            viewBox="0 0 24 24"
            className="h-[1em] w-[1em]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </span>
        <span className="absolute right-[0.9em] top-[3em] grid h-[1.9em] w-[1.9em] place-items-center rounded-full bg-white/90 text-berry">
          <Icon name="heart" className="h-[1em] w-[1em]" strokeWidth={2.4} />
        </span>
      </div>
      <div className="relative -mt-[1.2em] flex flex-1 flex-col rounded-t-[1.3em] bg-ivory px-[1.1em] pt-[1em]">
        <p className="text-[0.6em] font-bold uppercase tracking-[0.12em] text-berry">{c.tag}</p>
        <p className="font-display text-[1.45em] leading-[1.05] text-cocoa">{c.title}</p>
        <div className="mt-[0.5em] flex gap-[0.35em]">
          {c.meta.map((m) => (
            <span
              key={m}
              className="rounded-full bg-pine-soft px-[0.6em] py-[0.18em] text-[0.58em] font-semibold text-pine"
            >
              {m}
            </span>
          ))}
        </div>
        <div className="mt-[0.7em] flex items-center justify-between rounded-[0.8em] bg-white px-[0.75em] py-[0.45em] shadow-soft">
          <span className="text-[0.66em] text-cocoa-muted">{c.servingsLabel}</span>
          <span className="flex items-center gap-[0.45em] text-[0.7em] font-bold text-cocoa">
            <span className="grid h-[1.5em] w-[1.5em] place-items-center rounded-full bg-ivory-deep">−</span>
            {c.servings}
            <span className="grid h-[1.5em] w-[1.5em] place-items-center rounded-full bg-berry text-white">
              +
            </span>
          </span>
        </div>
        <p className="mt-[0.75em] text-[0.76em] font-bold text-cocoa">{c.ingredientsTitle}</p>
        <ul className="mt-[0.15em]">
          {c.ingredients.map(([name, qty]) => (
            <li
              key={name}
              className="flex items-center justify-between border-b border-dashed border-cocoa/15 py-[0.34em] text-[0.66em]"
            >
              <span className="text-cocoa-soft">{name}</span>
              <span className="font-bold text-cocoa">{qty}</span>
            </li>
          ))}
        </ul>
        <span className="mb-[1.7em] mt-auto flex items-center justify-center gap-[0.4em] rounded-full bg-berry py-[0.7em] text-[0.68em] font-bold text-white">
          <Icon name="flame" className="h-[1.2em] w-[1.2em]" strokeWidth={2} />
          {c.start}
        </span>
      </div>
    </div>
  );
}

export function CookScreen() {
  const c = copy.phones.cook;
  const r = 42;
  const len = 2 * Math.PI * r;
  return (
    <div className="flex h-full flex-col px-[1.2em] pb-[1.7em] pt-[0.5em] text-snow">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-white/10 px-[0.7em] py-[0.25em] text-[0.62em] font-semibold text-gold-light">
          {c.badge}
        </span>
        <span className="text-[0.64em] text-white/70">{c.step}</span>
      </div>
      <div className="mt-[0.55em] flex gap-[0.22em]">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className={`h-[0.22em] flex-1 rounded-full ${i < 4 ? "bg-gold" : "bg-white/15"}`} />
        ))}
      </div>
      <p className="mt-[1em] font-display text-[1.4em] leading-[1.12]">{c.instruction}</p>
      <div className="relative mx-auto mt-[1em] aspect-square w-[54%]">
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
            strokeDashoffset={len * 0.38}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-display text-[2em]">{c.timer}</span>
      </div>
      <span className="mx-auto mt-[0.6em] rounded-full bg-gold px-[1.1em] py-[0.45em] text-[0.66em] font-bold text-pine-deep">
        {c.timerLabel}
      </span>
      <div className="mt-[0.9em] rounded-[1em] bg-white/10 p-[0.75em] ring-1 ring-white/10">
        <p className="text-[0.66em] font-bold text-gold-light">{c.whyTitle}</p>
        <p className="mt-[0.15em] text-[0.64em] leading-[1.4] text-white/85">{c.why}</p>
      </div>
      <span className="mt-auto flex items-center justify-center rounded-full bg-white py-[0.65em] text-[0.68em] font-bold text-pine-deep">
        {c.next} →
      </span>
    </div>
  );
}

export function PricingScreen() {
  const c = copy.phones.pricing;
  return (
    <div className="flex h-full flex-col px-[1.2em] pb-[1.7em] pt-[0.5em]">
      <p className="font-display text-[1.4em] text-cocoa">{c.title}</p>
      <div className="mt-[0.6em] flex items-center gap-[0.6em] rounded-[1em] bg-white p-[0.45em] shadow-soft">
        <Photo
          src={c.photo}
          sizes="80px"
          focus="35% 75%"
          className="relative h-[2.8em] w-[2.8em] shrink-0 rounded-[0.7em]"
        />
        <span className="text-[0.74em] font-bold text-cocoa">{c.item}</span>
      </div>
      <div className="mt-[0.6em] rounded-[1em] bg-white px-[0.85em] py-[0.5em] shadow-soft">
        {c.rows.map(([k, v]) => (
          <div key={k} className="flex justify-between border-b border-cocoa/10 py-[0.4em] text-[0.7em]">
            <span className="text-cocoa-soft">{k}</span>
            <span className="font-semibold text-cocoa">{v}</span>
          </div>
        ))}
        <div className="flex justify-between pt-[0.45em] text-[0.74em] font-bold text-cocoa">
          <span>{c.costLabel}</span>
          <span>{c.cost}</span>
        </div>
      </div>
      <div className="mt-[0.6em] flex items-center justify-between rounded-[1em] bg-white px-[0.85em] py-[0.6em] shadow-soft">
        <span className="text-[0.7em] text-cocoa-soft">{c.marginLabel}</span>
        <span className="rounded-full bg-pine-soft px-[0.7em] py-[0.15em] text-[0.7em] font-bold text-pine">
          {c.margin}
        </span>
      </div>
      <div className="mt-[0.6em] rounded-[1em] bg-pine p-[0.9em] text-center text-snow">
        <p className="text-[0.62em] uppercase tracking-[0.14em] text-gold-light">{c.priceLabel}</p>
        <p className="font-display text-[2.1em] leading-none">{c.price}</p>
      </div>
      <p className="mt-auto text-center text-[0.6em] text-cocoa-muted">{c.note}</p>
    </div>
  );
}
