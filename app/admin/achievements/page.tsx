"use client";

import { useState, useEffect } from "react";
import {
  Award,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Users,
  Zap,
  Flame,
  Trophy,
  Target,
  Star,
  CheckCircle2,
  X,
  Sparkles,
  Filter,
  Layers,
  Loader2,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSafeIcon } from "@/components/ui/safe-icon";

export type AdminAchievement = {
  id: string;
  title: string;
  description: string;
  requirement: string;
  xp: number;
  unlockedBy: number;
  active: boolean;
  category: "milestone" | "streak" | "mastery" | "goal";
  icon: "award" | "flame" | "trophy" | "target" | "star" | string;
};

const categoryColors: Record<string, { bg: string; text: string; gradient: string }> = {
  milestone: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", text: "text-emerald-600", gradient: "from-emerald-500 to-teal-600" },
  streak: { bg: "bg-amber-50 text-amber-700 border-amber-200", text: "text-amber-600", gradient: "from-amber-500 to-orange-600" },
  mastery: { bg: "bg-purple-50 text-purple-700 border-purple-200", text: "text-purple-600", gradient: "from-[#520051] to-[#D400D1]" },
  goal: { bg: "bg-blue-50 text-blue-700 border-blue-200", text: "text-blue-600", gradient: "from-blue-500 to-indigo-600" },
};

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<AdminAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<AdminAchievement | null>(null);

  const fetchAchievementsFromDB = async () => {
    try {
      const res = await fetch("/api/achievements");
      const data = await res.json();
      if (res.ok && data.achievements) {
        setAchievements(data.achievements);
      }
    } catch (err) {
      console.error("Failed to load achievements from DB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievementsFromDB();
  }, []);

  const filteredAchievements = achievements.filter((achievement) => {
    const matchesSearch = `${achievement.title} ${achievement.description} ${achievement.requirement}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || achievement.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAchievementStatus = async (id: string) => {
    const target = achievements.find((a) => a.id === id);
    if (!target) return;
    const newActiveState = !target.active;

    setAchievements((current) =>
      current.map((item) => (item.id === id ? { ...item, active: newActiveState } : item))
    );

    try {
      await fetch("/api/achievements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: newActiveState }),
      });
    } catch (err) {
      console.error("Failed to update active state in DB:", err);
    }
  };

  const deleteAchievement = async (id: string) => {
    const item = achievements.find((a) => a.id === id);
    if (!item) return;
    if (!confirm(`Are you sure you want to delete "${item.title}" from PostgreSQL database?`)) return;

    setAchievements((current) => current.filter((a) => a.id !== id));

    try {
      await fetch(`/api/achievements?id=${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete achievement from DB:", err);
    }
  };

  const openAddModal = () => {
    setEditingAchievement(null);
    setShowForm(true);
  };

  const openEditModal = (item: AdminAchievement) => {
    setEditingAchievement(item);
    setShowForm(true);
  };

  const handleSaveAchievement = async (savedItem: AdminAchievement) => {
    if (editingAchievement) {
      setAchievements((current) =>
        current.map((item) => (item.id === savedItem.id ? savedItem : item))
      );
      try {
        await fetch("/api/achievements", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(savedItem),
        });
      } catch (err) {
        console.error("Error updating achievement in DB:", err);
      }
    } else {
      try {
        const res = await fetch("/api/achievements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(savedItem),
        });
        const data = await res.json();
        if (res.ok && data.achievement) {
          setAchievements((current) => [
            {
              ...data.achievement,
              unlockedBy: 0,
            },
            ...current,
          ]);
        }
      } catch (err) {
        console.error("Error creating achievement in DB:", err);
      }
    }
    setShowForm(false);
    setEditingAchievement(null);
  };

  return (
    <AdminShell>
      <main className="container-app px-6 py-8">
        {/* Modern Gradient Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#520051] via-[#920090] to-[#D400D1] p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold backdrop-blur-md">
                <Sparkles size={14} className="text-amber-300" /> Gamification & Badges Engine
              </span>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Platform Achievements
              </h1>
              <p className="mt-2 text-sm text-purple-100 leading-relaxed">
                Configure rewards, gamification milestones, and XP multipliers to maximize learner engagement across UNIGAP.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#520051] shadow-lg transition hover:bg-purple-50 active:scale-95 shrink-0"
            >
              <Plus size={18} />
              Create Achievement
            </button>
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#eee5ee] bg-white p-5 shadow-xs transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#faf5fa] text-[#920090]">
                <Award size={22} />
              </div>
              <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-[#920090]">Total</span>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-[#520051]">{achievements.length}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">Achievement Definitions</p>
          </div>

          <div className="rounded-2xl border border-[#eee5ee] bg-white p-5 shadow-xs transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={22} />
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">Live</span>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-[#520051]">
              {achievements.filter((a) => a.active).length}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">Active Badges</p>
          </div>

          <div className="rounded-2xl border border-[#eee5ee] bg-white p-5 shadow-xs transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Users size={22} />
              </div>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">Unlocks</span>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-[#520051]">
              {achievements.reduce((total, item) => total + item.unlockedBy, 0).toLocaleString()}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">Total Unlocks Awarded</p>
          </div>

          <div className="rounded-2xl border border-[#eee5ee] bg-white p-5 shadow-xs transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Zap size={22} />
              </div>
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">XP Pool</span>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-[#520051]">
              {achievements.reduce((total, item) => total + item.xp, 0).toLocaleString()}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">Distributed XP Pool</p>
          </div>
        </div>

        {/* Search & Filter Control Bar */}
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#eee5ee] bg-white p-4 shadow-xs md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by badge title, description, or criteria..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-11 pr-4 text-xs outline-none focus:border-[#920090] focus:ring-2 focus:ring-[#920090]/10"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {["all", "milestone", "streak", "mastery", "goal"].map((cat) => {
              const isActive = selectedCategory === cat;
              const count =
                cat === "all"
                  ? achievements.length
                  : achievements.filter((a) => a.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`capitalize rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#520051] text-white shadow-xs"
                      : "bg-[#faf5fa] text-slate-600 hover:bg-[#f0e6f0]"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modern Achievement Cards Grid */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredAchievements.map((item) => {
            const catTheme = categoryColors[item.category] || categoryColors.milestone;
            return (
              <div
                key={item.id}
                className={`group relative flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:shadow-xl ${
                  item.active ? "border-[#eee5ee] hover:border-[#920090]/40" : "border-slate-200 opacity-60"
                }`}
              >
                <div>
                  {/* Icon & Category Badge */}
                  <div className="flex items-start justify-between">
                    <AchievementIcon icon={item.icon} gradient={catTheme.gradient} />
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider ${catTheme.bg}`}
                    >
                      {item.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-extrabold text-[#520051] group-hover:text-[#920090] transition">
                        {item.title}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          item.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.active ? "● Active" : "○ Disabled"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">{item.description}</p>
                  </div>

                  {/* Requirement Card */}
                  <div className="mt-4 rounded-2xl bg-[#faf5fa] p-3.5 border border-[#f0e6f0]">
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Requirement Criteria
                    </span>
                    <p className="mt-1 text-xs font-bold text-[#520051]">{item.requirement}</p>
                  </div>

                  {/* Metrics Pills */}
                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl bg-purple-50/50 p-2.5 border border-purple-100">
                      <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase">
                        <Zap size={12} className="text-[#920090]" /> Reward
                      </div>
                      <p className="mt-0.5 text-sm font-extrabold text-[#920090]">+{item.xp} XP</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase">
                        <Users size={12} className="text-slate-600" /> Unlocked By
                      </div>
                      <p className="mt-0.5 text-sm font-extrabold text-[#520051]">
                        {item.unlockedBy.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Edit size={14} /> Edit Badge
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleAchievementStatus(item.id)}
                    className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 transition"
                    title={item.active ? "Disable" : "Enable"}
                  >
                    {item.active ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteAchievement(item.id)}
                    className="rounded-xl border border-red-100 p-2 text-red-500 hover:bg-red-50 transition"
                    title="Delete achievement"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="mt-12 rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#faf5fa] text-[#520051]">
              <Award size={28} />
            </div>
            <h3 className="mt-4 text-base font-bold text-[#520051]">No Achievements Found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your search criteria or category filter.
            </p>
          </div>
        )}
      </main>

      {/* Modal Form */}
      {showForm && (
        <AchievementModalForm
          achievement={editingAchievement}
          onClose={() => setShowForm(false)}
          onSave={handleSaveAchievement}
        />
      )}
    </AdminShell>
  );
}

