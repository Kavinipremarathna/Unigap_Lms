"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Trophy,
  Award,
  Bell,
  User,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { getAuthenticatedUser, AuthUser } from "@/lib/services/auth.service";
import { getUserStats } from "@/lib/services/user-progress";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/courses", label: "Explore Courses", icon: Compass },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/certificates", label: "Certificates", icon: Award },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userLevel, setUserLevel] = useState<number>(1);

  const loadUserData = () => {
    const u = getAuthenticatedUser();
    setCurrentUser(u);
    const stats = getUserStats();
    setUserLevel(stats.level || 1);
  };

  useEffect(() => {
    loadUserData();
    window.addEventListener("unigap_auth_changed", loadUserData);
    window.addEventListener("unigap_user_stats_updated", loadUserData);
    return () => {
      window.removeEventListener("unigap_auth_changed", loadUserData);
      window.removeEventListener("unigap_user_stats_updated", loadUserData);
    };
  }, []);

  const displayName = currentUser?.name || "Learner";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .substring(0, 2)
    .toUpperCase() || "U";

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 border-r border-border/80 bg-surface lg:flex lg:flex-col transition-all duration-300 z-30",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Sidebar Top Header */}
      <div className="flex h-16 items-center justify-between border-b border-border/80 px-4">
        {!isCollapsed ? (
          <Link href="/dashboard" className="flex items-center">
            <Logo />
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#520051] to-[#920090] font-heading font-extrabold text-white text-lg shadow-md"
            title="UNIGAP Learn Dashboard"
          >
            U
          </Link>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto" aria-label="Dashboard navigation">
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
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl py-3 text-sm font-semibold transition-all group relative",
                isCollapsed ? "justify-center px-0" : "px-3.5",
                active
                  ? "bg-[#520051]/10 text-[#520051] dark:bg-[#520051] dark:text-[#fde8fc] border border-[#520051]/20 font-bold shadow-2xs"
                  : "text-ink-muted hover:bg-surface-2 hover:text-ink"
              )}
            >
              <Icon
                size={19}
                className={cn(
                  "shrink-0 transition-transform group-hover:scale-110",
                  active ? "text-[#920090] dark:text-[#f14df0]" : "text-ink-muted"
                )}
              />
              {!isCollapsed && <span className="truncate">{item.label}</span>}

              {/* Tooltip on collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 hidden rounded-xl bg-ink px-3 py-1.5 text-xs font-mono text-bg shadow-xl group-hover:block z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-border/80 p-3">
        <Link
          href="/profile"
          className={cn(
            "flex items-center rounded-xl bg-surface-2 border border-border/80 transition-all hover:border-[#920090]/40",
            isCollapsed ? "justify-center p-2" : "gap-3 p-2.5"
          )}
          title={isCollapsed ? `${displayName} (Profile)` : undefined}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#520051] text-xs font-mono font-bold text-white ring-2 ring-[#920090]/30 shadow-xs">
            {initials}
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">{displayName}</p>
              <p className="truncate text-xs font-mono text-ink-muted">Level {userLevel} · Member</p>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}




