"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Progress({
  value,
  className,
  barClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-2", className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn("h-full rounded-full bg-primary", barClassName)}
      />
    </div>
  );
}
