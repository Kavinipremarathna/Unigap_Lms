"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  Award,
  Trophy,
  Bell,
  Tag,
  Settings,
  LogOut,
  GraduationCap,
  FileText,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/lib/context/admin-auth-context";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  superAdminOnly?: boolean;
  badge?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    label: "Overview",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Learning & Content",
    items: [
      {
        href: "/admin/courses",
        label: "Courses",
        icon: BookOpen,
      },
      {
        href: "/admin/instructors",
        label: "Instructors",
        icon: UserCheck,
        superAdminOnly: true,
      },
      {
        href: "/admin/content",
        label: "Site Content CMS",
        icon: FileText,
        badge: "CMS",
        superAdminOnly: true,
      },
      {
        href: "/admin/achievements",
        label: "Achievements",
        icon: Trophy,
        superAdminOnly: true,
      },
      {
        href: "/admin/certificates",
        label: "Certificates",
        icon: Award,
        superAdminOnly: true,
      },
      {
        href: "/admin/notifications",
        label: "Notifications",
        icon: Bell,
        superAdminOnly: true,
      },
      {
        href: "/admin/users",
        label: "Users",
        icon: Users,
        superAdminOnly: true,
      },
    ],
  },
  {
    label: "Business & System",
    items: [
      {
        href: "/admin/payments",
        label: "Payments",
        icon: CreditCard,
        superAdminOnly: true,
      },
      {
        href: "/admin/pricing",
        label: "Pricing Plans",
        icon: Tag,
        superAdminOnly: true,
      },
      {
        href: "/admin/settings",
        label: "System Settings",
        icon: Settings,
        superAdminOnly: true,
      },
    ],
  },
  {
    label: "Admin Account",
    items: [
      {
        href: "/admin/profile",
        label: "Admin Profile & RBAC",
        icon: UserCheck,
      },
    ],
  },
];

export function AdminMobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { admin, isSuperAdmin, isAdmin, setRole } = useAdminAuth();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#eee5ee] bg-white/95 px-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#eee5ee] bg-[#faf5fa] text-[#520051] transition hover:bg-[#f7ddf7] active:scale-95"
            aria-label="Open admin menu"
            aria-expanded={isOpen}
          >
            <Menu size={22} />
          </button>

          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#520051] to-[#d400d1]">
              <GraduationCap size={18} className="text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-[#520051]">UNIGAP</p>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-[#920090]">
                {isSuperAdmin ? "SUPER_ADMIN" : "ADMIN"}
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/profile"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#520051] to-[#d400d1] text-xs font-bold text-white shadow-xs"
          >
            {admin.avatar}
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-[#eee5ee] bg-[#faf5fa] px-2.5 py-1.5 text-xs font-semibold text-[#520051] hover:bg-[#f7ddf7]"
          >
            Learner View
          </Link>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 left-0 flex w-[300px] max-w-[85vw] flex-col border-r border-[#e8dce8] bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-[#eee5ee] px-5">
              <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#520051] to-[#d400d1]">
                  <GraduationCap size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-base font-bold text-[#520051]">UNIGAP</p>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-[#920090]">
                    Admin Portal
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close admin menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Profile & Role Switcher in Drawer */}
            <div className="border-b border-[#eee5ee] bg-[#faf5fa] p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#520051] text-xs font-bold text-white">
                    {admin.avatar}
                  </div>
                  <div className="min-w-0 truncate">
                    <p className="truncate text-xs font-bold text-[#520051]">{admin.name}</p>
                    <p className="truncate text-[10px] text-slate-500">
                      {isSuperAdmin ? "SUPER_ADMIN" : "ADMIN"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setRole(isSuperAdmin ? "admin" : "super_admin")}
                  className="rounded-lg border border-[#d400d1]/30 bg-[#fde8fc] px-2 py-1 text-[10px] font-bold text-[#920090]"
                  title="Toggle Super Admin vs Admin"
                >
                  Switch Role
                </button>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              {navigation.map((section) => {
                const visibleItems = section.items.filter(
                  (item) => isSuperAdmin || !item.superAdminOnly
                );

                if (visibleItems.length === 0) return null;

                return (
                  <div key={section.label} className="mb-5">
                    <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {section.label}
                    </p>
                    <div className="space-y-1">
                      {visibleItems.map((item) => {
                        const Icon = item.icon;
                        const active =
                          item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all",
                              active
                                ? "bg-[#f7ddf7] text-[#920090]"
                                : "text-slate-600 hover:bg-[#faf5fa] hover:text-[#520051]"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Icon size={18} />
                              <span>{item.label}</span>
                            </div>

                            {item.badge && (
                              <span className="rounded-md bg-[#fde8fc] px-1.5 py-0.5 text-[9px] font-extrabold text-[#920090]">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>

            <div className="border-t border-[#eee5ee] p-4 space-y-2">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-[#faf5fa] hover:text-[#520051]"
              >
                Switch to Learner Dashboard
              </Link>
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-[#faf5fa] hover:text-[#520051]"
              >
                <LogOut size={16} />
                Back to Website
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
