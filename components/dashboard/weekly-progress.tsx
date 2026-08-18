"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const week = [
  { day: "Mon", min: 25 },
  { day: "Tue", min: 40 },
  { day: "Wed", min: 15 },
  { day: "Thu", min: 35 },
  { day: "Fri", min: 20 },
  { day: "Sat", min: 45 },
  { day: "Sun", min: 20 },
];

export function WeeklyProgress() {
  const max = Math.max(...week.map((d) => d.min));

  return (
    <Card>
      <CardContent>
        <CardTitle>Weekly Progress</CardTitle>
        <p className="mt-1 text-xs text-ink-muted">200 minutes learned this week</p>
        <div className="mt-6 flex items-end justify-between gap-2 h-32">
          {week.map((d, i) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.min / max) * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-md bg-gradient-to-t from-primary to-accent"
                style={{ minHeight: 4 }}
              />
              <span className="text-[11px] font-medium text-ink-muted">{d.day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
