"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
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

export function AdminSidebar() {
  const pathname = usePathname();
  const { admin, isSuperAdmin } = useAdminAuth();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[#e8dce8] bg-white lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-[#eee5ee] px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#520051] to-[#d400d1] shadow-xs">
            <GraduationCap size={20} className="text-white" />
          </div>

          <div>
            <p className="text-lg font-bold text-[#520051]">UNIGAP</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#920090]">
              Admin Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Role Indicator Banner */}
      <div className="border-b border-[#eee5ee] bg-[#faf5fa] px-4 py-2.5">
        <Link
          href="/admin/profile"
          className="flex items-center justify-between gap-2 rounded-lg p-1 transition hover:bg-[#fde8fc]"
          title="Click to manage RBAC role & profile"
        >
          <div className="flex items-center gap-2 min-w-0">
            {isSuperAdmin ? (
              <ShieldAlert size={14} className="text-amber-600 shrink-0" />
            ) : (
              <ShieldCheck size={14} className="text-[#920090] shrink-0" />
            )}
            <span className="truncate text-xs font-bold text-[#520051]">
              {isSuperAdmin ? "SUPER_ADMIN" : "ADMIN"}
            </span>
          </div>
          <span className="shrink-0 rounded-md bg-[#fde8fc] px-1.5 py-0.5 text-[9px] font-extrabold text-[#920090]">
            RBAC
          </span>
        </Link>
      </div>

      {/* Navigation */}
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
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all",
                        active
                          ? "bg-[#f7ddf7] text-[#920090]"
                          : "text-slate-600 hover:bg-[#faf5fa] hover:text-[#520051]"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon size={17} className="shrink-0" />
                        <span className="truncate">{item.label}</span>
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

      {/* Admin User Footer / Profile */}
      <div className="border-t border-[#eee5ee] p-3 space-y-2">
        <Link
          href="/admin/profile"
          className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-[#faf5fa]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#520051] to-[#d400d1] text-xs font-bold text-white shadow-xs">
            {admin.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-[#520051]">{admin.name}</p>
            <p className="truncate text-[10px] text-slate-500">
              {isSuperAdmin ? "SUPER_ADMIN" : "ADMIN"}
            </p>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-[#faf5fa] hover:text-[#520051]"
        >
          <LogOut size={15} />
          Back to Website
        </Link>
      </div>
    </aside>
  );
}
