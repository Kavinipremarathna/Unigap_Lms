"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Users, Clock, CheckCircle2, PlayCircle, Lock } from "lucide-react";
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
      router.push(`/login?redirect=/courses/${course.slug}`);
    }
  };

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isUserAuthenticated()) {
      router.push(`/login?redirect=/courses/${course.slug}`);
      return;
    }

    enrollInCourse(course);
    setEnrolledState(true);
  };

  return (
    <Link href={`/courses/${course.slug}`} onClick={handleCardClick} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#eee5ee] bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[#920090]/40 hover:shadow-xl shadow-xs">
        <CourseThumb category={course.category} gradient={course.gradient} thumbnailUrl={course.thumbnailUrl} className="h-36 w-full" />
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-[#920090] border border-purple-100">
              {course.category}
            </span>
            {course.isFree ? (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">Free</span>
            ) : (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">${course.price}</span>
            )}
          </div>

          <h3 className="mt-3 line-clamp-2 text-base font-bold text-[#520051] transition-colors group-hover:text-[#920090]">
            {course.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500 font-medium">{instructorDisplayName}</p>

          <div className="mt-4 flex items-center gap-3.5 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1 font-bold text-amber-600">
              <Star size={13} className="fill-amber-400 text-amber-400" /> {course.rating || 0}
            </span>
            <span className="flex items-center gap-1">
              <Users size={13} /> {(course.learners || 0).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} /> {course.durationHours || 1}h
            </span>
          </div>

          <div className="mt-auto pt-5">
            {enrolledState ? (
              <div>
                <div className="mb-2 flex items-center justify-between text-xs font-mono">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                    <CheckCircle2 size={13} /> Enrolled
                  </span>
                  <span className="font-semibold text-[#920090]">{course.progress || 0}%</span>
                </div>
                <Progress value={course.progress || 0} />
                <div className="mt-3 flex justify-end">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#520051] group-hover:text-[#920090] group-hover:underline">
                    <PlayCircle size={14} /> Continue Learning →
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 border-t border-[#eee5ee] pt-3">
                <span className="font-mono text-sm font-bold text-[#520051]">
                  {course.isFree ? "Free Access" : `$${course.price}`}
                </span>
                <button
                  type="button"
                  onClick={handleEnrollClick}
                  className="rounded-xl bg-[#520051] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#920090] active:scale-95 flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  Enroll Now
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}


