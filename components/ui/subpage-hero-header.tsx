"use client";

import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface SubpageHeroHeaderProps {
  icon: LucideIcon;
  badgeText: string;
  title: string;
  description: string;
  rightContent?: ReactNode;
}

export function SubpageHeroHeader({
  icon: Icon,
  badgeText,
  title,
  description,
  rightContent,
}: SubpageHeroHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-surface via-surface-2 to-surface p-6 sm:p-10 shadow-md transition-all mb-8">
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#920090]/15 blur-3xl dark:bg-[#d400d1]/20" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-[#520051]/15 blur-3xl dark:bg-[#920090]/20" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl space-y-3">
          <Badge variant="brass" className="rounded-full px-3.5 py-1 text-xs">
            <Icon size={14} /> {badgeText}
          </Badge>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {title}
          </h1>
          <p className="font-sans text-sm text-ink-muted leading-relaxed">
            {description}
          </p>
        </div>

        {rightContent && <div className="shrink-0">{rightContent}</div>}
      </div>
    </div>
  );
}
