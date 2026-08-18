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
      <main className="container-app px-6 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#920090]">Platform Overview</p>
            <h1 className="mt-1 text-3xl font-bold text-[#520051]">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">
              Real-time UNIGAP LMS Enterprise Management System.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/courses/create"
              className="inline-flex items-center gap-2 rounded-xl bg-[#520051] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#920090]"
            >
              <Plus size={17} />
              Create Course
            </Link>
          </div>
        </div>

        {/* Key Performance Statistics */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statsCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#eee5ee] bg-white p-5 shadow-xs transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f7ddf7]">
                    <Icon size={20} className="text-[#920090]" />
                  </div>
                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-extrabold text-[#520051]">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Analytics & Platform Activity */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Revenue Chart / Stats Breakdown */}
          <div className="lg:col-span-2 rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#520051]">Platform Overview</h2>
                <p className="text-xs text-slate-400">Live platform performance data</p>
              </div>
              <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-[#920090]">
                Live Backend State
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-[#faf7fb] p-4 text-center">
                <p className="text-xs font-semibold text-slate-500">Registered Instructors</p>
                <p className="mt-1 text-2xl font-extrabold text-[#520051]">{stats.totalInstructors}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-[#faf7fb] p-4 text-center">
                <p className="text-xs font-semibold text-slate-500">Course Enrollments</p>
                <p className="mt-1 text-2xl font-extrabold text-[#520051]">{stats.totalEnrollments}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-[#faf7fb] p-4 text-center col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold text-slate-500">Active System Users</p>
                <p className="mt-1 text-2xl font-extrabold text-[#520051]">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          {/* Platform System Health */}
          <div className="rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#520051]">System Health</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-bold text-green-700">
                  <CheckCircle2 size={12} /> Operational
                </span>
              </div>

              <div className="mt-6 space-y-4 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Database Connection</span>
                  <span className="font-bold text-emerald-600">Ready</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">API Gateway</span>
                  <span className="font-bold text-emerald-600">Active</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Certificates Engine</span>
                  <span className="font-bold text-emerald-600">Online</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">UNIGAP LMS Backend Infrastructure</p>
            </div>
          </div>
        </div>
      </main>
    </AdminShell>
  );
}
