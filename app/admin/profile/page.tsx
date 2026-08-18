"use client";

import { useState } from "react";
import {
  Shield,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Key,
  Smartphone,
  History,
  Edit3,
  Save,
  Clock,
  Sparkles,
  Lock,
  Unlock,
  Layers,
  BookOpen,
  FileText,
  Users,
  CreditCard,
  Settings,
  Bell,
  Award,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminAuth, AdminRole } from "@/lib/context/admin-auth-context";

export default function AdminProfilePage() {
  const {
    admin,
    role,
    setRole,
    updateProfile,
    activities,
    isSuperAdmin,
    isAdmin,
  } = useAdminAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: admin.name,
    email: admin.email,
    department: admin.department,
    phone: admin.phone,
    location: admin.location,
    bio: admin.bio,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword && passwordForm.newPassword === passwordForm.confirmPassword) {
      setPasswordSaved(true);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordSaved(false), 3000);
    }
  };

  const permissionsList = [
    {
      module: "Course Curriculum & Catalog",
      description: "Create, edit, archive courses, modules, lessons, and pricing",
      icon: BookOpen,
      adminAllowed: true,
      superAdminAllowed: true,
    },
    {
      module: "Landing Page & Dashboard CMS",
      description: "Update live landing page headlines, hero CTAs, banners, and dynamic site copy",
      icon: FileText,
      adminAllowed: false,
      superAdminAllowed: true,
      adminNote: "Restricted to Super Admin",
    },
    {
      module: "Instructors Management & Registration",
      description: "Register new platform instructors, assign titles, bios, and permissions",
      icon: UserCheck,
      adminAllowed: false,
      superAdminAllowed: true,
      adminNote: "Restricted to Super Admin",
    },
    {
      module: "Achievements & Badges",
      description: "Create, modify, and reward learner milestone badges and XP thresholds",
      icon: Award,
      adminAllowed: true,
      superAdminAllowed: true,
    },
    {
      module: "Issued Certificates",
      description: "Verify and view cryptographic certificates and learner completions",
      icon: ShieldCheck,
      adminAllowed: true,
      superAdminAllowed: true,
    },
    {
      module: "System & Course Notifications",
      description: "Send alerts, learning nudges, and platform updates",
      icon: Bell,
      adminAllowed: true,
      superAdminAllowed: true,
    },
    {
      module: "Learner Directory & Analytics",
      description: "View enrollment stats, progress, and audit learner activity",
      icon: Users,
      adminAllowed: true,
      superAdminAllowed: true,
    },
    {
      module: "Direct User Personal Details Edit",
      description: "Modify user passwords, credentials, and personal information (Learner-managed)",
      icon: Lock,
      adminAllowed: false,
      superAdminAllowed: true,
      adminNote: "Restricted — Managed directly by learners",
    },
    {
      module: "Billing, Gateways & Refunds",
      description: "Manage Stripe/PayPal credentials, process refunds, and view raw transactions",
      icon: CreditCard,
      adminAllowed: false,
      superAdminAllowed: true,
      adminNote: "Restricted to Super Admin",
    },
    {
      module: "Global Subscription Pricing Plans",
      description: "Edit global plan pricing tiers, currency settings, and subscription rules",
      icon: Layers,
      adminAllowed: false,
      superAdminAllowed: true,
      adminNote: "Restricted to Super Admin",
    },
    {
      module: "System Root Settings & Role Assignment",
      description: "API keys, security policies, maintenance mode, and assigning Super Admin roles",
      icon: Settings,
      adminAllowed: false,
      superAdminAllowed: true,
      adminNote: "Restricted to Super Admin",
    },
  ];

  return (
    <AdminShell>
      <div className="container-app px-4 py-8 lg:px-8">
        {/* Profile Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#520051] via-[#920090] to-[#d400d1] p-6 text-white shadow-xl sm:p-8">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white shadow-inner backdrop-blur-md ring-4 ring-white/20">
                {admin.avatar}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                    {admin.name}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-sm backdrop-blur-md ${
                      isSuperAdmin
                        ? "bg-amber-400/90 text-amber-950 ring-1 ring-amber-300"
                        : "bg-[#fde8fc] text-[#520051] ring-1 ring-white/40"
                    }`}
                  >
                    {isSuperAdmin ? (
                      <>
                        <ShieldAlert size={14} /> Super Administrator
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={14} /> Administrator (Content & Operations)
                      </>
                    )}
                  </span>
                </div>

                <p className="mt-1 text-sm text-pink-100">{admin.email} · {admin.department}</p>
                <p className="mt-0.5 text-xs text-pink-200/80">Member since {admin.joinedDate} · {admin.location}</p>
              </div>
            </div>

            {/* Quick Role Switcher Action */}
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-wider text-pink-200">
                Live Role Simulator
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRole("super_admin")}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    isSuperAdmin
                      ? "bg-white text-[#520051] shadow-md scale-105"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <ShieldAlert size={14} /> SUPER_ADMIN
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    isAdmin
                      ? "bg-white text-[#520051] shadow-md scale-105"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <ShieldCheck size={14} /> ADMIN
                </button>
                <button
                  type="button"
                  onClick={() => setRole("learner")}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    !isSuperAdmin && !isAdmin
                      ? "bg-white text-[#520051] shadow-md scale-105"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <Users size={14} /> USER / STUDENT
                </button>
              </div>
            </div>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 animate-fade-in">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            Profile updated successfully.
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Left 2 Columns: Profile Details & Permissions Matrix */}
          <div className="space-y-8 lg:col-span-2">
            {/* Profile Information Form */}
            <div className="rounded-3xl border border-[#e8dce8] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between border-b border-[#eee5ee] pb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#520051]">Personal & Professional Info</h2>
                  <p className="text-xs text-slate-500">Manage your administrative credentials and contact details</p>
                </div>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-[#d400d1]/30 bg-[#fde8fc] px-4 py-2 text-xs font-bold text-[#920090] transition hover:bg-[#f7ddf7]"
                  >
                    <Edit3 size={14} /> Edit Profile
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-[#920090] focus:outline-none focus:ring-2 focus:ring-[#920090]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-[#920090] focus:outline-none focus:ring-2 focus:ring-[#920090]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-[#920090] focus:outline-none focus:ring-2 focus:ring-[#920090]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-[#920090] focus:outline-none focus:ring-2 focus:ring-[#920090]/20"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-[#920090] focus:outline-none focus:ring-2 focus:ring-[#920090]/20"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Bio / Administrative Focus</label>
                      <textarea
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-[#920090] focus:outline-none focus:ring-2 focus:ring-[#920090]/20"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-[#520051] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#920090]"
                    >
                      <Save size={16} /> Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#eee5ee] bg-[#faf5fa] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Full Name</p>
                    <p className="mt-1 text-sm font-bold text-[#520051]">{admin.name}</p>
                  </div>
                  <div className="rounded-2xl border border-[#eee5ee] bg-[#faf5fa] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Address</p>
                    <p className="mt-1 text-sm font-bold text-[#520051]">{admin.email}</p>
                  </div>
                  <div className="rounded-2xl border border-[#eee5ee] bg-[#faf5fa] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Department</p>
                    <p className="mt-1 text-sm font-bold text-[#520051]">{admin.department}</p>
                  </div>
                  <div className="rounded-2xl border border-[#eee5ee] bg-[#faf5fa] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Phone</p>
                    <p className="mt-1 text-sm font-bold text-[#520051]">{admin.phone}</p>
                  </div>
                  <div className="rounded-2xl border border-[#eee5ee] bg-[#faf5fa] p-4 sm:col-span-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Administrative Summary</p>
                    <p className="mt-1 text-sm text-slate-700 leading-relaxed">{admin.bio}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Role & Permissions Breakdown Matrix */}
            <div className="rounded-3xl border border-[#e8dce8] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-2 border-b border-[#eee5ee] pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#520051]">Access Control & Permissions Matrix</h2>
                  <p className="text-xs text-slate-500">
                    Currently operating under{" "}
                    <span className="font-bold text-[#920090]">
                      {isSuperAdmin ? "Super Admin" : "Admin (Content & Operations)"}
                    </span>{" "}
                    privileges
                  </p>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <Sparkles size={14} className="text-[#920090]" /> RBAC Protected
                </span>
              </div>

              <div className="mt-6 divide-y divide-[#eee5ee] overflow-hidden rounded-2xl border border-[#eee5ee]">
                {permissionsList.map((perm) => {
                  const Icon = perm.icon;
                  const isAllowed = isSuperAdmin ? perm.superAdminAllowed : perm.adminAllowed;

                  return (
                    <div
                      key={perm.module}
                      className={`flex flex-col gap-3 p-4 transition sm:flex-row sm:items-center sm:justify-between ${
                        isAllowed ? "bg-white" : "bg-[#faf5fa]/70 opacity-80"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            isAllowed
                              ? "bg-[#fde8fc] text-[#920090]"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          <Icon size={17} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#520051]">{perm.module}</p>
                          <p className="text-xs text-slate-500">{perm.description}</p>
                          {!isAllowed && perm.adminNote && (
                            <p className="mt-1 text-[11px] font-semibold text-amber-700">
                              ⚠️ {perm.adminNote}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 self-start sm:self-center">
                        {isAllowed ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={13} /> Authorized
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 border border-slate-200">
                            <Lock size={13} /> Restricted
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Security & Activity Log */}
          <div className="space-y-8">
            {/* Account Security Card */}
            <div className="rounded-3xl border border-[#e8dce8] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[#eee5ee] pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fde8fc] text-[#920090]">
                  <Key size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-[#520051]">Security & Credentials</h3>
                  <p className="text-[11px] text-slate-500">Update password and 2FA authentication</p>
                </div>
              </div>

              {passwordSaved && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 animate-fade-in">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  Password updated securely.
                </div>
              )}

              <form onSubmit={handleSavePassword} className="mt-4 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                    placeholder="Repeat new password"
                    className="w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#520051] py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#920090]"
                >
                  Update Password
                </button>
              </form>

              {/* 2FA Toggle */}
              <div className="mt-5 border-t border-[#eee5ee] pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone size={16} className="text-[#920090]" />
                    <div>
                      <p className="text-xs font-bold text-[#520051]">2-Factor Authentication</p>
                      <p className="text-[10px] text-slate-400">Authenticator App (TOTP)</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      twoFactorEnabled ? "bg-[#920090]" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Admin Audit Activity Log */}
            <div className="rounded-3xl border border-[#e8dce8] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#eee5ee] pb-4">
                <div className="flex items-center gap-2.5">
                  <History size={18} className="text-[#920090]" />
                  <h3 className="font-bold text-[#520051]">Admin Audit Trail</h3>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">Live Log</span>
              </div>

              <div className="mt-4 space-y-3">
                {activities.slice(0, 6).map((act) => (
                  <div
                    key={act.id}
                    className="flex flex-col gap-1 rounded-2xl border border-[#eee5ee] bg-[#faf5fa] p-3 transition hover:border-[#d400d1]/30"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#520051]">{act.action}</p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock size={11} /> {act.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">{act.target}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
