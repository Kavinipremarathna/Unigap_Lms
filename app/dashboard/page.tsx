"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Flame,
  Zap,
  Target,
  Sparkles,
  PlayCircle,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Compass,
  Star,
  Activity,
  Layers,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CourseCard } from "@/components/courses/course-card";
import { WeeklyProgress } from "@/components/dashboard/weekly-progress";
import { AICompanionCard } from "@/components/ai/ai-companion-card";
import { CourseThumb } from "@/components/courses/course-thumb";
import { cn } from "@/lib/utils";
import { getStoredCourses } from "@/lib/mock/courses";

import { getEnrolledUserCourses, getUserStats, UserStats } from "@/lib/services/user-progress";
import { achievements } from "@/lib/mock/achievements";
import { Course } from "@/lib/types";

import { getAuthenticatedUser, AuthUser } from "@/lib/services/auth.service";

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [allCatalogCourses, setAllCatalogCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "analytics">("overview");
  const [userStats, setUserStatsState] = useState<UserStats>({
    streak: 0,
    xp: 0,
    level: 1,
    minutesDone: 0,
    completedLessons: 0,
    enrolledCourseIds: [],
    lessonProgress: {},
  });

  const loadUserData = () => {
    const u = getAuthenticatedUser();
    setCurrentUser(u);

    const stats = getUserStats();
    setUserStatsState(stats);

    const enrolled = getEnrolledUserCourses();
    setEnrolledCourses(enrolled);

    const catalog = getStoredCourses();
    setAllCatalogCourses(catalog);
  };

  useEffect(() => {
    loadUserData();
    window.addEventListener("unigap_auth_changed", loadUserData);
    window.addEventListener("unigap_user_stats_updated", loadUserData);
    window.addEventListener("unigap_courses_updated", loadUserData);
    return () => {
      window.removeEventListener("unigap_auth_changed", loadUserData);
      window.removeEventListener("unigap_user_stats_updated", loadUserData);
      window.removeEventListener("unigap_courses_updated", loadUserData);
    };
  }, []);


  const primaryCourse = enrolledCourses[0] || allCatalogCourses[0];
  const recommendedCourses = allCatalogCourses.filter(
    (c) => !userStats.enrolledCourseIds.includes(c.id) && !userStats.enrolledCourseIds.includes(c.slug)
  );

  const unlockedBadges = achievements.slice(0, 4);

  return (
    <div className="container-app py-8 space-y-8">
      {/* 1. HERO COMMAND HUB BANNER */}
      <div className="relative overflow-hidden rounded-[4px] border border-border bg-gradient-to-r from-surface via-surface-2 to-surface p-6 sm:p-8 shadow-md transition-all">
        {/* Ambient Glow Orbs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-12 lg:items-center">
          {/* Greeting & Quick Action */}
          <div className="space-y-3 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brass">
                <Sparkles size={13} /> Level {userStats.level || 1} Scholar
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-primary">
                <Flame size={14} className="fill-primary" /> {userStats.streak ?? 0} Day Streak
              </span>
            </div>

            <h1 className="font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Welcome back, {currentUser?.name?.split(" ")[0] || "Learner"} 👋
            </h1>


            <p className="max-w-lg text-sm text-ink-muted leading-relaxed">
              You&apos;ve learned <strong className="text-ink font-semibold">{userStats.minutesDone || 0} minutes</strong> today.{" "}
              {Math.max(0, 30 - (userStats.minutesDone || 0)) > 0
                ? `Complete ${Math.max(0, 30 - (userStats.minutesDone || 0))} more minutes to hit your daily goal!`
                : "Daily goal achieved today! Excellent work 🎉"}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {primaryCourse ? (
                <Link href={`/courses/${primaryCourse.slug}`}>
                  <Button size="lg">
                    <PlayCircle size={18} /> Resume &quot;{primaryCourse.title}&quot;
                  </Button>
                </Link>
              ) : (
                <Link href="/courses">
                  <Button size="lg">
                    <Compass size={18} /> Explore Course Catalog
                  </Button>
                </Link>
              )}

              <Link href="/achievements">
                <Button size="lg" variant="secondary">
                  <Award size={18} /> View Achievements
                </Button>
              </Link>
            </div>
          </div>


          {/* Quick Active Course Feature Card */}
          <div className="lg:col-span-5">
            {primaryCourse && (
              <Card className="overflow-hidden rounded-[4px] border border-border bg-surface p-5 shadow-lg">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                    Current Focus Course
                  </span>
                  <span className="font-mono text-xs font-bold text-accent">
                    {primaryCourse.progress || 68}% Complete
                  </span>
                </div>

                <div className="mt-4 flex items-start gap-4">
                  <CourseThumb
                    category={primaryCourse.category}
                    gradient={primaryCourse.gradient}
                    className="h-20 w-24 shrink-0 rounded-[4px]"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-serif text-base font-medium text-ink">
                      {primaryCourse.title}
                    </h3>
                    <p className="mt-1 truncate text-xs text-ink-muted">
                      Next: {primaryCourse.currentLesson || "Module 2 · Building REST APIs"}
                    </p>

                    <div className="mt-3">
                      <Progress value={primaryCourse.progress || 68} className="h-1.5" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-2">
                  <span className="flex items-center gap-1 text-[11px] font-mono text-ink-muted">
                    <Clock size={13} /> ~15 mins remaining in lesson
                  </span>
                  <Link
                    href={`/courses/${primaryCourse.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-primary hover:underline"
                  >
                    Continue <ChevronRight size={14} />
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* 2. STATS & METRICS ROW (4 KEY PERFORMANCE CARDS) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Streak */}
        <Card className="flex items-center justify-between p-5 rounded-[4px] border border-border bg-surface shadow-xs transition-all hover:border-border-hover">
          <div className="space-y-1">
            <span className="font-mono text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Streak Flame
            </span>
            <p className="font-mono text-2xl font-bold text-ink leading-none">
              {userStats.streak || 7} Days
            </p>
            <p className="text-[11px] font-mono text-primary font-medium">🔥 Streak Active</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-[4px] border border-primary/30 bg-primary/10 text-primary">
            <Flame size={24} />
          </div>
        </Card>

        {/* Card 2: XP */}
        <Card className="flex items-center justify-between p-5 rounded-[4px] border border-border bg-surface shadow-xs transition-all hover:border-border-hover">
          <div className="space-y-1">
            <span className="font-mono text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Total XP
            </span>
            <p className="font-mono text-2xl font-bold text-ink leading-none">
              {(userStats.xp || 1240).toLocaleString()}
            </p>
            <p className="text-[11px] font-mono text-accent font-medium">⚡ Top 10% Learner</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-[4px] border border-accent/30 bg-accent/10 text-accent">
            <Zap size={24} />
          </div>
        </Card>

        {/* Card 3: Daily Goal */}
        <Card className="flex items-center justify-between p-5 rounded-[4px] border border-border bg-surface shadow-xs transition-all hover:border-border-hover">
          <div className="space-y-1">
            <span className="font-mono text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Daily Target
            </span>
            <p className="font-mono text-2xl font-bold text-ink leading-none">
              {userStats.minutesDone || 20} / 30m
            </p>
            <p className="text-[11px] font-mono text-primary font-medium">🎯 66% Completed</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-[4px] border border-primary/30 bg-primary/10 text-primary">
            <Target size={24} />
          </div>
        </Card>

        {/* Card 4: Course Ratio */}
        <Card className="flex items-center justify-between p-5 rounded-[4px] border border-border bg-surface shadow-xs transition-all hover:border-border-hover">
          <div className="space-y-1">
            <span className="font-mono text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Enrolled Courses
            </span>
            <p className="font-mono text-2xl font-bold text-ink leading-none">
              {enrolledCourses.length || 2} Active
            </p>
            <p className="text-[11px] font-mono text-accent font-medium">🎓 1 Certified</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-[4px] border border-accent/30 bg-accent/10 text-accent">
            <Award size={24} />
          </div>
        </Card>
      </div>

      {/* 3. NAVIGATION TABS BAR */}
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={cn(
            "flex items-center gap-2 border-b-2 px-4 py-3 font-serif text-sm font-medium transition-colors",
            activeTab === "overview"
              ? "border-primary text-primary"
              : "border-transparent text-ink-muted hover:text-ink"
          )}
        >
          <Activity size={16} /> Overview & Analytics
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("courses")}
          className={cn(
            "flex items-center gap-2 border-b-2 px-4 py-3 font-serif text-sm font-medium transition-colors",
            activeTab === "courses"
              ? "border-primary text-primary"
              : "border-transparent text-ink-muted hover:text-ink"
          )}
        >
          <BookOpen size={16} /> My Enrolled Courses ({enrolledCourses.length})
        </button>
      </div>

      {/* 4. TAB CONTENT VIEW */}
      {activeTab === "overview" ? (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Left Column (8 cols) */}
          <div className="space-y-8 lg:col-span-8">
            {/* Active Learning Hub Card */}
            {primaryCourse && (
              <Card className="overflow-hidden border border-border bg-surface p-6 rounded-[4px] shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                      Resume Your Learning Path
                    </span>
                    <h2 className="font-serif text-xl font-medium text-ink mt-0.5">
                      {primaryCourse.title}
                    </h2>
                  </div>
                  <Badge variant="brass">{primaryCourse.category}</Badge>
                </div>

                <div className="mt-5 space-y-4">
                  <p className="text-xs text-ink-muted leading-relaxed">
                    {primaryCourse.shortDescription || primaryCourse.description}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[4px] bg-surface-2 p-3.5 border border-border">
                      <span className="text-[11px] font-mono text-ink-muted">Next Upcoming Lesson</span>
                      <p className="mt-1 font-serif text-sm font-medium text-ink">
                        {primaryCourse.currentLesson || "REST API Design Principles"}
                      </p>
                    </div>

                    <div className="rounded-[4px] bg-surface-2 p-3.5 border border-border">
                      <span className="text-[11px] font-mono text-ink-muted">Estimated Completion</span>
                      <p className="mt-1 font-serif text-sm font-medium text-ink">
                        2 Days Remaining
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Progress value={primaryCourse.progress || 68} className="w-32 sm:w-48 h-2" />
                      <span className="font-mono text-xs font-bold text-primary">
                        {primaryCourse.progress || 68}%
                      </span>
                    </div>

                    <Link href={`/courses/${primaryCourse.slug}`}>
                      <Button>
                        Continue Lesson <ArrowRight size={16} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}

            {/* Weekly Analytics Chart */}
            <WeeklyProgress />

            {/* Explore Catalog Recommendations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-medium text-ink">Recommended Learning Tracks</h2>
                <Link
                  href="/courses"
                  className="flex items-center gap-1 text-xs font-mono font-medium text-primary hover:underline"
                >
                  Explore Catalog <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {(recommendedCourses.length > 0 ? recommendedCourses : allCatalogCourses)
                  .slice(0, 2)
                  .map((c) => (
                    <CourseCard key={c.id} course={c} />
                  ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Column (4 cols) */}
          <div className="space-y-8 lg:col-span-4">
            {/* AI Companion Smart Nudge Widget */}
            <AICompanionCard
              message={
                enrolledCourses.length > 0
                  ? `Great momentum, Jordan! You are only 2 lessons away from completing "${enrolledCourses[0].title}".`
                  : "Welcome to UNIGAP! Enroll in your first course to receive customized learning paths and AI mentorship."
              }
              href={primaryCourse ? `/courses/${primaryCourse.slug}` : "/courses"}
            />

            {/* Platform Badges Showcase */}
            <Card className="rounded-[4px] border border-border bg-surface p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-serif text-sm font-medium text-ink">Unlocked Badges</h3>
                <Link href="/achievements" className="text-xs font-mono text-primary hover:underline">
                  View All
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {unlockedBadges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center gap-1 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-primary/30 bg-primary/10 text-primary">
                      <Award size={18} />
                    </div>
                    <p className="text-[10px] font-mono text-ink-muted line-clamp-1">
                      {badge.title}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity Log */}
            <Card className="rounded-[4px] border border-border bg-surface p-5 shadow-sm">
              <h3 className="font-serif text-sm font-medium text-ink border-b border-border pb-3">
                Recent Activity
              </h3>

              <ul className="mt-4 space-y-3.5">
                <li className="flex items-start gap-3 text-xs">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] bg-primary/10 text-primary border border-primary/20">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <p className="font-medium text-ink">Completed Quiz: REST Architecture</p>
                    <p className="text-[10px] font-mono text-ink-muted">Score: 100% · +25 XP</p>
                  </div>
                </li>

                <li className="flex items-start gap-3 text-xs">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] bg-accent/10 text-accent border border-accent/20">
                    <Flame size={15} />
                  </div>
                  <div>
                    <p className="font-medium text-ink">7-Day Streak Milestone Reached!</p>
                    <p className="text-[10px] font-mono text-ink-muted">Earned &quot;Streak Master&quot; badge</p>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      ) : (
        /* MY ENROLLED COURSES TAB */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-medium text-ink">Enrolled Courses Catalog</h2>
            <Link href="/courses">
              <Button size="sm">
                Browse New Courses <ArrowRight size={14} />
              </Button>
            </Link>
          </div>

          {enrolledCourses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border border-border bg-surface rounded-[4px]">
              <BookOpen size={40} className="mx-auto text-primary" />
              <h3 className="mt-4 font-serif text-lg font-medium text-ink">No Enrolled Courses Yet</h3>
              <p className="mt-1 text-xs text-ink-muted">Browse our course catalog and enroll in expert-led programs to start learning.</p>
              <Link href="/courses" className="mt-5 inline-block">
                <Button>Explore Courses</Button>
              </Link>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}


