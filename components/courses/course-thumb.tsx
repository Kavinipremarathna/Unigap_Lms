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
  className,
}: {
  category: string;
  gradient: [string, string];
  className?: string;
}) {
  const iconName = categoryIcon[category] ?? "BookOpen";
  const Icon = getSafeIcon(iconName);

  return (
    <div
      className={className}
      style={{
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
      }}
    >
      <div className="flex h-full w-full items-center justify-center">
        <Icon size={36} className="text-white/90" strokeWidth={1.6} />
      </div>
    </div>
  );
}
