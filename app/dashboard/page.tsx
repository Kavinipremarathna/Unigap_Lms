"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, ArrowRight, BookOpen, Award, Sparkles, LogOut, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseCard } from "@/components/courses/course-card";
import { ContinueLearning } from "@/components/dashboard/continue-learning";
import { WeeklyProgress } from "@/components/dashboard/weekly-progress";
import { StreakCard } from "@/components/gamification/streak-card";
import { XPCard } from "@/components/gamification/xp-card";
import { GoalCard } from "@/components/gamification/goal-card";
import { AICompanionCard } from "@/components/ai/ai-companion-card";
import { getStoredCourses } from "@/lib/mock/courses";
import { getEnrolledUserCourses, getUserStats, UserStats } from "@/lib/services/user-progress";
import { achievements } from "@/lib/mock/achievements";
import { Course } from "@/lib/types";

export default function DashboardPage() {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [allCatalogCourses, setAllCatalogCourses] = useState<Course[]>([]);
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
    const stats = getUserStats();
    setUserStatsState(stats);

    const enrolled = getEnrolledUserCourses();
    setEnrolledCourses(enrolled);

    const catalog = getStoredCourses();
    setAllCatalogCourses(catalog);
  };

  useEffect(() => {
    loadUserData();
    window.addEventListener("unigap_user_stats_updated", loadUserData);
    window.addEventListener("unigap_courses_updated", loadUserData);
    return () => {
      window.removeEventListener("unigap_user_stats_updated", loadUserData);
      window.removeEventListener("unigap_courses_updated", loadUserData);
    };
  }, []);

  const primaryCourse = enrolledCourses[0];
  const recommendedCourses = allCatalogCourses.filter(
    (c) => !userStats.enrolledCourseIds.includes(c.id) && !userStats.enrolledCourseIds.includes(c.slug)
  );

  const unlocked = achievements.slice(0, 4);

  return (
    <div className="container-app py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#520051]">Welcome back, Learner 👋</h1>
          <p className="mt-1 text-sm text-slate-500">Track your progress and build real-world skills.</p>
        </div>
        <Link href="/notifications" className="relative rounded-full border border-slate-200 bg-white p-2.5 shadow-xs hover:border-[#920090]/40">
          <Bell size={18} className="text-[#520051]" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500" />
        </Link>
      </div>

      {/* Gamification row */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StreakCard days={userStats.streak} />
        <XPCard xp={userStats.xp} level={userStats.level} xpToNext={userStats.level * 200} />
        <GoalCard minutesDone={userStats.minutesDone} minutesGoal={30} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Enrolled Courses / Empty State */}
          {enrolledCourses.length > 0 ? (
            <>
              {primaryCourse && (
                <section>
                  <h2 className="mb-3 text-lg font-bold text-[#520051]">Continue Learning</h2>
                  <ContinueLearning course={primaryCourse} />
                </section>
              )}

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#520051]">Your Enrolled Courses ({enrolledCourses.length})</h2>
                  <Link href="/courses" className="flex items-center gap-1 text-xs font-bold text-[#920090] hover:underline">
                    Browse Catalog <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {enrolledCourses.map((c) => (
                    <CourseCard key={c.id} course={c} />
                  ))}
                </div>
              </section>
            </>
          ) : (
            <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#faf5fa] to-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#520051] text-white shadow-md">
                <BookOpen size={28} />
              </div>
              <h2 className="mt-4 text-xl font-extrabold text-[#520051]">Start Your Learning Journey</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                You haven&apos;t enrolled in any courses yet. Browse our platform catalog and enroll in expert-led courses to start learning.
              </p>
              <div className="mt-6">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#520051] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#920090] transition"
                >
                  Explore Course Catalog <ArrowRight size={14} />
                </Link>
              </div>
            </section>
          )}

          {/* Weekly progress */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-[#520051]">Weekly Progress</h2>
            <WeeklyProgress />
          </section>

          {/* Available Catalog Courses */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#520051]">Explore Catalog Courses</h2>
              <Link href="/courses" className="flex items-center gap-1 text-xs font-bold text-[#920090] hover:underline">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            {recommendedCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {recommendedCourses.slice(0, 4).map((c) => (
                  <CourseCard key={c.id} course={c} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {allCatalogCourses.slice(0, 4).map((c) => (
                  <CourseCard key={c.id} course={c} />
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          {/* AI companion */}
          <section>
            <AICompanionCard
              message={
                enrolledCourses.length > 0
                  ? `You're making great progress in ${enrolledCourses[0].title}! Keep up the daily learning habit.`
                  : "Welcome to UNIGAP! Enroll in your first course to get personalized learning guidance and AI support."
              }
              href={primaryCourse ? `/courses/${primaryCourse.slug}` : "/courses"}
            />
          </section>

          {/* Achievements */}
          <section>
            <Card className="rounded-2xl border-slate-200 shadow-xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-extrabold text-[#520051]">Platform Badges</CardTitle>
                  <Link href="/achievements" className="text-xs font-bold text-[#920090]">View all</Link>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {unlocked.map((a) => (
                    <div key={a.id} className="flex flex-col items-center gap-1 text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#520051] to-[#d400d1] text-white shadow-xs">
                        <Award size={18} />
                      </div>
                      <p className="text-[10px] font-semibold text-slate-600 line-clamp-1">{a.title}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Activity / Welcome Note */}
          <section>
            <Card className="rounded-2xl border-slate-200 shadow-xs">
              <CardContent className="p-5">
                <CardTitle className="text-sm font-extrabold text-[#520051]">Account Activity</CardTitle>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fde8fc] text-[#520051]">
                      <CheckCircle2 size={15} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#520051]">Joined UNIGAP Platform</p>
                      <p className="text-[10px] text-slate-400">Account Active</p>
                    </div>
                  </li>
                  {enrolledCourses.length > 0 && (
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#faf5fa] text-[#920090]">
                        <BookOpen size={15} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#520051]">Enrolled in {enrolledCourses[0].title}</p>
                        <p className="text-[10px] text-slate-400">Active Course</p>
                      </div>
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Navigation link back to site */}
          <Link href="/" className="block w-full">
            <Button variant="outline" className="w-full rounded-xl border-slate-200 text-slate-600 hover:border-[#520051] hover:text-[#520051]">
              <LogOut size={16} className="mr-2" /> Back to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
