"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle2, PlayCircle, Lock, FileQuestion, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModuleRef } from "@/lib/types";

function LessonIcon({ completed, locked, type }: { completed: boolean; locked: boolean; type: string }) {
  if (completed) return <CheckCircle2 size={16} className="text-accent" />;
  if (locked) return <Lock size={14} className="text-ink-muted" />;
  if (type === "quiz") return <FileQuestion size={16} className="text-primary" />;
  return <PlayCircle size={16} className="text-primary" />;
}

export function CourseCurriculum({ modules }: { modules: ModuleRef[] }) {
  const [openModule, setOpenModule] = useState<string | null>(modules[0]?.id ?? null);

  return (
    <div className="divide-y divide-border rounded-[4px] border border-border bg-surface">
      {modules.map((mod, i) => {
        const open = openModule === mod.id;
        const completedCount = mod.lessons.filter((l) => l.completed).length;

        return (
          <div key={mod.id}>
            <button
              onClick={() => setOpenModule(open ? null : mod.id)}
              className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-surface-2 transition-colors"
              aria-expanded={open}
            >
              <div>
                <p className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
                  Module {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-0.5 font-serif text-sm font-medium text-ink">{mod.title}</p>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-xs text-ink-muted">{completedCount}/{mod.lessons.length}</span>
                <ChevronDown size={18} className={cn("text-ink-muted transition-transform duration-200", open && "rotate-180")} />
              </div>
            </button>
            {open && (
              <ul className="space-y-1.5 px-4 pb-4">
                {mod.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-[4px] px-3.5 py-2.5 transition-all",
                      lesson.locked 
                        ? "bg-bg/50 border border-dashed border-border opacity-75 backdrop-blur-xs" 
                        : "bg-surface-2/60 hover:bg-surface-2 border border-transparent hover:border-border"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <LessonIcon completed={lesson.completed} locked={lesson.locked} type={lesson.type} />
                      <span className={cn("text-sm", lesson.locked ? "text-ink-muted" : "text-ink font-medium")}>
                        {lesson.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {lesson.locked && (
                        <span className="font-mono text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                          Locked
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs font-mono text-ink-muted">
                        <Clock size={12} /> {lesson.durationMin}m
                      </span>
                    </div>
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


