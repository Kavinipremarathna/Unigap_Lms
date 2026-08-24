import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function XPCard({
  xp,
  level,
  xpToNext,
  className,
}: {
  xp: number;
  level: number;
  xpToNext: number;
  className?: string;
}) {
  const pct = Math.min(100, Math.round((xp % xpToNext) / (xpToNext / 100)));
  return (
    <Card className={cn("p-5 rounded-[4px] border border-border bg-surface", className)}>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] border border-accent/30 bg-accent/15">
          <Star className="text-accent" size={22} />
        </div>
        <div>
          <p className="font-mono text-2xl font-bold text-ink leading-none">{xp.toLocaleString()} XP</p>
          <p className="mt-1 text-xs font-mono text-ink-muted">Level {level}</p>
        </div>
      </div>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-xs font-mono text-ink-muted">{pct}% to Level {level + 1}</p>
    </Card>
  );
}


