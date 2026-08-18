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
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        error: "hsl(var(--error))",
        brand: {
          plum: "#520051",
          purple: "#920090",
          magenta: "#D400D1",
          light: "#FDE8FC",
          white: "#FFFFFF",
        },
        streak: "hsl(var(--streak))",
        xp: "hsl(var(--xp))",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
        elevated: "0 4px 12px rgba(16,24,40,0.08), 0 2px 4px rgba(16,24,40,0.04)",
        glow: "0 0 0 4px hsl(var(--primary) / 0.12)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "60%": { transform: "scale(1.04)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 hsl(var(--primary) / 0.35)" },
          "100%": { boxShadow: "0 0 0 10px hsl(var(--primary) / 0)" },
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
