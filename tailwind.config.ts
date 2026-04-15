import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Imperial Media — dark purple base + orange accent
        bg: {
          DEFAULT: "#0E0617",  // fundal foarte închis (purple-black)
          soft: "#1A0E2E",     // surface puțin mai luminos
          card: "#1F1338",     // pentru carduri
          border: "#2D1F4E",   // borduri subtile
        },
        brand: {
          orange: "#FF6B1A",   // accent principal (CTA, accente)
          orangeLight: "#FF8A42",
          orangeDark: "#E0540C",
          purple: "#7B2FF7",   // accent secundar
          glow: "#A855F7",
        },
        text: {
          DEFAULT: "#F5F0FA",
          muted: "#A89DBE",
          subtle: "#7A6F92",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse at top left, rgba(123,47,247,0.25) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(255,107,26,0.18) 0%, transparent 50%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 100%)",
        "orange-gradient":
          "linear-gradient(135deg, #FF6B1A 0%, #E0540C 100%)",
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "glow": "glow 2.5s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255,107,26,0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(255,107,26,0.7)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        "glow-orange": "0 0 30px rgba(255,107,26,0.35)",
        "glow-purple": "0 0 40px rgba(123,47,247,0.3)",
        "card": "0 10px 40px -10px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
