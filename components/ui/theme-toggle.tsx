"use client";

import { useTheme } from "@/lib/context/theme-context";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center gap-2 rounded-[4px] border border-border bg-surface px-3 py-1.5 font-mono text-xs text-ink transition hover:bg-surface-2 ${className}`}
      title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
      aria-label="Toggle theme mode"
    >
      {theme === "light" ? (
        <>
          <Moon size={14} className="text-primary" />
          <span className="hidden sm:inline">Dark</span>
        </>
      ) : (
        <>
          <Sun size={14} className="text-primary" />
          <span className="hidden sm:inline">Light</span>
        </>
      )}
    </button>
  );
}
