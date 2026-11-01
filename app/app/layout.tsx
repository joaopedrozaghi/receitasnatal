import type { Metadata, Viewport } from "next";
import { isDatabaseConfigured } from "@/lib/app/db";

export const metadata: Metadata = {
  title: { default: "App Especial de Natal", template: "%s · App da Rô" },
  robots: { index: false, follow: false },
  manifest: "/app.webmanifest",
  appleWebApp: { capable: true, title: "Receitinhas da Rô", statusBarStyle: "black-translucent" },
  icons: { apple: "/images/app/icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: "#0A2B20",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function AppRootLayout({ children }: { children: React.ReactNode }) {
  // Publicado sem banco configurado: mostra um aviso amigável em vez de erro.
  if (!isDatabaseConfigured()) {
    return (
      <main className="grain flex min-h-[100dvh] items-center justify-center bg-pine-deep px-6 text-center text-snow">
        <div className="max-w-md">
          <p className="font-display text-3xl">
            Receitinhas <span className="italic text-gold">da Rô</span>
          </p>
          <h1 className="mt-6 text-3xl !text-snow">O app está quase pronto 🎄</h1>
          <p className="mt-3 text-snow/75">
            Estamos finalizando a configuração. Se você já comprou, o seu acesso chega por e-mail assim que
            tudo estiver no ar.
          </p>
        </div>
      </main>
    );
  }
  return children;
}