function AchievementIcon({ icon, gradient }: { icon: string; gradient: string }) {
  const Icon = getSafeIcon(icon, Award);
  return (
    <div
      className={`flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-md transition group-hover:scale-105`}
    >
      <Icon size={24} />
    </div>
  );
}

function AchievementModalForm({
  achievement,
  onClose,
  onSave,
}: {
  achievement: AdminAchievement | null;
  onClose: () => void;
  onSave: (item: AdminAchievement) => void;
}) {
  const [title, setTitle] = useState(achievement?.title || "");
  const [description, setDescription] = useState(achievement?.description || "");
  const [requirement, setRequirement] = useState(achievement?.requirement || "");
  const [xp, setXp] = useState(achievement?.xp || 100);
  const [category, setCategory] = useState<AdminAchievement["category"]>(achievement?.category || "milestone");
  const [icon, setIcon] = useState<AdminAchievement["icon"]>(achievement?.icon || "award");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: achievement?.id || `ach-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      requirement: requirement.trim(),
      xp,
      category,
      icon,
      unlockedBy: achievement?.unlockedBy || 0,
      active: achievement?.active ?? true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf5fa] text-[#520051]">
              <Trophy size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#520051]">
                {achievement ? "Edit Achievement Badge" : "Create New Achievement"}
              </h2>
              <p className="text-xs text-slate-400">Configure rewards and unlocking conditions.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-[#520051]">Badge Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Contributor"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#920090]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#520051]">Badge Description</label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe how learners unlock this achievement..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#920090]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#520051]">Requirement Criteria Summary</label>
            <input
              type="text"
              required
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="e.g. Complete 10 quizzes with grade > 90%"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#920090]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#520051]">XP Reward</label>
              <input
                type="number"
                min="0"
                value={xp}
                onChange={(e) => setXp(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#920090]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[#520051]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AdminAchievement["category"])}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#920090]"
              >
                <option value="milestone">Milestone</option>
                <option value="streak">Streak</option>
                <option value="mastery">Mastery</option>
                <option value="goal">Goal</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[#520051]">Icon</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value as AdminAchievement["icon"])}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#920090]"
              >
                <option value="award">Award</option>
                <option value="flame">Flame</option>
                <option value="trophy">Trophy</option>
                <option value="target">Target</option>
                <option value="star">Star</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl bg-[#520051] py-2.5 text-xs font-bold text-white hover:bg-[#920090] shadow-xs"
            >
              {achievement ? "Save Changes" : "Create Badge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}