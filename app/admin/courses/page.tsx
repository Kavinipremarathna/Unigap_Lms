"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  BookOpen,
  Users,
  Star,
  MoreVertical,
  Eye,
  EyeOff,
  Trash2,
  Edit,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getStoredCourses, deleteStoredCourse, saveCustomCourse } from "@/lib/mock/courses";
import { getStoredInstructors } from "@/lib/mock/instructors";
import { getEnrolledUserCourses } from "@/lib/services/user-progress";

type CourseStatus = "Published" | "Draft";

type Course = {
  id: string | number;
  slug?: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  students: number;
  rating: number;
  price: number;
  status: CourseStatus;
  lessons: number;
  duration: string;
};

const initialCourses: Course[] = [];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | CourseStatus>("All");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState<"All" | Course["level"]>("All");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetch("/api/admin/courses");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.courses)) {
            const mapped: Course[] = data.courses.map((c: any) => ({
              id: c.id,
              slug: c.slug,
              title: c.title,
              description: c.description || c.shortDescription,
              instructor: c.instructorName || "Unassigned",
              category: c.category,
              level: c.level || "Beginner",
              students: c.studentsCount || 0,
              rating: typeof c.rating === "number" ? c.rating : 5.0,
              price: Number(c.price) || 0,
              status: c.status === "Draft" || c.isPublished === false ? "Draft" : "Published",
              lessons: c.lessonsCount || 0,
              duration: `${c.durationHours || 0}h`,
            }));
            setCourses(mapped);
            return;
          }
        }
      } catch (err) {
        console.error("Fetch courses error:", err);
      }

      const stored = getStoredCourses();
      const realEnrolledCourses = getEnrolledUserCourses();
      const availableInstructors = getStoredInstructors();
      const mapped: Course[] = stored.map((c, idx) => {
        const foundInstructor = availableInstructors.find((i) => i.id === c.instructorId);
        const instructorName =
          c.instructorName ||
          foundInstructor?.name ||
          (c.instructorId && !c.instructorId.startsWith("ins-") ? c.instructorId : "Unassigned");
        const totalLessons =
          c.curriculum?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;

        const realEnrollmentsForThisCourse = realEnrolledCourses.filter(
          (e) => e.id === c.id || e.slug === c.slug
        ).length;

        const courseStatus: CourseStatus =
          c.status === "Draft" || c.isPublished === false ? "Draft" : "Published";

        return {
          id: idx + 1,
          title: c.title,
          description: c.shortDescription || c.description,
          instructor: instructorName,
          category: c.category,
          level: c.level,
          students: realEnrollmentsForThisCourse,
          rating: typeof c.rating === "number" ? c.rating : 0,
          price: c.price,
          status: courseStatus,
          lessons: totalLessons,
          duration: `${c.durationHours || 0}h`,
        };
      });
      setCourses(mapped);
    };

    loadCourses();
    window.addEventListener("unigap_courses_updated", loadCourses);
    window.addEventListener("unigap_user_stats_updated", loadCourses);
    return () => {
      window.removeEventListener("unigap_courses_updated", loadCourses);
      window.removeEventListener("unigap_user_stats_updated", loadCourses);
    };
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const search = query.toLowerCase();

      const matchesSearch =
        course.title.toLowerCase().includes(search) ||
        course.instructor
          .toLowerCase()
          .includes(search) ||
        course.category
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        status === "All" ||
        course.status === status;

      const matchesCategory =
        category === "All" ||
        course.category === category;

      const matchesLevel =
        level === "All" ||
        course.level === level;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesLevel
      );
    });
  }, [courses, query, status, category, level]);

  const togglePublish = async (id: string | number) => {
    const target = courses.find((c) => c.id === id);
    if (!target) return;
    const nextStatus: CourseStatus = target.status === "Published" ? "Draft" : "Published";

    setCourses((current) =>
      current.map((course) =>
        course.id === id
          ? {
              ...course,
              status: nextStatus,
            }
          : course
      )
    );

    try {
      await fetch("/api/admin/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
    } catch (e) {
      console.error("Toggle publish API error:", e);
    }

    const storedList = getStoredCourses();
    const match =
      storedList.find((c) => c.id === id || c.title.toLowerCase().trim() === target.title.toLowerCase().trim());

    if (match) {
      saveCustomCourse({
        ...match,
        status: nextStatus,
        isPublished: nextStatus === "Published",
      });
    }
  };

  const deleteCourse = async (id: string | number) => {
    const course = courses.find((item) => item.id === id);
    if (!course) return;

    const confirmed = window.confirm(`Delete "${course.title}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      await fetch(`/api/admin/courses?id=${id}`, {
        method: "DELETE",
      });
    } catch (e) {
      console.error("Delete course API error:", e);
    }

    const storedList = getStoredCourses();
    const match = storedList.find((c) => c.id === id || c.title === course.title);
    if (match) {
      deleteStoredCourse(match.id);
      deleteStoredCourse(match.slug);
    }

    setCourses((current) => current.filter((item) => item.id !== id));
  };

  const totalStudents = courses.reduce(
    (total, course) => total + course.students,
    0
  );

  const publishedCount = courses.filter(
    (course) => course.status === "Published"
  ).length;

  const draftCount = courses.filter(
    (course) => course.status === "Draft"
  ).length;

  return (
    <AdminShell>
      <main className="px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#520051]">
              Courses
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create, edit and manage all courses on UNIGAP.
            </p>
          </div>

          <Link
            href="/admin/courses/create"
            className="inline-flex items-center gap-2 rounded-xl bg-[#520051] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#920090]"
          >
            <Plus size={17} />
            Add Course
          </Link>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button type="button" onClick={() => setStatus("All")} className="text-left cursor-pointer">
            <StatCard
              icon={<BookOpen size={20} />}
              value={courses.length}
              label="Total Courses"
            />
          </button>

          <button type="button" onClick={() => setStatus("Published")} className="text-left cursor-pointer">
            <StatCard
              icon={<Eye size={20} />}
              value={publishedCount}
              label="Published"
            />
          </button>

          <button type="button" onClick={() => setStatus("Draft")} className="text-left cursor-pointer">
            <StatCard
              icon={<EyeOff size={20} />}
              value={draftCount}
              label="Drafts"
            />
          </button>

          <StatCard
            icon={<Users size={20} />}
            value={totalStudents}
            label="Total Enrollments"
          />
        </div>

        {/* Filters */}
        <div className="mt-8 rounded-2xl border border-[#eee5ee] bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-4">
            {/* Search */}
            <div className="relative lg:col-span-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Search courses..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10"
              />
            </div>

            {/* Status */}
            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as
                    | "All"
                    | CourseStatus
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#920090]"
            >
              <option value="All">All Status</option>
              <option value="Published">
                Published
              </option>
              <option value="Draft">Draft</option>
            </select>

            {/* Category */}
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#920090]"
            >
              <option value="All">All Categories</option>
              <option value="Web Development">
                Web Development
              </option>
              <option value="Cloud">
                Cloud
              </option>
              <option value="Design">
                Design
              </option>
              <option value="Data Science">
                Data Science
              </option>
            </select>

            {/* Level */}
            <select
              value={level}
              onChange={(e) =>
                setLevel(
                  e.target.value as
                    | "All"
                    | Course["level"]
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#920090]"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">
                Beginner
              </option>
              <option value="Intermediate">
                Intermediate
              </option>
              <option value="Advanced">
                Advanced
              </option>
            </select>
          </div>
        </div>

        {/* Course table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#eee5ee] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-slate-100 bg-[#faf7fb] text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Course
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Instructor
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Students
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Rating
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Price
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="transition-colors hover:bg-[#faf7fb]/70"
                  >
                    {/* Course */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <CourseIcon
                          category={course.category}
                        />

                        <div>
                          <Link
                            href={`/admin/courses/${course.id}/edit`}
                            className="font-semibold text-[#520051] hover:text-[#920090]"
                          >
                            {course.title}
                          </Link>

                          <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                            {course.description}
                          </p>

                          <div className="mt-1 flex gap-2 text-[10px] text-slate-400">
                            <span>
                              {course.lessons} lessons
                            </span>

                            <span>•</span>

                            <span>
                              {course.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Instructor */}
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-[#520051]">
                        {course.instructor}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {course.level}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-5">
                      <span className="rounded-full bg-[#f7ddf7] px-2.5 py-1 text-xs font-semibold text-[#920090]">
                        {course.category}
                      </span>
                    </td>

                    {/* Students */}
                    <td className="px-6 py-5">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                        <Users size={14} />
                        {course.students.toLocaleString()}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-5">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                        <Star
                          size={14}
                          className="fill-amber-400 text-amber-400"
                        />

                        {course.rating || "—"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-5">
                      <span className="text-sm font-semibold text-[#520051]">
                        {course.price === 0
                          ? "Free"
                          : `$${course.price}`}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          course.status === "Published"
                            ? "bg-green-50 text-green-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/courses/${course.id}/edit`}
                          className="rounded-lg p-2 text-slate-400 hover:bg-[#f7ddf7] hover:text-[#920090]"
                          title="Edit course"
                        >
                          <Edit size={16} />
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            togglePublish(course.id)
                          }
                          className="rounded-lg p-2 text-slate-400 hover:bg-green-50 hover:text-green-600"
                          title={
                            course.status === "Published"
                              ? "Unpublish"
                              : "Publish"
                          }
                        >
                          {course.status ===
                          "Published" ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteCourse(course.id)
                          }
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                          title="Delete course"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCourses.length === 0 && (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#faf5fa] text-[#520051]">
                <BookOpen size={24} />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#520051]">
                {courses.length === 0 ? "No Courses Created Yet" : "No courses match your search"}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {courses.length === 0
                  ? "Click 'Add Course' above to create and publish your first course."
                  : "Try changing your search query or filters."}
              </p>
            </div>
          )}
        </div>
      </main>
    </AdminShell>
  );
}

/* ---------------- Components ---------------- */

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-[#eee5ee] bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7ddf7] text-[#920090]">
        {icon}
      </div>

      <p className="mt-4 text-2xl font-bold text-[#520051]">
        {value.toLocaleString()}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {label}
      </p>
    </div>
  );
}

function CourseIcon({
  category,
}: {
  category: string;
}) {
  const initials = category
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#520051] to-[#d400d1] text-xs font-bold text-white">
      {initials}
    </div>
  );
}