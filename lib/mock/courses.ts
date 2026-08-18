import { Course, ModuleRef } from "@/lib/types";

function curriculum(
  mods: { title: string; lessons: { title: string; min: number; type?: "video" | "reading" | "quiz"; done?: boolean; locked?: boolean }[] }[]
): ModuleRef[] {
  return mods.map((m, mi) => ({
    id: `mod-${mi + 1}`,
    title: m.title,
    lessons: m.lessons.map((l, li) => ({
      id: `mod-${mi + 1}-lesson-${li + 1}`,
      title: l.title,
      durationMin: l.min,
      type: l.type ?? "video",
      completed: !!l.done,
      locked: !!l.locked,
    })),
  }));
}

export const courses: Course[] = [];

export function getStoredCourses(): Course[] {
  if (typeof window === "undefined") return courses;
  try {
    const custom = localStorage.getItem("unigap_admin_courses");
    if (custom) {
      const parsed: Course[] = JSON.parse(custom);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return courses;
}

export function getPublishedCourses(): Course[] {
  const all = getStoredCourses();
  return all.filter((c) => c.status !== "Draft" && c.isPublished !== false);
}

export function saveCustomCourse(newCourse: Course): Course {
  if (typeof window === "undefined") return newCourse;
  const current = getStoredCourses();
  const existingIndex = current.findIndex((c) => c.id === newCourse.id);
  let updated: Course[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = newCourse;
  } else {
    updated = [newCourse, ...current];
  }
  try {
    localStorage.setItem("unigap_admin_courses", JSON.stringify(updated));
    // Trigger custom window event so open pages re-render live
    window.dispatchEvent(new Event("unigap_courses_updated"));
  } catch {
    // fallback
  }
  return newCourse;
}

export function deleteStoredCourse(id: string): void {
  if (typeof window === "undefined") return;
  const current = getStoredCourses();
  const updated = current.filter((c) => c.id !== id && c.slug !== id);
  try {
    localStorage.setItem("unigap_admin_courses", JSON.stringify(updated));
    window.dispatchEvent(new Event("unigap_courses_updated"));
  } catch {
    // fallback
  }
}

export function getCourseBySlug(slug: string): Course | undefined {
  const all = getStoredCourses();
  return all.find((c) => c.slug === slug);
}

export const categories = Array.from(new Set(courses.map((c) => c.category)));

