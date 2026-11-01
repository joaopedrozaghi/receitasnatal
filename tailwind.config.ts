import type { Config } from "tailwindcss";

/**
 * Tema "Confeitaria de Natal": marfim + verde-pinheiro + vermelho-cereja + dourado.
 * Cereja (berry) é usada SOMENTE em ações (botões de compra).
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Cores em variáveis: a página de vendas usa os valores de :root, o app (/app) os de .app-theme.
      colors: {
        ivory: {
          DEFAULT: "rgb(var(--c-ivory) / <alpha-value>)",
          deep: "rgb(var(--c-ivory-deep) / <alpha-value>)",
        },
        cocoa: {
          DEFAULT: "rgb(var(--c-cocoa) / <alpha-value>)",
          soft: "rgb(var(--c-cocoa-soft) / <alpha-value>)",
          muted: "rgb(var(--c-cocoa-muted) / <alpha-value>)",
        },
        pine: {
          DEFAULT: "rgb(var(--c-pine) / <alpha-value>)",
          deep: "rgb(var(--c-pine-deep) / <alpha-value>)",
          soft: "rgb(var(--c-pine-soft) / <alpha-value>)",
          line: "rgb(var(--c-pine-line) / <alpha-value>)",
        },
        berry: {
          DEFAULT: "rgb(var(--c-berry) / <alpha-value>)",
          hover: "rgb(var(--c-berry-hover) / <alpha-value>)",
          soft: "rgb(var(--c-berry-soft) / <alpha-value>)",
        },
        gold: {
          DEFAULT: "rgb(var(--c-gold) / <alpha-value>)",
          light: "rgb(var(--c-gold-light) / <alpha-value>)",
          text: "rgb(var(--c-gold-text) / <alpha-value>)",
        },
        snow: "rgb(var(--c-snow) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      borderRadius: {
        "4xl": "2rem",
        arch: "999px 999px 2rem 2rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(43,26,20,0.05), 0 10px 30px -14px rgba(43,26,20,0.18)",
        lift: "0 2px 6px rgba(43,26,20,0.06), 0 30px 60px -24px rgba(43,26,20,0.35)",
        phone: "0 40px 80px -30px rgba(10,43,32,0.55), 0 12px 24px -12px rgba(0,0,0,0.35)",
        cta: "0 14px 30px -12px rgba(200,16,46,0.7)",
      },
      maxWidth: { page: "74rem" },
      keyframes: {
        "price-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shine: {
          "0%": { transform: "translateX(-120%) skewX(-20deg)" },
          "60%, 100%": { transform: "translateX(260%) skewX(-20deg)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-6px)" },
          "40%, 80%": { transform: "translateX(6px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "price-in": "price-in 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        marquee: "marquee 40s linear infinite",
        shine: "shine 3.6s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "fade-in": "fade-in 0.35s ease-out both",
        "fade-up": "fade-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
