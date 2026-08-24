import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StreakCard({ days, className }: { days: number; className?: string }) {
  return (
    <Card className={cn("flex items-center gap-4 p-5 rounded-[4px] border border-border bg-surface", className)}>
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] border border-primary/30 bg-primary/15">
        <Flame className="text-primary" size={22} />
      </div>
      <div>
        <p className="font-mono text-2xl font-bold text-ink leading-none">{days}</p>
        <p className="mt-1 text-xs font-mono text-ink-muted">Day streak — keep it alive</p>
      </div>
    </Card>
  );
}


