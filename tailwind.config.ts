import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg))",
        surface: "hsl(var(--surface))",
        "surface-2": "hsl(var(--surface-2))",
        border: "hsl(var(--border))",
        ink: "hsl(var(--ink))",
        "ink-muted": "hsl(var(--ink-muted))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          fg: "hsl(var(--primary-fg))",
          50: "hsl(var(--primary-50))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          fg: "hsl(var(--accent-fg))",
        },
        brass: {
          DEFAULT: "#C79D5D",
          hover: "#D8AE6E",
          dim: "#8A6A3B",
        },
        moss: {
          DEFAULT: "#8FB088",
          dim: "#4F6B4C",
        },
        parchment: "#ECE7DB",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        error: "hsl(var(--error))",
        brand: {
          plum: "#14171B",
          purple: "#C79D5D",
          magenta: "#C79D5D",
          light: "#191D22",
          white: "#ECE7DB",
        },
        streak: "#C79D5D",
        xp: "#8FB088",
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "4px",
        lg: "4px",
        xl: "4px",
        "2xl": "4px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.3)",
        elevated: "0 4px 20px rgba(0,0,0,0.5)",
        glow: "0 0 0 2px #C79D5D",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Fraunces", "Georgia", "serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "60%": { transform: "scale(1.04)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(199, 157, 93, 0.35)" },
          "100%": { boxShadow: "0 0 0 10px rgba(199, 157, 93, 0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        pop: "pop 0.4s cubic-bezier(.22,1,.36,1) both",
        "pulse-ring": "pulse-ring 1.6s cubic-bezier(0,0,0.2,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
