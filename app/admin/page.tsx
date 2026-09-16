"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  CreditCard,
  Award,
  Plus,
  Activity,
  CheckCircle2,
  DollarSign,
  UserCheck,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminStats } from "@/lib/services/api.service";

interface AdminStatsState {
  totalUsers: number;
  activeCourses: number;
  totalInstructors: number;
  totalRevenue: number;
  issuedCertificates: number;
  totalEnrollments: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStatsState>({
    totalUsers: 0,
    activeCourses: 0,
    totalInstructors: 0,
    totalRevenue: 0,
    issuedCertificates: 0,
    totalEnrollments: 0,
  });

  const loadStats = async () => {
    const data = await getAdminStats();
    setStats(data);
  };

  useEffect(() => {
    loadStats();
    window.addEventListener("unigap_courses_updated", loadStats);
    window.addEventListener("unigap_instructors_updated", loadStats);
    window.addEventListener("unigap_users_updated", loadStats);
    return () => {
      window.removeEventListener("unigap_courses_updated", loadStats);
      window.removeEventListener("unigap_instructors_updated", loadStats);
      window.removeEventListener("unigap_users_updated", loadStats);
    };
  }, []);

  const statsCards = [
    {
      label: "Total Registered Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
    },
    {
      label: "Active Courses",
      value: stats.activeCourses.toLocaleString(),
      icon: BookOpen,
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      label: "Issued Certificates",
      value: stats.issuedCertificates.toLocaleString(),
      icon: Award,
    },
  ];

  return (
    <AdminShell>
      <main className="container-app px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <p className="text-xs font-mono font-bold text-[#920090] dark:text-[#f14df0] uppercase tracking-wider">Platform Overview</p>
            <h1 className="mt-1 font-heading text-3xl font-extrabold text-ink sm:text-4xl">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Real-time UNIGAP Learn Admin Management System.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/courses/create"
              className="inline-flex items-center gap-2 rounded-xl bg-[#520051] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#920090] dark:bg-[#920090] dark:hover:bg-[#d400d1] cursor-pointer"
            >
              <Plus size={18} />
              Create New Course
            </Link>
          </div>
        </div>

        {/* Key Performance Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statsCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-3xl border border-border/80 bg-surface p-6 shadow-xs transition-all hover:shadow-md hover:border-[#920090]/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#520051]/15 text-[#920090] dark:bg-[#520051] dark:text-[#fde8fc]">
                    <Icon size={22} />
                  </div>
                </div>

                <p className="mt-5 text-xs font-mono font-bold text-ink-muted uppercase tracking-wider">{stat.label}</p>
                <p className="mt-1 font-mono text-3xl font-extrabold text-ink">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Analytics & Platform Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Revenue Chart / Stats Breakdown */}
          <div className="lg:col-span-2 rounded-3xl border border-border/80 bg-surface p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div>
                <h2 className="font-heading text-xl font-bold text-ink">Platform Metrics</h2>
                <p className="text-xs text-ink-muted">Live system metrics & entity counts</p>
              </div>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                Live Backend Connected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/80 bg-surface-2 p-5 text-center">
                <p className="text-xs font-mono font-bold text-ink-muted">Registered Instructors</p>
                <p className="mt-2 font-mono text-3xl font-extrabold text-ink">{stats.totalInstructors}</p>
              </div>
              <div className="rounded-2xl border border-border/80 bg-surface-2 p-5 text-center">
                <p className="text-xs font-mono font-bold text-ink-muted">Course Enrollments</p>
                <p className="mt-2 font-mono text-3xl font-extrabold text-ink">{stats.totalEnrollments}</p>
              </div>
              <div className="rounded-2xl border border-border/80 bg-surface-2 p-5 text-center col-span-2 sm:col-span-1">
                <p className="text-xs font-mono font-bold text-ink-muted">Active System Users</p>
                <p className="mt-2 font-mono text-3xl font-extrabold text-ink">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          {/* Platform System Health */}
          <div className="rounded-3xl border border-border/80 bg-surface p-7 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <h2 className="font-heading text-xl font-bold text-ink">System Health</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 size={13} /> Operational
                </span>
              </div>

              <div className="mt-6 space-y-4 text-xs font-mono">
                <div className="flex justify-between border-b border-border/60 pb-3">
                  <span className="text-ink-muted font-bold">Database Connection</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Ready</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-3">
                  <span className="text-ink-muted font-bold">API Gateway</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Active</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-3">
                  <span className="text-ink-muted font-bold">Certificates Engine</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Online</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 text-center">
              <p className="text-xs font-mono text-ink-muted">UNIGAP Learn Platform 2026</p>
            </div>
          </div>
        </div>
      </main>
    </AdminShell>
  );
}
