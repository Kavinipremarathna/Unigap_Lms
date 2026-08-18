import Link from "next/link";
import { Clock, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CourseThumb } from "@/components/courses/course-thumb";
import { Course } from "@/lib/types";

export function ContinueLearning({ course }: { course: Course }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <CourseThumb
          category={course.category}
          gradient={course.gradient}
          className="h-40 w-full sm:h-auto sm:w-48 shrink-0"
        />
        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Continue Learning</p>
          <h3 className="mt-1 text-lg font-bold text-ink">{course.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
            <PlayCircle size={15} /> {course.currentLesson}
          </p>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium">
              <span className="text-ink-muted">Course progress</span>
              <span className="text-ink">{course.progress}%</span>
            </div>
            <Progress value={course.progress ?? 0} />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-1 text-xs text-ink-muted">
              <Clock size={13} /> Last accessed {course.lastAccessed}
            </span>
            <Link href={`/courses/${course.slug}`}>
              <Button size="sm">Continue Learning</Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
