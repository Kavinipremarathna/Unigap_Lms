import { Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function GoalCard({ minutesDone, minutesGoal }: { minutesDone: number; minutesGoal: number }) {
  const pct = Math.min(100, Math.round((minutesDone / minutesGoal) * 100));
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
          <Target className="text-success" size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Daily Goal</p>
          <p className="text-xs text-ink-muted">{minutesDone} / {minutesGoal} minutes today</p>
        </div>
      </div>
      <Progress value={pct} className="mt-4" barClassName="bg-success" />
    </Card>
  );
}
