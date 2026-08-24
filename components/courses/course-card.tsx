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
      <Card className="flex h-full flex-col overflow-hidden rounded-[4px] border border-border bg-surface transition-all duration-200 hover:-translate-y-1 hover:border-border-hover hover:shadow-xl">
        <CourseThumb category={course.category} gradient={course.gradient} className="h-36 w-full" />
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="default">{course.category}</Badge>
            {course.isFree ? (
              <Badge variant="moss">Free</Badge>
            ) : (
              <Badge variant="brass">${course.price}</Badge>
            )}
          </div>

          <h3 className="mt-3 line-clamp-2 font-serif text-base font-medium text-ink transition-colors group-hover:text-primary">
            {course.title}
          </h3>
          <p className="mt-1 text-xs text-ink-muted">{instructorDisplayName}</p>

          <div className="mt-4 flex items-center gap-3.5 text-xs font-mono text-ink-muted">
            <span className="flex items-center gap-1">
              <Star size={13} className="fill-primary text-primary" /> {course.rating || 0}
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
                  <span className="inline-flex items-center gap-1 font-semibold text-accent">
                    <CheckCircle2 size={13} /> Enrolled
                  </span>
                  <span className="font-semibold text-primary">{course.progress || 0}%</span>
                </div>
                <Progress value={course.progress || 0} />
                <div className="mt-3 flex justify-end">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
                    <PlayCircle size={14} /> Continue Learning →
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                <span className="font-mono text-sm font-semibold text-ink">
                  {course.isFree ? "Free Access" : `$${course.price}`}
                </span>
                <button
                  type="button"
                  onClick={handleEnrollClick}
                  className="rounded-[4px] bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-fg transition hover:opacity-90 active:scale-95 flex items-center gap-1 shadow-sm"
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


