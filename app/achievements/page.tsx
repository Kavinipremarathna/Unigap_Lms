"use client";

import { useState } from "react";
import {
  Award,
  Search,
  Target,
  Flame,
  BookOpen,
  Brain,
  GraduationCap,
  TrendingUp,
  Moon,
  Rocket,
  CheckCircle2,
  Lock,
  Zap,
  Filter,
  Trophy,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { achievements as initialAchievements } from "@/lib/mock/achievements";
import { Achievement } from "@/lib/types";
import { getSafeIcon } from "@/components/ui/safe-icon";

const iconMap = {
  Award,
  Target,
  Flame,
  BookOpen,
  Brain,
  GraduationCap,
  TrendingUp,
  Moon,
  Rocket,
};

type CategoryFilter = "all" | "milestone" | "streak" | "mastery" | "goal";
type StatusFilter = "all" | "unlocked" | "locked";

export default function LearnerAchievementsPage() {
  const [achievements] = useState<Achievement[]>(initialAchievements);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");

  const filteredAchievements = achievements.filter((achievement) => {
    const matchesSearch = `${achievement.title} ${achievement.description}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || achievement.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "unlocked" && achievement.unlocked) ||
      (selectedStatus === "locked" && !achievement.unlocked);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalXP = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + (a.progress === 100 ? 250 : 100), 0);

  return (
    <AppShell>
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#520051] via-[#740072] to-[#d400d1] p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <Trophy size={14} className="text-yellow-300" /> Learner Gamification
              </span>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Your Achievements & Badges
              </h1>
              <p className="mt-2 text-sm text-purple-100 max-w-xl">
                Unlock badges as you complete courses, maintain learning streaks, and master new skills across UNIGAP.
              </p>
            </div>

            {/* Quick Stat Pill */}
            <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/15">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400 text-[#520051] shadow-md">
                <Zap size={24} className="fill-current" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-purple-200 font-medium">Earned Rewards</p>
                <p className="text-2xl font-black">{totalXP} XP</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Badges</span>
              <Award className="text-[#920090]" size={20} />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-[#520051]">{achievements.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Unlocked</span>
              <CheckCircle2 className="text-emerald-500" size={20} />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-emerald-600">{unlockedCount}</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Locked</span>
              <Lock className="text-amber-500" size={20} />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-amber-600">{achievements.length - unlockedCount}</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Completion</span>
              <Flame className="text-orange-500" size={20} />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-[#520051]">
              {Math.round((unlockedCount / (achievements.length || 1)) * 100)}%
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search achievements by name or description..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#920090] focus:ring-2 focus:ring-[#920090]/10"
              />
            </div>

            {/* Category & Status Tabs */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category selector */}
              <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
                {(["all", "milestone", "streak", "mastery", "goal"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                      selectedCategory === cat
                        ? "bg-white text-[#520051] shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
                {(["all", "unlocked", "locked"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                      selectedStatus === status
                        ? "bg-white text-[#520051] shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAchievements.map((achievement) => {
            const IconComponent = getSafeIcon(achievement.icon, Award);

            return (
              <div
                key={achievement.id}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
                  achievement.unlocked
                    ? "border-purple-200"
                    : "border-slate-200 opacity-80"
                }`}
              >
                {/* Top Badge header */}
                <div>
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${
                        achievement.unlocked
                          ? "bg-gradient-to-br from-[#520051] to-[#d400d1] text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <IconComponent size={26} />
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                        achievement.unlocked
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {achievement.unlocked ? (
                        <>
                          <CheckCircle2 size={12} /> Unlocked
                        </>
                      ) : (
                        <>
                          <Lock size={12} /> Locked
                        </>
                      )}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="mt-5">
                    <h3 className="text-lg font-bold text-[#520051]">
                      {achievement.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {achievement.description}
                    </p>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-md bg-purple-50 px-2.5 py-1 font-semibold uppercase tracking-wider text-[#920090]">
                      {achievement.category}
                    </span>

                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <Zap size={14} className="fill-amber-400" />
                      +{achievement.unlocked ? "250" : "100"} XP
                    </span>
                  </div>

                  {/* Progress Bar for Locked / In Progress */}
                  {typeof achievement.progress === "number" && (
                    <div className="mt-4">
                      <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#520051] to-[#d400d1] transition-all duration-500"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="mt-12 rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <Award size={40} className="mx-auto text-slate-300" />
            <h3 className="mt-4 text-lg font-bold text-[#520051]">No Achievements Found</h3>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your search criteria or switching category tabs.
            </p>
          </div>
        )}
      </main>
    </AppShell>
  );
}
