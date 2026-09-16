"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Sparkles, BookOpen, Search, UserCheck } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSiteContent } from "@/lib/context/site-content-context";
import { isUserAuthenticated, getAuthenticatedUser, AuthUser } from "@/lib/services/auth.service";

const links = [
  { href: "/courses", label: "Explore Courses" },
  { href: "/pricing", label: "Pricing & Plans" },
  { href: "/achievements", label: "Achievements" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const pathname = usePathname();
  const { landing } = useSiteContent();

  useEffect(() => {
    const checkAuth = () => {
      if (isUserAuthenticated()) {
        setUser(getAuthenticatedUser());
      } else {
        setUser(null);
      }
    };
    checkAuth();
    window.addEventListener("unigap_auth_changed", checkAuth);
    return () => window.removeEventListener("unigap_auth_changed", checkAuth);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-bg/85 backdrop-blur-xl transition-colors">
      {landing.bannerActive && landing.bannerText && (
        <div className="border-b border-[#920090]/20 bg-gradient-to-r from-[#520051]/10 via-[#920090]/15 to-[#520051]/10 px-4 py-2 text-center text-xs font-mono font-bold text-[#520051] dark:text-[#fde8fc]">
          <Link
            href={landing.bannerLink || "/pricing"}
            className="inline-flex items-center justify-center gap-2 hover:underline"
          >
            <Sparkles size={14} className="text-[#920090] animate-pulse" />
            <span>{landing.bannerText}</span>
            <ArrowRight size={13} className="shrink-0 text-[#920090]" />
          </Link>
        </div>
      )}

      <div className="container-app flex h-16 items-center justify-between">
        <Link href="/" aria-label="UNIGAP home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:gap-2 md:flex" aria-label="Main navigation">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#520051]/10 text-[#520051] dark:bg-[#520051] dark:text-[#fde8fc]"
                    : "text-ink-muted hover:bg-surface-2 hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {user ? (
            <Link href="/dashboard">
              <Button size="sm" className="gap-2 rounded-xl">
                <UserCheck size={16} /> My Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>

              <Link href="/register">
                <Button size="sm">Get Started Free</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="rounded-xl p-2 text-ink hover:bg-surface-2 transition"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-surface/95 backdrop-blur-lg md:hidden">
          <nav className="container-app flex flex-col gap-1.5 py-4" aria-label="Mobile navigation">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-ink-muted hover:bg-surface-2 hover:text-ink"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 px-1 pt-2 border-t border-border">
              {user ? (
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full justify-center gap-2">
                    <UserCheck size={16} /> Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" className="flex-1" onClick={() => setOpen(false)}>
                    <Button variant="secondary" size="sm" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1" onClick={() => setOpen(false)}>
                    <Button size="sm" className="w-full">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}


