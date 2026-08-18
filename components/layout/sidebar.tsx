"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Trophy, Award, Bell, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/courses", label: "Explore Courses", icon: Compass },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/certificates", label: "Certificates", icon: Award },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-surface lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/"><Logo /></Link>
      </div>
      <nav className="flex-1 space-y-1 p-4" aria-label="Dashboard navigation">
        {items.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary-50 text-primary"
                  : "text-ink-muted hover:bg-surface-2 hover:text-ink"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-md p-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#520051] to-[#d400d1] text-sm font-semibold text-white shadow-sm">
            JD
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">Jordan Diaz</p>
            <p className="truncate text-xs text-ink-muted">Level 8 · Pro plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
