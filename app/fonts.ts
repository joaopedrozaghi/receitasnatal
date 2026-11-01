import { Bricolage_Grotesque, Caveat, DM_Serif_Display, Space_Grotesk } from "next/font/google";

/** Títulos: serifada editorial de alto contraste (com itálico para os destaques). */
export const display = DM_Serif_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: "400",
  style: ["normal", "italic"],
});

/** Texto: grotesca moderna e calorosa (variável: um arquivo para todos os pesos). */
export const sans = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

/** Assinatura manuscrita da Roseli (uso pontual, sem preload). */
export const script = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-script",
  weight: "600",
  preload: false,
});

/** App (/app): grotesca geométrica de ar futurista, carregada só nas telas do app. */
export const future = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-future",
});
