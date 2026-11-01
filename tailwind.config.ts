import type { Config } from "tailwindcss";

/**
 * Tema "Confeitaria de Natal": marfim + verde-pinheiro + vermelho-cereja + dourado.
 * Cereja (berry) é usada SOMENTE em ações (botões de compra).
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: { DEFAULT: "#FFF8EE", deep: "#F6EADA" },
        cocoa: { DEFAULT: "#2B1A14", soft: "#5C4438", muted: "#76604F" },
        pine: { DEFAULT: "#0F3D2E", deep: "#0A2B20", soft: "#E4EFE8", line: "#1E5541" },
        berry: { DEFAULT: "#C8102E", hover: "#A50D26", soft: "#FBE3E6" },
        gold: { DEFAULT: "#D4A24C", light: "#F2D79B", text: "#8A6418" },
        snow: "#FFF3E0",
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
