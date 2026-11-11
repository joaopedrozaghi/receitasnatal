import { siteConfig } from "@/config/site.config";
import { pricingInput } from "@/lib/offer";
import { OfferProvider } from "@/components/offer/OfferProvider";

/** Envolve a página com o relógio da oferta e os links do checkout. */
export function OfferShell({ children }: { children: React.ReactNode }) {
  return (
    <OfferProvider
      pricing={pricingInput()}
      serverNow={Date.now()}
      checkoutUrl={siteConfig.checkout.url}
      checkoutUrlWithBump={siteConfig.checkout.urlWithBump}
      checkoutUrlBasic={siteConfig.basicPlan.url}
    >
      {children}
    </OfferProvider>
  );
}
