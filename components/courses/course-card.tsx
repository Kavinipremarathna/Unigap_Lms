"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Users, Clock, CheckCircle2, PlayCircle, Lock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CourseThumb } from "./course-thumb";
import { Course } from "@/lib/types";
import { instructors } from "@/lib/mock/instructors";
import { enrollInCourse, getUserStats } from "@/lib/services/user-progress";
import { isUserAuthenticated } from "@/lib/services/auth.service";

export function CourseCard({ course }: { course: Course }) {
  const router = useRouter();
  const stats = typeof window !== "undefined" ? getUserStats() : { enrolledCourseIds: [] as string[] };
  const isEnrolled = course.enrolled || stats.enrolledCourseIds?.includes(course.id) || stats.enrolledCourseIds?.includes(course.slug);
  const [enrolledState, setEnrolledState] = useState(isEnrolled);

  const foundInstructor = instructors.find((i) => i.id === course.instructorId);
  const instructorDisplayName =
    course.instructorName ||
    foundInstructor?.name ||
    (course.instructorId && !course.instructorId.startsWith("ins-")
      ? course.instructorId
      : "Alexander Reed");

  const handleCardClick = (e: React.MouseEvent) => {
    if (!enrolledState && !isUserAuthenticated()) {
      e.preventDefault();
      router.push(`/register?redirect=/courses/${course.slug}`);
    }
  };

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isUserAuthenticated()) {
      router.push(`/register?redirect=/courses/${course.slug}`);
      return;
    }

    enrollInCourse(course);
    setEnrolledState(true);
  };

  return (
    <Link href={`/courses/${course.slug}`} onClick={handleCardClick} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-[#920090]/50 hover:shadow-xl shadow-xs">
        <div className="relative overflow-hidden">
          <CourseThumb category={course.category} gradient={course.gradient} thumbnailUrl={course.thumbnailUrl} className="h-40 w-full transition-transform duration-500 group-hover:scale-105" />
          
          {/* Overlay Badge Pills */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="rounded-full bg-surface/90 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold text-[#520051] dark:text-[#fde8fc] border border-border/80 shadow-xs">
              {course.category}
            </span>
            {course.isFree || course.price === 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-extrabold text-white shadow-md">
                <Sparkles size={11} /> FREE
              </span>
            ) : (
              <span className="rounded-full bg-[#520051] px-3 py-1 text-[11px] font-extrabold text-white shadow-md dark:bg-[#920090]">
                ${course.price}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 text-base font-bold text-ink transition-colors group-hover:text-[#920090] dark:group-hover:text-[#f14df0] leading-snug">
            {course.title}
          </h3>
          
          <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-ink-muted">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#520051]/10 text-[#520051] font-mono text-[10px] font-bold border border-[#520051]/20 dark:bg-[#520051] dark:text-[#fde8fc]">
              {instructorDisplayName[0]}
            </div>
            <span className="truncate">{instructorDisplayName}</span>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs font-mono text-ink-muted pt-3 border-t border-border/60">
            <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
              <Star size={13} className="fill-amber-400 text-amber-400" /> {course.rating || 5.0}
            </span>
            <span className="flex items-center gap-1">
              <Users size={13} /> {(course.learners || 0).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} /> {course.durationHours || 1}h
            </span>
          </div>

          <div className="mt-auto pt-4">
            {enrolledState ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={13} /> Enrolled
                  </span>
                  <span className="font-bold text-[#920090] dark:text-[#f14df0]">{course.progress || 0}%</span>
                </div>
                <Progress value={course.progress || 0} className="h-2" />
                <div className="pt-2 flex justify-end">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#520051] dark:text-[#fde8fc] group-hover:text-[#920090] group-hover:underline">
                    <PlayCircle size={14} /> Continue Learning →
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 pt-2">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">Access</p>
                  <p className="font-mono text-sm font-extrabold text-ink">
                    {course.isFree || course.price === 0 ? "Free Course" : `$${course.price}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleEnrollClick}
                  className="rounded-xl bg-[#520051] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#920090] active:scale-95 flex items-center gap-1.5 shadow-md cursor-pointer dark:bg-[#920090] dark:hover:bg-[#d400d1]"
                >
                  {course.isFree ? "Enroll Free" : "Enroll Now"}
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}


