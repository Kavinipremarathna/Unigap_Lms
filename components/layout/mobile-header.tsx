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
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-surface/95 px-4 backdrop-blur-md lg:hidden">
        {/* Left: 3-line hamburger menu button + UNIGAP logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-2 text-ink transition-colors hover:bg-border/40 focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-95"
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
            id="mobile-menu-trigger"
          >
            <Menu size={22} className="stroke-[2.2]" />
          </button>

          <Link href="/dashboard" className="flex items-center" aria-label="UNIGAP Dashboard">
            <Logo />
          </Link>
        </div>

        {/* Right: Notification Bell + User Avatar Quick Link */}
        <div className="flex items-center gap-2">
          <Link
            href="/notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink transition-colors hover:bg-surface-2"
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white shadow-sm">
              3
            </span>
          </Link>

          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#520051] to-[#d400d1] text-xs font-bold text-white shadow-sm ring-2 ring-primary/20 transition-transform active:scale-95"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
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
                className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Close navigation menu"
                id="mobile-menu-close"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Profile Mini Banner */}
            <div className="border-b border-border bg-surface-2/60 p-4">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#520051] to-[#d400d1] text-sm font-bold text-white shadow-sm">
                  JD
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">Jordan Diaz</p>
                  <p className="truncate text-xs text-ink-muted">Level 8 · Pro plan</p>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                    <span className="inline-flex items-center gap-0.5 font-bold text-streak">
                      <Flame size={13} className="fill-streak" /> 7d streak
                    </span>
                    <span className="inline-flex items-center gap-0.5 font-bold text-xp">
                      <Zap size={13} className="fill-xp" /> 1,240 XP
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Navigation links list */}
            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile menu navigation">
              <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
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
                        "flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all",
                        active
                          ? "bg-primary-50 text-primary font-semibold shadow-sm"
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
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-semibold text-primary">
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
                  className="w-full flex items-center justify-center gap-2 text-ink-muted hover:text-error hover:border-error/40"
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
