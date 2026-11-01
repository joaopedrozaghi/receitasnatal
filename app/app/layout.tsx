import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/app/AuthProvider";
import { future } from "../fonts";

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
  return (
    <div className={`app-theme ${future.variable}`}>
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
