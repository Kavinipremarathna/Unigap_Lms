"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle2, PlayCircle, Lock, FileQuestion, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModuleRef } from "@/lib/types";

function LessonIcon({ completed, locked, type }: { completed: boolean; locked: boolean; type: string }) {
  if (completed) return <CheckCircle2 size={16} className="text-success" />;
  if (locked) return <Lock size={14} className="text-ink-muted" />;
  if (type === "quiz") return <FileQuestion size={16} className="text-accent" />;
  return <PlayCircle size={16} className="text-primary" />;
}

export function CourseCurriculum({ modules }: { modules: ModuleRef[] }) {
  const [openModule, setOpenModule] = useState<string | null>(modules[0]?.id ?? null);

  return (
    <div className="divide-y divide-border rounded-xl border border-border bg-surface">
      {modules.map((mod, i) => {
        const open = openModule === mod.id;
        const completedCount = mod.lessons.filter((l) => l.completed).length;

        return (
          <div key={mod.id}>
            <button
              onClick={() => setOpenModule(open ? null : mod.id)}
              className="flex w-full items-center justify-between gap-4 p-4 text-left"
              aria-expanded={open}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Module {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-0.5 font-semibold text-ink">{mod.title}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-ink-muted">{completedCount}/{mod.lessons.length}</span>
                <ChevronDown size={18} className={cn("text-ink-muted transition-transform", open && "rotate-180")} />
              </div>
            </button>
            {open && (
              <ul className="space-y-1 px-4 pb-4">
                {mod.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5",
                      lesson.locked ? "opacity-60" : "hover:bg-surface-2"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <LessonIcon completed={lesson.completed} locked={lesson.locked} type={lesson.type} />
                      <span className="text-sm text-ink">{lesson.title}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-ink-muted">
                      <Clock size={12} /> {lesson.durationMin}m
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
