import Image from "next/image";
import { siteConfig } from "@/config/site.config";
import { copy } from "@/content/copy.ptBR";
import { formatReais } from "@/lib/pricing";
import { interpolate } from "@/lib/template";
import { IPhone } from "@/components/phone/IPhone";
import { PricingScreen } from "@/components/phone/Screens";
import { Sprig } from "@/components/decor/Ornaments";
import { Icon } from "@/components/ui/Icon";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import { Title } from "@/components/ui/Rich";

/** Bônus */
export function Bonus() {
  const c = copy.bonus;
  const icons = ["calendar", "swap", "ribbon"] as const;
  return (
    <section className="section bg-white">
      <div className="container-page">
        <Reveal className="text-center">
          <Kicker>{c.kicker}</Kicker>
          <Title text={c.title} className="h2 mt-5" />
        </Reveal>
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {c.items.map((b, i) => {
            const ref = siteConfig.bonuses.find((x) => x.id === b.id)?.referenceValue;
            return (
              <Reveal
                as="li"
                key={b.id}
                delay={i * 0.06}
                className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-[#FFF4DD] to-white p-7 ring-1 ring-gold/40"
              >
                {b.photo ? (
                  <span className="relative -mx-7 -mt-7 mb-6 block h-44">
                    <Image
                      src={b.photo}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 380px, 92vw"
                      className="object-cover"
                    />
                  </span>
                ) : null}
                {/* laço de presente */}
                <span aria-hidden="true" className="absolute inset-y-0 right-10 w-3 bg-berry/10" />
                <span className="inline-flex rounded-full bg-berry px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  {b.tag}
                </span>
                {b.photo ? null : (
                  <Icon name={icons[i] ?? "gift"} className="absolute right-6 top-6 h-8 w-8 text-gold-text" />
                )}
                <h3 className="mt-6 text-2xl leading-tight">{b.title}</h3>
                <p className="mt-2 leading-relaxed">{b.text}</p>
                {ref ? (
                  <p className="mt-4 text-sm font-semibold text-gold-text">
                    {interpolate(c.referenceLabel, { value: formatReais(ref) })}
                  </p>
                ) : null}
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Do forno ao WhatsApp (sem promessa de ganho) */
export function Income() {
  const c = copy.income;
  const icons = ["calculator", "tag", "gift"] as const;
  return (
    <section className="grain relative overflow-hidden bg-pine text-snow">
      <div className="container-page section grid items-center gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <Kicker tone="dark">{c.kicker}</Kicker>
          <Title text={c.title} tone="dark" className="h2 mt-5" />
          <p className="mt-6 text-lg leading-relaxed text-snow/80">{c.text}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {c.cards.map((card, i) => (
              <li
                key={card}
                className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-4 font-semibold ring-1 ring-white/15"
              >
                <Icon name={icons[i] ?? "check"} className="h-6 w-6 shrink-0 text-gold-light" />
                {card}
              </li>
            ))}
          </ul>
          <p className="mt-8 rounded-2xl bg-black/20 p-4 text-[15px] leading-relaxed">
            <strong className="font-semibold">{c.disclaimerLabel} </strong>
            {c.disclaimer}
          </p>
        </Reveal>
        <Reveal className="relative mx-auto w-full max-w-[280px] lg:col-span-5" delay={0.1}>
          <Sprig className="absolute -left-10 -top-6 z-10 w-32" />
          <IPhone label="Calculadora de preço do app com valores de exemplo" className="w-full rotate-3">
            <PricingScreen />
          </IPhone>
        </Reveal>
      </div>
    </section>
  );
}

/** Para quem é / não é */
export function Audience() {
  const c = copy.audience;
  return (
    <section className="section">
      <div className="container-page grid gap-6 lg:grid-cols-2">
        <Reveal className="card p-7 sm:p-9">
          <h2 className="text-3xl">{c.forTitle}</h2>
          <ul className="mt-6 space-y-4">
            {c.forItems.map((item) => (
              <li key={item} className="flex gap-3 text-[17px] leading-snug">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-pine text-white">
                  <Icon name="check" className="h-4 w-4" strokeWidth={2.4} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="rounded-3xl bg-ivory-deep p-7 ring-1 ring-cocoa/5 sm:p-9" delay={0.06}>
          <h2 className="text-3xl">{c.notTitle}</h2>
          <ul className="mt-6 space-y-4">
            {c.notItems.map((item) => (
              <li key={item} className="flex gap-3 text-[17px] leading-snug">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-berry text-white">
                  <Icon name="x" className="h-3.5 w-3.5" strokeWidth={2.6} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/** Depoimentos — só com depoimentos reais cadastrados (com autorização). */
export function Testimonials() {
  const list = siteConfig.testimonials;
  if (!list.length) return null;
  const c = copy.testimonials;
  return (
    <section className="section bg-white">
      <div className="container-page">
        <Kicker>{c.kicker}</Kicker>
        <h2 className="h2 mt-5">{c.title}</h2>
        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((item) => (
            <li key={item.name + item.text.slice(0, 12)} className="card p-6">
              <blockquote className="leading-relaxed text-cocoa">“{item.text}”</blockquote>
              <p className="mt-4 flex items-center gap-3 text-sm font-semibold text-cocoa">
                {item.photo ? (
                  <Image
                    src={item.photo}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : null}
                {item.name}
                {item.city ? <span className="font-normal text-cocoa-muted">· {item.city}</span> : null}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
