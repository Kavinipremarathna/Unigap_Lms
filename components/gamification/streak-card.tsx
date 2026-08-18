import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StreakCard({ days, className }: { days: number; className?: string }) {
  return (
    <Card className={cn("flex items-center gap-4 p-5", className)}>
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-streak/10">
        <Flame className="text-streak" size={24} fill="currentColor" fillOpacity={0.15} />
      </div>
      <div>
        <p className="text-2xl font-bold text-ink leading-none">{days}</p>
        <p className="mt-1 text-xs font-medium text-ink-muted">Day streak — keep it alive</p>
      </div>
    </Card>
  );
}
