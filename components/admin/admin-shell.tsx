"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Lock, ArrowLeft, ShieldAlert, BookOpen } from "lucide-react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminMobileHeader } from "./admin-mobile-header";
import {
  useAdminAuth,
  isRouteAllowedForRole,
} from "@/lib/context/admin-auth-context";

function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, isSuperAdmin, isAdmin, isUser } = useAdminAuth();

  const isAllowed = isRouteAllowedForRole(pathname, role);

  if (isUser) {
    return (
      <main className="container-app px-6 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-purple-200 bg-purple-50/60 p-8 text-center shadow-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#520051] text-white">
            <Lock size={32} />
          </div>

          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#fde8fc] px-3 py-1 text-xs font-extrabold text-[#920090] uppercase tracking-wider">
            UNIGAP Administration Access
          </span>

          <h2 className="mt-3 text-2xl font-extrabold text-[#520051]">
            Admin Panel Access Required
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            You are currently viewing as a Learner. Click below to activate Super Admin session mode and access all admin features.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.setItem("unigap_admin_role", "super_admin");
                  localStorage.setItem(
                    "unigap_admin_profile",
                    JSON.stringify({
                      id: "adm-001",
                      name: "UNIGAP Super Admin",
                      email: "superadmin@unigap.edu",
                      role: "super_admin",
                    })
                  );
                  window.location.reload();
                }
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#520051] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#920090] shadow-md cursor-pointer"
            >
              👑 Enter Super Admin Portal Directly
            </button>

            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-[#520051] transition hover:bg-slate-50 shadow-xs"
            >
              Go to Admin Login Page
            </Link>
          </div>
        </div>
      </main>
    );
  }


  // If an ADMIN attempts a non-allowed admin route (e.g. /admin/users, /admin/payments, /admin/instructors, etc.)
  if (!isAllowed) {
    return (
      <main className="container-app px-6 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-red-50/60 p-8 text-center shadow-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-700">
            <Lock size={32} />
          </div>

          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-extrabold text-red-800 uppercase tracking-wider">
            <ShieldAlert size={14} /> 403 Access Denied
          </span>

          <h2 className="mt-3 text-2xl font-extrabold text-[#520051]">
            Super Admin Access Required
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            Your account role (<strong>ADMIN</strong>) is restricted to Course Management. You do not have permission to access <strong>{pathname}</strong>.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl bg-[#520051] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#920090] shadow-xs"
            >
              <ArrowLeft size={15} /> Return to Admin Dashboard
            </Link>

            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-[#520051] transition hover:bg-slate-50 shadow-xs"
            >
              <BookOpen size={15} /> Courses Management
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#faf7fb]">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileHeader />
        <AdminRouteGuard>
          <main className="flex-1">{children}</main>
        </AdminRouteGuard>
      </div>
    </div>
  );
}