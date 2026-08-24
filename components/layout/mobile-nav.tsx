"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Trophy, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/dashboard/courses",
    label: "Courses",
    icon: Compass,
  },
  {
    href: "/achievements",
    label: "Badges",
    icon: Trophy,
  },
  {
    href: "/notifications",
    label: "Alerts",
    icon: Bell,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-bg/95 backdrop-blur-md lg:hidden transition-colors"
      aria-label="Bottom navigation"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-mono font-medium transition-colors",
              active ? "text-primary font-semibold" : "text-ink-muted hover:text-ink"
            )}
          >
            <Icon size={19} className={active ? "text-primary" : "text-ink-muted"} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}


