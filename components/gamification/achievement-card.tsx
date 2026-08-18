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
          "flex flex-col items-center gap-3 p-5 text-center",
          !achievement.unlocked && "opacity-60 grayscale"
        )}
      >
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            achievement.unlocked ? "bg-gradient-to-br from-[#520051] to-[#d400d1]" : "bg-surface-2"
          )}
        >
          <Icon size={26} className={achievement.unlocked ? "text-white" : "text-ink-muted"} />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{achievement.title}</p>
          <p className="mt-1 text-xs text-ink-muted">{achievement.description}</p>
        </div>
        {!achievement.unlocked && typeof achievement.progress === "number" && (
          <div className="w-full">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-[#920090]/80"
                style={{ width: `${achievement.progress}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-ink-muted">{achievement.progress}% there</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
