import Link from "next/link";
import { Clock, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CourseThumb } from "@/components/courses/course-thumb";
import { Course } from "@/lib/types";

export function ContinueLearning({ course }: { course: Course }) {
  return (
    <Card className="overflow-hidden rounded-[4px] border border-border bg-surface">
      <div className="flex flex-col sm:flex-row">
        <CourseThumb
          category={course.category}
          gradient={course.gradient}
          className="h-40 w-full sm:h-auto sm:w-48 shrink-0"
        />
        <div className="flex flex-1 flex-col p-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">Continue Learning</p>
          <h3 className="mt-1 font-serif text-xl font-medium text-ink">{course.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
            <PlayCircle size={15} className="text-primary" /> {course.currentLesson}
          </p>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs font-mono">
              <span className="text-ink-muted">Course progress</span>
              <span className="font-semibold text-primary">{course.progress}%</span>
            </div>
            <Progress value={course.progress ?? 0} />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border">
            <span className="flex items-center gap-1.5 text-xs font-mono text-ink-muted">
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


