"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CONSENT_EVENT, readConsent, type ConsentState } from "@/lib/consent";
import { track } from "@/lib/track";

const META = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GA4 = process.env.NEXT_PUBLIC_GA4_ID;
const TIKTOK = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
// UTMify (rastreio de UTMs + pixel) e Microsoft Clarity. Os IDs são públicos (aparecem na página);
// dá para trocar pelas variáveis de ambiente sem mexer no código.
export const UTMIFY = process.env.NEXT_PUBLIC_UTMIFY_PIXEL_ID || "6acd9e2794f58292f82389ed";
export const CLARITY = process.env.NEXT_PUBLIC_CLARITY_ID || "zamvfm0xqy";

/**
 * Carrega Meta Pixel, GA4, TikTok, UTMify e Microsoft Clarity SOMENTE depois do aceite no banner de cookies.
 * Marketing: Meta, TikTok e UTMify. Medição: GA4 e Clarity.
 */
export function Pixels() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentState | null>(null);

  useEffect(() => {
    setConsent(readConsent());
    const onChange = (e: Event) => setConsent((e as CustomEvent<ConsentState>).detail);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  // ViewContent quando os pixels de marketing estiverem prontos
  useEffect(() => {
    if (!consent?.marketing && !consent?.analytics) return;
    const id = window.setTimeout(() => track("ViewContent"), 1500);
    return () => window.clearTimeout(id);
  }, [consent?.marketing, consent?.analytics]);

  if (!consent || pathname.startsWith("/app") || pathname.startsWith("/criativos")) return null;

  return (
    <>
      {consent.marketing && META ? (
        <Script id="meta-pixel" strategy="lazyOnload">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META}');fbq('track','PageView');`}
        </Script>
      ) : null}

      {consent.analytics && GA4 ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4}`} strategy="lazyOnload" />
          <Script id="ga4" strategy="lazyOnload">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA4}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}

      {consent.marketing && UTMIFY ? (
        <>
          {/* UTMify: guarda as UTMs do anúncio e repassa para o link do checkout */}
          <Script
            id="utmify-utms"
            src="https://cdn.utmify.com.br/scripts/utms/latest.js"
            strategy="afterInteractive"
            data-utmify-prevent-xcod-sck=""
            data-utmify-prevent-subids=""
          />
          {/* UTMify: pixel (precisa do window.pixelId antes de carregar) */}
          <Script id="utmify-pixel" strategy="afterInteractive">
            {`window.pixelId=${JSON.stringify(UTMIFY)};var s=document.createElement('script');s.async=true;s.defer=true;s.src='https://cdn.utmify.com.br/scripts/pixel/pixel.js';document.head.appendChild(s);`}
          </Script>
        </>
      ) : null}

      {consent.analytics && CLARITY ? (
        <Script id="ms-clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(CLARITY)});`}
        </Script>
      ) : null}

      {consent.marketing && TIKTOK ? (
        <Script id="tiktok-pixel" strategy="lazyOnload">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=d.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${TIKTOK}');ttq.page();}(window,document,'ttq');`}
        </Script>
      ) : null}
    </>
  );
}
