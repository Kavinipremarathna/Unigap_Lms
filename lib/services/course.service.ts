import { getStoredCourses, getPublishedCourses, getCourseBySlug } from "@/lib/mock/courses";
import { getEnrolledUserCourses } from "@/lib/services/user-progress";
import { Course } from "@/lib/types";

export async function getCourses(): Promise<Course[]> {
  return getPublishedCourses();
}

export async function getFeaturedCourses(limit = 4): Promise<Course[]> {
  const all = getPublishedCourses();
  return [...all].sort((a, b) => (b.learners || 0) - (a.learners || 0)).slice(0, limit);
}

export async function getEnrolledCourses(): Promise<Course[]> {
  return typeof window !== "undefined" ? getEnrolledUserCourses() : [];
}

export async function getRecommendedCourses(limit = 3): Promise<Course[]> {
  const all = getStoredCourses();
  const enrolled = await getEnrolledCourses();
  const enrolledSlugs = new Set(enrolled.map((c) => c.slug));
  return all.filter((c) => !enrolledSlugs.has(c.slug)).slice(0, limit);
}

export async function getCourseBySlugService(slug: string): Promise<Course | undefined> {
  return getCourseBySlug(slug);
}

export async function getCategories(): Promise<string[]> {
  const all = getStoredCourses();
  return Array.from(new Set(all.map((c) => c.category)));
}
