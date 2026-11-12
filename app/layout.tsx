import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site.config";
import { copy } from "@/content/copy.ptBR";
import { t } from "@/lib/offer";
import { siteUrl } from "@/lib/seo";
import { Pixels } from "@/components/tracking/Pixels";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { display, sans, script } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: t(copy.meta.title), template: `%s · ${siteConfig.brand.name}` },
  description: t(copy.meta.description),
  applicationName: siteConfig.brand.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: siteConfig.brand.name,
    title: t(copy.meta.title),
    description: t(copy.meta.description),
  },
  twitter: { card: "summary_large_image", title: t(copy.meta.title), description: t(copy.meta.description) },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0A2B20",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable} ${script.variable}`}>
      <body>
        <a
          href="#conteudo"
          className="sr-only z-[70] rounded-full bg-pine px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          Pular para o conteúdo
        </a>
        {children}
        <RevealObserver />
        <Pixels />
      </body>
    </html>
  );
}
