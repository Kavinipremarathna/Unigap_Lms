"use client";

import { useEffect, useState } from "react";
import { BookOpen, Clock, Flame, Award, User } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubpageHeroHeader } from "@/components/ui/subpage-hero-header";
import { getAuthenticatedUser, AuthUser } from "@/lib/services/auth.service";
import { getUserStats, getEnrolledUserCourses, UserStats } from "@/lib/services/user-progress";

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    streak: 0,
    xp: 0,
    level: 1,
    minutesDone: 0,
    completedLessons: 0,
    enrolledCourseIds: [],
    lessonProgress: {},
  });
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [editName, setEditName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSavedSuccess, setNameSavedSuccess] = useState(false);

  const loadProfile = () => {
    const u = getAuthenticatedUser();
    setCurrentUser(u);
    if (u?.name) {
      setEditName(u.name);
    }
    const stats = getUserStats();
    setUserStats(stats);
    const enrolled = getEnrolledUserCourses();
    setEnrolledCount(enrolled.length);
  };

  useEffect(() => {
    loadProfile();
    window.addEventListener("unigap_auth_changed", loadProfile);
    window.addEventListener("unigap_user_stats_updated", loadProfile);
    return () => {
      window.removeEventListener("unigap_auth_changed", loadProfile);
      window.removeEventListener("unigap_user_stats_updated", loadProfile);
    };
  }, []);

  if (!currentUser) {
    return (
      <div className="container-app py-16 flex flex-col items-center justify-center text-center">
        <div className="max-w-md w-full rounded-3xl border border-border/80 bg-surface/90 p-8 shadow-xl space-y-6 backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <User size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="font-sans text-2xl font-extrabold text-ink">Student Profile</h2>
            <p className="text-xs text-ink-muted leading-relaxed">
              Please register or log in with your learner account to access your profile, XP rewards, and enrolled courses.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="/register"
              className="flex-1 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-primary-fg shadow-md text-center hover:opacity-95"
            >
              Create Account
            </a>
            <a
              href="/login"
              className="flex-1 rounded-xl border border-border bg-surface-2 px-5 py-3 text-xs font-bold text-ink text-center hover:bg-surface"
            >
              Log In
            </a>
          </div>
        </div>
      </div>
    );
  }

  const displayName = currentUser.name || "Learner";
  const displayEmail = currentUser.email;
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .substring(0, 2)
    .toUpperCase() || "U";

  const handleSaveCertificateName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    setIsSavingName(true);
    try {
      const stored = localStorage.getItem("unigap_auth_user");
      if (stored) {
        const u = JSON.parse(stored);
        u.name = editName.trim();
        localStorage.setItem("unigap_auth_user", JSON.stringify(u));
        window.dispatchEvent(new Event("unigap_auth_changed"));
      }
      setNameSavedSuccess(true);
      setTimeout(() => setNameSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingName(false);
    }
  };

  const stats = [
    { label: "Enrolled Courses", value: String(enrolledCount), icon: BookOpen },
    { label: "Learning Time", value: `${Math.round((userStats.minutesDone || 0) / 60 * 10) / 10}h`, icon: Clock },
    { label: "Current Streak", value: `${userStats.streak || 0} days`, icon: Flame },
    { label: "XP Points", value: `${(userStats.xp || 0).toLocaleString()} XP`, icon: Award },
  ];

  return (
    <div className="container-app py-8 space-y-8">
      <SubpageHeroHeader
        icon={User}
        badgeText="Registered Student Profile"
        title={displayName}
        description="Registered learner account building real-world skills on UNIGAP."
        rightContent={
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary via-[#920090] to-accent font-mono text-lg font-bold text-primary-fg ring-4 ring-primary/20 shadow-md">
              {initials}
            </div>
            <div>
              <p className="font-mono text-xs text-ink-muted">{displayEmail}</p>
              <div className="mt-1 flex gap-1.5">
                <Badge variant="brass">Level {userStats.level || 1}</Badge>
                <Badge variant="xp">{(userStats.xp || 0).toLocaleString()} XP</Badge>
              </div>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 text-center rounded-2xl">
            <s.icon size={22} className="mx-auto text-primary" />
            <p className="mt-2 text-xl font-bold text-ink">{s.value}</p>
            <p className="text-xs text-ink-muted">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* CERTIFICATE RECIPIENT FULL NAME MANAGER */}
      <div className="rounded-3xl border border-border/80 bg-surface p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <h2 className="text-base font-extrabold text-ink flex items-center gap-2">
              <Award size={18} className="text-[#920090] dark:text-[#f14df0]" />
              Official Certificate Recipient Name
            </h2>
            <p className="text-xs text-ink-muted">
              This name is automatically printed on your official Certificate of Completion when you finish a course.
            </p>
          </div>
          {nameSavedSuccess && (
            <span className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              ✓ Saved & Updated
            </span>
          )}
        </div>

        <form onSubmit={handleSaveCertificateName} className="flex flex-col sm:flex-row items-end gap-4 pt-1">
          <div className="w-full flex-1 space-y-1.5">
            <label htmlFor="certificateName" className="block text-xs font-mono font-bold uppercase tracking-wider text-ink-muted">
              Full Legal Name for Certificate
            </label>
            <input
              id="certificateName"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="e.g. Johnathan Alex Smith"
              required
              className="w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-xs font-bold text-ink outline-none transition focus:border-[#920090]"
            />
          </div>

          <button
            type="submit"
            disabled={isSavingName}
            className="w-full sm:w-auto rounded-2xl bg-[#520051] px-6 py-3 text-xs font-bold text-white hover:bg-[#920090] transition shadow-md cursor-pointer dark:bg-[#920090] dark:hover:bg-[#d400d1] shrink-0"
          >
            {isSavingName ? "Saving..." : "Update Certificate Name"}
          </button>
        </form>
      </div>

      <div className="rounded-3xl border border-border/80 bg-surface p-6 space-y-4">
        <h2 className="text-base font-bold text-ink">Learning Goals & Technical Interests</h2>
        <div className="flex flex-wrap gap-2">
          {["Fullstack Web Dev", "Cloud Architecture", "Database Systems", "TypeScript & Next.js"].map((s) => (
            <Badge key={s} variant="default" className="rounded-full px-3.5 py-1 text-xs font-semibold">{s}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
