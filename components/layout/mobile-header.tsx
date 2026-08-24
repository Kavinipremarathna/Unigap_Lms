"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Compass,
  Trophy,
  Award,
  Bell,
  User,
  Settings,
  LogOut,
  Flame,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/courses", label: "Explore Courses", icon: Compass },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/certificates", label: "Certificates", icon: Award },
  { href: "/notifications", label: "Notifications", icon: Bell, badge: "3" },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Sticky Mobile Top Navigation Bar */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-bg/95 px-4 backdrop-blur-md lg:hidden transition-colors">
        {/* Left: 3-line hamburger menu button + UNIGAP logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-border bg-surface text-ink transition-colors hover:bg-surface-2 active:scale-95"
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
            id="mobile-menu-trigger"
          >
            <Menu size={22} className="stroke-[2]" />
          </button>

          <Link href="/dashboard" className="flex items-center" aria-label="UNIGAP Dashboard">
            <Logo />
          </Link>
        </div>

        {/* Right: Theme Toggle + Notification Bell + User Avatar */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Link
            href="/notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink transition-colors hover:bg-surface-2"
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-mono font-bold text-primary-fg">
              3
            </span>
          </Link>

          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-mono font-bold text-primary-fg ring-2 ring-primary/20 transition-transform active:scale-95"
            aria-label="View profile"
          >
            JD
          </Link>
        </div>
      </header>

      {/* Slide-over Navigation Drawer Backdrop & Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer sheet container */}
          <div className="fixed inset-y-0 left-0 flex w-[300px] max-w-[85vw] flex-col bg-surface border-r border-border shadow-2xl transition-transform duration-300 ease-in-out">
            {/* Drawer Header */}
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                <Logo />
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-[4px] text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
                aria-label="Close navigation menu"
                id="mobile-menu-close"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Profile Mini Banner */}
            <div className="border-b border-border bg-surface-2 p-4">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-[4px] p-2 transition-colors hover:bg-surface"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-mono font-bold text-primary-fg">
                  JD
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">Jordan Diaz</p>
                  <p className="truncate text-xs font-mono text-ink-muted">Level 8 · Pro plan</p>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] font-mono">
                    <span className="inline-flex items-center gap-0.5 font-bold text-primary">
                      <Flame size={13} className="fill-primary" /> 7d streak
                    </span>
                    <span className="inline-flex items-center gap-0.5 font-bold text-accent">
                      <Zap size={13} className="fill-accent" /> 1,240 XP
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Navigation links list */}
            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile menu navigation">
              <p className="mb-2 px-3 text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted">
                Menu
              </p>
              <div className="space-y-1">
                {navItems.map((item) => {
                  const active =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-[4px] px-3.5 py-3 text-sm font-medium transition-all",
                        active
                          ? "bg-primary/15 text-primary border border-primary/30"
                          : "text-ink-muted hover:bg-surface-2 hover:text-ink"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={19}
                          className={active ? "text-primary" : "text-ink-muted"}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/15 px-1.5 text-xs font-mono font-semibold text-primary border border-primary/30">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Drawer Footer / Log Out */}
            <div className="border-t border-border p-4">
              <Link href="/login" onClick={() => setIsOpen(false)} className="block w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2 text-ink-muted hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/40"
                >
                  <LogOut size={16} />
                  <span>Log out</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


