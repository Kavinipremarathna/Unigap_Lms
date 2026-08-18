"use client";

import { Course } from "@/lib/types";
import { getStoredCourses, saveCustomCourse } from "@/lib/mock/courses";

export interface UserStats {
  streak: number;
  xp: number;
  level: number;
  minutesDone: number;
  completedLessons: number;
  enrolledCourseIds: string[];
  lessonProgress: Record<string, number>; // courseSlug -> percentage
}

const DEFAULT_STATS: UserStats = {
  streak: 0,
  xp: 0,
  level: 1,
  minutesDone: 0,
  completedLessons: 0,
  enrolledCourseIds: [],
  lessonProgress: {},
};

export function getUserStats(): UserStats {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const data = localStorage.getItem("unigap_user_stats");
    if (!data) return DEFAULT_STATS;
    const parsed = JSON.parse(data);
    return { ...DEFAULT_STATS, ...parsed };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: Partial<UserStats>): UserStats {
  if (typeof window === "undefined") return DEFAULT_STATS;
  const current = getUserStats();
  const updated: UserStats = { ...current, ...stats };
  try {
    localStorage.setItem("unigap_user_stats", JSON.stringify(updated));
    window.dispatchEvent(new Event("unigap_user_stats_updated"));
  } catch {
    // fallback
  }
  return updated;
}

export function enrollInCourse(course: Course): void {
  if (typeof window === "undefined") return;
  const stats = getUserStats();
  const alreadyEnrolled = stats.enrolledCourseIds.includes(course.id) || stats.enrolledCourseIds.includes(course.slug);
  
  if (!alreadyEnrolled) {
    const updatedIds = [...stats.enrolledCourseIds, course.id, course.slug];
    const initialProgress = { ...stats.lessonProgress, [course.slug]: 0, [course.id]: 0 };
    saveUserStats({
      enrolledCourseIds: updatedIds,
      lessonProgress: initialProgress,
      xp: stats.xp + 100, // reward 100 XP for enrolling in a new course
    });

    // Increase course learners count by 1 in real time
    saveCustomCourse({
      ...course,
      learners: (course.learners || 0) + 1,
    });
  }
}

export function getEnrolledUserCourses(): Course[] {
  const allCourses = getStoredCourses();
  const stats = getUserStats();
  if (stats.enrolledCourseIds.length === 0) return [];

  return allCourses
    .filter((c) => stats.enrolledCourseIds.includes(c.id) || stats.enrolledCourseIds.includes(c.slug))
    .map((c) => {
      const prog = stats.lessonProgress[c.slug] ?? stats.lessonProgress[c.id] ?? 0;
      return {
        ...c,
        enrolled: true,
        progress: prog,
      };
    });
}
