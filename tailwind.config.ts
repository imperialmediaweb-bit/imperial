import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Imperial Media — „Obsidian & Fire”: negru pur + lumini portocaliu→magenta→violet
        bg: {
          DEFAULT: "#060608",  // negru obsidian
          soft: "#0D0D12",     // surface puțin mai luminos
          card: "#121218",     // pentru carduri
          border: "#26262F",   // borduri subtile
        },
        brand: {
          orange: "#FF6B1A",   // accent principal (CTA, accente)
          orangeLight: "#FF8A42",
          orangeDark: "#E0540C",
          magenta: "#FF2E9A",  // semnătura din noul branding — folosit rar
          purple: "#8B2FF7",   // accent secundar
          glow: "#B06CFF",
        },
        text: {
          DEFAULT: "#F7F6FA",
          muted: "#A6A3B2",
          subtle: "#6F6B7C",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-archivo)", "Archivo", "Inter", "system-ui", "sans-serif"],
        serifd: ["var(--font-instrument)", "Georgia", "serif"],
        jmono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse at top left, rgba(139,47,247,0.22) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(255,107,26,0.16) 0%, transparent 50%), radial-gradient(ellipse at center, rgba(255,46,154,0.07) 0%, transparent 60%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 100%)",
        // Gradientul semnătură din banner: foc → magenta → violet.
        // Păstrează numele vechi ca toate CTA-urile din site să treacă automat pe el.
        "orange-gradient":
          "linear-gradient(110deg, #FF6B1A 0%, #FF2E9A 55%, #8B2FF7 100%)",
        "imperial-gradient":
          "linear-gradient(110deg, #FF6B1A 0%, #FF2E9A 55%, #8B2FF7 100%)",
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "glow": "glow 2.5s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "marquee": "marquee 30s linear infinite",
        "spin-slow": "spin 12s linear infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255,107,26,0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(255,46,154,0.55)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-33.333%)" },
        },
      },
      boxShadow: {
        "glow-orange": "0 0 30px rgba(255,107,26,0.35)",
        "glow-magenta": "0 0 36px rgba(255,46,154,0.3)",
        "glow-purple": "0 0 40px rgba(139,47,247,0.3)",
        "card": "0 10px 40px -10px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
