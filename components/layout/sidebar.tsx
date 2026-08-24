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
        "sticky top-0 hidden h-screen shrink-0 border-r border-border bg-surface lg:flex lg:flex-col transition-all duration-300 z-30",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Sidebar Top Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!isCollapsed ? (
          <Link href="/dashboard" className="flex items-center">
            <Logo />
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-[4px] bg-primary font-serif font-bold text-primary-fg text-lg shadow-sm"
            title="UNIGAP Dashboard"
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
                "flex items-center gap-3 rounded-[4px] py-2.5 text-sm font-medium transition-all group relative",
                isCollapsed ? "justify-center px-0" : "px-3.5",
                active
                  ? "bg-primary/15 text-primary border border-primary/30 font-semibold"
                  : "text-ink-muted hover:bg-surface-2 hover:text-ink"
              )}
            >
              <Icon
                size={19}
                className={cn(
                  "shrink-0 transition-transform group-hover:scale-110",
                  active ? "text-primary" : "text-ink-muted"
                )}
              />
              {!isCollapsed && <span className="truncate">{item.label}</span>}

              {/* Tooltip on collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2.5 hidden rounded-[4px] bg-ink px-2.5 py-1 text-xs font-mono text-bg shadow-md group-hover:block z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-border p-3">
        <Link
          href="/profile"
          className={cn(
            "flex items-center rounded-[4px] bg-surface-2 border border-border transition-colors hover:border-border-hover",
            isCollapsed ? "justify-center p-2" : "gap-3 p-2.5"
          )}
          title={isCollapsed ? `${displayName} (Profile)` : undefined}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-mono font-bold text-primary-fg ring-2 ring-primary/20">
            {initials}
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{displayName}</p>
              <p className="truncate text-xs font-mono text-ink-muted">Level {userLevel} · Member</p>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}




