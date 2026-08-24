import { Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function GoalCard({ minutesDone, minutesGoal }: { minutesDone: number; minutesGoal: number }) {
  const pct = Math.min(100, Math.round((minutesDone / minutesGoal) * 100));
  return (
    <Card className="p-5 rounded-[4px] border border-border bg-surface">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-accent/30 bg-accent/15">
          <Target className="text-accent" size={20} />
        </div>
        <div>
          <p className="font-serif text-sm font-medium text-ink">Daily Goal</p>
          <p className="font-mono text-xs text-ink-muted">{minutesDone} / {minutesGoal} minutes today</p>
        </div>
      </div>
      <Progress value={pct} className="mt-4" barClassName="bg-accent" />
    </Card>
  );
}


