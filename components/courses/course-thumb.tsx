import { useState } from "react";
import { getSafeIcon } from "@/components/ui/safe-icon";

const categoryIcon: Record<string, string> = {
  "Web Development": "Code2",
  "Programming": "Terminal",
  "Data Science": "BarChart3",
  "Cloud Computing": "Cloud",
  "Software Engineering": "GitBranch",
  "Artificial Intelligence": "BrainCircuit",
  "Cybersecurity": "ShieldCheck",
  "Databases": "Database",
  "Design": "PenTool",
  "DevOps": "Workflow",
  "Product": "Compass",
};

export function CourseThumb({
  category,
  gradient,
  thumbnailUrl,
  className,
}: {
  category: string;
  gradient?: [string, string];
  thumbnailUrl?: string | null;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const iconName = categoryIcon[category] ?? "BookOpen";
  const Icon = getSafeIcon(iconName);

  if (thumbnailUrl && !imgError) {
    return (
      <div className={`${className} relative overflow-hidden bg-slate-900 border-b border-border`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailUrl}
          alt={category}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div
      className={`${className} relative overflow-hidden bg-surface-2 border-b border-border`}
    >
      {/* Subtle background glow */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 40%, var(--primary) 0%, transparent 70%)`
        }}
      />
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-[4px] border border-border bg-surface/90 shadow-sm">
          <Icon size={24} className="text-primary" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}


