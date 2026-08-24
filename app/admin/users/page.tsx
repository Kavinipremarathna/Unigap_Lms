"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  BookOpen,
  Flame,
  Star,
  Eye,
  Plus,
  UserCheck,
  CheckCircle2,
  X,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getStoredUsers, saveStoredUser, AdminUser } from "@/lib/mock/admin";
import { useAdminAuth } from "@/lib/context/admin-auth-context";

export default function AdminUsersDirectoryPage() {
  const { isSuperAdmin } = useAdminAuth();
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New User Form State
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"learner" | "instructor" | "admin">("learner");

  const loadUsers = () => {
    setUsersList(getStoredUsers());
  };

  useEffect(() => {
    loadUsers();
    window.addEventListener("unigap_users_updated", loadUsers);
    return () => window.removeEventListener("unigap_users_updated", loadUsers);
  }, []);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      alert("Please fill in user name and email.");
      return;
    }

    const initials = newUserName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      status: "active",
      avatar: initials || "UN",
      enrolledCoursesCount: 0,
      completedCoursesCount: 0,
      joinedDate: new Date().toISOString().split("T")[0],
      lastActive: "Just now",
      xp: 0,
      streak: 1,
      plan: "Free",
    };

    saveStoredUser(newUser);
    setNewUserName("");
    setNewUserEmail("");
    setIsModalOpen(false);
  };

  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [usersList, search, roleFilter, statusFilter]);

  const totalUsers = usersList.length;
  const activeLearners = usersList.filter((u) => u.role === "learner" && u.status === "active").length;
  const instructorsCount = usersList.filter((u) => u.role === "instructor").length;

  return (
    <AdminShell>
      <div className="container-app px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fde8fc] px-3 py-1 text-xs font-bold text-[#920090]">
                <Users size={13} /> User Management
              </span>
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[11px] font-bold text-[#520051]">
                {totalUsers} Total Users
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#520051] sm:text-3xl">
              User Directory & Accounts
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Manage platform learners, instructors, and system administrators.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#520051] px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#920090]"
            >
              <Plus size={16} /> Register New User
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#eee5ee] bg-white p-4 shadow-xs">
            <p className="text-xs font-semibold text-slate-500">Total Users</p>
            <p className="mt-2 text-2xl font-extrabold text-[#520051]">{totalUsers}</p>
          </div>
          <div className="rounded-2xl border border-[#eee5ee] bg-white p-4 shadow-xs">
            <p className="text-xs font-semibold text-slate-500">Active Learners</p>
            <p className="mt-2 text-2xl font-extrabold text-[#920090]">{activeLearners}</p>
          </div>
          <div className="rounded-2xl border border-[#eee5ee] bg-white p-4 shadow-xs">
            <p className="text-xs font-semibold text-slate-500">Instructors</p>
            <p className="mt-2 text-2xl font-extrabold text-[#520051]">{instructorsCount}</p>
          </div>
          <div className="rounded-2xl border border-[#eee5ee] bg-white p-4 shadow-xs">
            <p className="text-xs font-semibold text-slate-500">Backend Synced</p>
            <p className="mt-2 text-2xl font-extrabold text-emerald-600">Active</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full rounded-xl border border-[#eee5ee] bg-white pl-10 pr-4 py-2.5 text-xs outline-none focus:border-[#920090] focus:ring-2 focus:ring-[#920090]/10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-[#eee5ee] bg-white px-3 py-2 text-xs font-semibold text-[#520051] outline-none"
            >
              <option value="all">All Roles</option>
              <option value="learner">Learners</option>
              <option value="instructor">Instructors</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* Users Table / Empty State */}
        <div className="mt-6 rounded-3xl border border-[#eee5ee] bg-white p-2 shadow-xs overflow-hidden">
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#eee5ee] bg-[#faf5fa] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role & Plan</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Learning Stats</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee5ee]">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="transition hover:bg-[#faf5fa]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#520051] text-xs font-bold text-white shadow-xs">
                            {user.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-[#520051] text-sm">{user.name}</p>
                            <p className="text-[11px] text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex w-fit items-center rounded-md bg-[#fde8fc] px-2 py-0.5 text-[10px] font-bold uppercase text-[#920090]">
                            {user.role}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-[11px]">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <BookOpen size={13} className="text-[#920090]" /> {user.enrolledCoursesCount} courses
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-500">{user.joinedDate}</td>

                      <td className="px-6 py-4 text-right">
                        {user.role === "admin" || (user.role as string) === "SUPER_ADMIN" || (user.role as string) === "ADMIN" ? (
                          <button

                            type="button"
                            onClick={async () => {
                              try {
                                await fetch("/api/admin/users/assign-role", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ targetUserEmail: user.email, newRole: "STUDENT" }),
                                });
                                const updated = usersList.map((u) => u.id === user.id ? { ...u, role: "learner" as const } : u);
                                setUsersList(updated);
                                alert(`Admin login access removed for ${user.email}.`);
                              } catch {
                                alert("Failed to update role.");
                              }
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                          >
                            Revoke Admin
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await fetch("/api/admin/users/assign-role", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ targetUserEmail: user.email, newRole: "ADMIN" }),
                                });
                                const updated = usersList.map((u) => u.id === user.id ? { ...u, role: "admin" as const } : u);
                                setUsersList(updated);
                                alert(`Admin login access granted to ${user.email} by Super Admin in PostgreSQL.`);
                              } catch {
                                alert("Failed to assign Admin access.");
                              }
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#920090]/30 bg-[#fde8fc] px-2.5 py-1 text-xs font-bold text-[#920090] hover:bg-[#920090] hover:text-white transition"
                          >
                            <UserCheck size={13} /> Assign Admin
                          </button>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#faf5fa] text-[#520051]">
                <Users size={24} />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#520051]">No Registered Users Found</h3>
              <p className="mt-1 text-xs text-slate-500">
                Click &quot;Register New User&quot; to create user accounts.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-[#520051]">Register New User</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#520051] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-[#920090]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#520051] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-[#920090]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#520051] mb-1">User Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-[#920090]"
                >
                  <option value="learner">Learner</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#520051] px-5 py-2 text-xs font-bold text-white hover:bg-[#920090]"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}