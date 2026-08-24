"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Achievement } from "@/lib/types";
import { getSafeIcon } from "@/components/ui/safe-icon";

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  const Icon = getSafeIcon(achievement.icon, Award);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        className={cn(
          "flex flex-col items-center gap-3 p-5 text-center rounded-[4px] border border-border bg-surface",
          !achievement.unlocked && "opacity-60"
        )}
      >
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full border border-border",
            achievement.unlocked ? "bg-primary text-primary-fg" : "bg-surface-2 text-ink-muted"
          )}
        >
          <Icon size={26} className={achievement.unlocked ? "text-primary-fg" : "text-ink-muted"} />
        </div>
        <div>
          <p className="font-serif text-sm font-medium text-ink">{achievement.title}</p>
          <p className="mt-1 text-xs text-ink-muted">{achievement.description}</p>
        </div>
        {!achievement.unlocked && typeof achievement.progress === "number" && (
          <div className="w-full mt-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${achievement.progress}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] font-mono text-ink-muted">{achievement.progress}% completed</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}


