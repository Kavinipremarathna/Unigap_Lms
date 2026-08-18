"use client";

import { motion } from "framer-motion";

export function ProgressRing({
  value,
  size = 96,
  strokeWidth = 9,
  label,
  sublabel,
  colorVar = "--primary",
}: {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label: string;
  sublabel?: string;
  colorVar?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--surface-2))"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`hsl(var(${colorVar}))`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (clamped / 100) * circumference }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-lg font-bold text-ink">{label}</span>
        {sublabel && <span className="text-[10px] font-medium text-ink-muted">{sublabel}</span>}
      </div>
    </div>
  );
}
