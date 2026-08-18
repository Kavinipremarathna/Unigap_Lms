"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  User,
  ArrowLeft,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Flame,
  BookOpen,
  Award,
  Calendar,
  Clock,
  Edit,
  CheckCircle2,
  AlertOctagon,
  Key,
  Lock,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { mockAdminUsers, AdminUser } from "@/lib/mock/admin";
import { useAdminAuth } from "@/lib/context/admin-auth-context";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = (params?.id as string) || "usr-1";
  const { isSuperAdmin, isAdmin, addActivity } = useAdminAuth();

  const initialUser = mockAdminUsers.find((u) => u.id === userId) || mockAdminUsers[0];
  const [user, setUser] = useState<AdminUser>(initialUser);
  const [editingXp, setEditingXp] = useState(false);
  const [xpVal, setXpVal] = useState(user.xp);
  const [streakVal, setStreakVal] = useState(user.streak);
  const [actionSuccess, setActionSuccess] = useState("");

  const toggleUserStatus = () => {
    if (!isSuperAdmin) return;
    const newStatus = user.status === "active" ? "suspended" : "active";
    setUser((prev) => ({ ...prev, status: newStatus }));
    addActivity(
      newStatus === "suspended" ? "Suspended Learner Account" : "Reactivated Learner Account",
      `${user.name} (${user.email})`
    );
    setActionSuccess(`Account status updated to ${newStatus}.`);
    setTimeout(() => setActionSuccess(""), 3000);
  };

  const changeUserRole = (newRole: AdminUser["role"]) => {
    if (!isSuperAdmin) return;
    setUser((prev) => ({ ...prev, role: newRole }));
    addActivity("Modified Learner Role", `Set ${user.name} to ${newRole}`);
    setActionSuccess(`User role changed to ${newRole}.`);
    setTimeout(() => setActionSuccess(""), 3000);
  };

  const handleSaveStats = () => {
    if (!isSuperAdmin) return;
    setUser((prev) => ({ ...prev, xp: xpVal, streak: streakVal }));
    setEditingXp(false);
    addActivity("Adjusted Learner Stats", `Updated XP: ${xpVal}, Streak: ${streakVal} for ${user.name}`);
    setActionSuccess("Learner gamification stats updated.");
    setTimeout(() => setActionSuccess(""), 3000);
  };

  return (
    <AdminShell>
      <main className="container-app px-4 py-8 lg:px-8">
        {/* Back link */}
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#920090] hover:underline"
        >
          <ArrowLeft size={15} /> Back to All Users
        </Link>

        {actionSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 animate-fade-in shadow-sm">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            {actionSuccess}
          </div>
        )}

        {/* Profile Card Header */}
        <div className="mt-4 rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-[#520051] to-[#d400d1] text-2xl font-black text-white shadow-lg">
                {user.avatar}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-[#520051]">{user.name}</h1>
                  <span className="rounded-md bg-[#fde8fc] px-2.5 py-0.5 text-xs font-bold uppercase text-[#920090]">
                    {user.role}
                  </span>
                  <span
                    className={`rounded-md px-2.5 py-0.5 text-xs font-bold capitalize ${
                      user.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <Mail size={14} className="text-slate-400" /> {user.email}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Joined: {user.joinedDate} • Last Active: {user.lastActive} • Plan: {user.plan}
                </p>
              </div>
            </div>

            {/* Actions / Privacy Protection */}
            {isSuperAdmin ? (
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={user.role}
                  onChange={(e) => changeUserRole(e.target.value as AdminUser["role"])}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#920090]"
                >
                  <option value="learner">Role: Learner</option>
                  <option value="instructor">Role: Instructor</option>
                  <option value="admin">Role: Admin</option>
                </select>

                <button
                  type="button"
                  onClick={toggleUserStatus}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                    user.status === "active"
                      ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {user.status === "active" ? "Suspend Account" : "Activate Account"}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-2xl border border-purple-100 bg-[#fde8fc]/80 px-4 py-3 text-xs text-[#520051]">
                <Lock size={15} className="text-[#920090] shrink-0" />
                <div className="text-[11px]">
                  <p className="font-bold">Self-Managed Learner Details</p>
                  <p className="text-slate-500">
                    Direct credential and role modification is restricted to Super Admin.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gamification & Learning Metrics */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#eee5ee] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">XP Points</span>
              {isSuperAdmin && (
                <button
                  onClick={() => setEditingXp(true)}
                  className="text-xs font-semibold text-[#920090] hover:underline"
                >
                  Edit Stats
                </button>
              )}
            </div>
            <p className="mt-2 text-3xl font-extrabold text-[#520051]">{user.xp} XP</p>
          </div>

          <div className="rounded-2xl border border-[#eee5ee] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Current Streak</span>
              <Flame size={18} className="text-orange-500" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-orange-600">{user.streak} Days</p>
          </div>

          <div className="rounded-2xl border border-[#eee5ee] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Enrolled Courses</span>
              <BookOpen size={18} className="text-[#920090]" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-[#520051]">{user.enrolledCoursesCount}</p>
          </div>

          <div className="rounded-2xl border border-[#eee5ee] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Certificates Earned</span>
              <Award size={18} className="text-emerald-600" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-emerald-600">{user.completedCoursesCount}</p>
          </div>
        </div>

        {/* Enrolled Courses Progress */}
        <div className="mt-8 rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-[#520051]">Enrolled Learning Courses</h2>
          <div className="mt-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-100 p-4">
              <div>
                <p className="font-bold text-slate-800">Fullstack Next.js 14 & TypeScript</p>
                <p className="text-xs text-slate-400">Enrolled on Jan 18, 2026 • 12 of 18 lessons completed</p>
              </div>
              <div className="mt-2 sm:mt-0 w-full sm:w-48">
                <div className="mb-1 flex justify-between text-xs font-semibold text-[#520051]">
                  <span>Progress</span>
                  <span>66%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[#920090]" style={{ width: "66%" }} />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-100 p-4">
              <div>
                <p className="font-bold text-slate-800">Advanced Design Systems with Tailwind</p>
                <p className="text-xs text-slate-400">Enrolled on Feb 02, 2026 • 8 of 8 lessons completed</p>
              </div>
              <div className="mt-2 sm:mt-0 w-full sm:w-48">
                <div className="mb-1 flex justify-between text-xs font-semibold text-emerald-600">
                  <span>Completed</span>
                  <span>100%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: "100%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Stats Modal for Super Admin */}
        {editingXp && isSuperAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-[#520051]">Manually Modify Learner Stats</h3>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">XP Points</label>
                  <input
                    type="number"
                    value={xpVal}
                    onChange={(e) => setXpVal(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-[#920090]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Streak Days</label>
                  <input
                    type="number"
                    value={streakVal}
                    onChange={(e) => setStreakVal(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-[#920090]"
                  />
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingXp(false)}
                  className="w-1/2 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveStats}
                  className="w-1/2 rounded-xl bg-[#520051] py-2 text-xs font-semibold text-white"
                >
                  Save Stats
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminShell>
  );
}
