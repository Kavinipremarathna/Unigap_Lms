"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronRight,
  Search,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  Home,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getAuthenticatedUser, AuthUser } from "@/lib/services/auth.service";

interface DashboardTopNavProps {
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

// Helper to format breadcrumb segment label
function formatSegmentLabel(segment: string): string {
  if (segment === "dashboard") return "Dashboard";
  if (segment === "courses") return "Courses";
  if (segment === "achievements") return "Achievements";
  if (segment === "certificates") return "Certificates";
  if (segment === "notifications") return "Notifications";
  if (segment === "profile") return "Profile";
  if (segment === "settings") return "Settings";
  // Replace hyphens and capitalize
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function DashboardTopNav({
  isSidebarCollapsed = false,
  onToggleSidebar,
}: DashboardTopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setCurrentUser(getAuthenticatedUser());
    const handleAuthChange = () => setCurrentUser(getAuthenticatedUser());
    window.addEventListener("unigap_auth_changed", handleAuthChange);
    return () => window.removeEventListener("unigap_auth_changed", handleAuthChange);
  }, []);

  const displayName = currentUser?.name || "Learner";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .substring(0, 2)
    .toUpperCase() || "U";

  // Generate breadcrumb segments from pathname
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-bg/95 px-4 lg:px-6 backdrop-blur-md transition-colors">
      {/* LEFT: Sidebar Show/Hide Toggle + Upper Breadcrumb Navigation Path */}
      <div className="flex items-center gap-3">
        {/* Sidebar Show/Hide Toggle (Desktop) */}
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="hidden lg:flex h-9 w-9 items-center justify-center rounded-[4px] border border-border bg-surface text-ink-muted hover:bg-surface-2 hover:text-ink transition-colors"
            title={isSidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
            aria-label={isSidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        )}

        {/* Upper Breadcrumb Navigation Path */}
        <nav className="flex items-center gap-1.5 text-xs font-mono" aria-label="Breadcrumb">
          <Link
            href="/"
            className="flex items-center gap-1 text-ink-muted hover:text-primary transition-colors"
            title="Home"
          >
            <Home size={14} />
            <span className="hidden md:inline">Home</span>
          </Link>

          {segments.map((segment, index) => {
            const href = "/" + segments.slice(0, index + 1).join("/");
            const isLast = index === segments.length - 1;
            const label = formatSegmentLabel(segment);

            return (
              <div key={href} className="flex items-center gap-1.5">
                <ChevronRight size={13} className="text-border-hover shrink-0" />
                {isLast ? (
                  <span className="font-semibold text-primary">{label}</span>
                ) : (
                  <Link
                    href={href}
                    className="text-ink-muted hover:text-ink transition-colors"
                  >
                    {label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* RIGHT: Quick Search Bar + Notification Bell + Theme Toggle + User Badge */}
      <div className="flex items-center gap-2.5">
        {/* Quick Search trigger */}
        <div className="relative hidden md:flex items-center">
          <Search size={15} className="absolute left-3 text-ink-muted" />
          <input
            type="text"
            placeholder="Search courses or lessons..."
            className="h-9 w-56 rounded-[4px] border border-border bg-surface pl-9 pr-8 text-xs text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none transition-colors"
          />
          <span className="absolute right-2.5 rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-mono text-ink-muted">
            ⌘K
          </span>
        </div>

        {/* Notification Bell */}
        <Link
          href="/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink transition-colors hover:bg-surface-2"
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-mono font-bold text-primary-fg">
            3
          </span>
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile avatar link */}
        <Link
          href="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-mono font-bold text-primary-fg ring-2 ring-primary/20 transition-transform active:scale-95"
          aria-label="View profile"
          title={displayName}
        >
          {initials}
        </Link>
      </div>
    </header>
  );
}

