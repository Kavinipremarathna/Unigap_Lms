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
    <div className="relative overflow-hidden rounded-[4px] border border-border bg-gradient-to-r from-surface via-surface-2 to-surface p-6 sm:p-8 shadow-sm transition-all mb-8">
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl space-y-2">
          <Badge variant="brass">
            <Icon size={13} /> {badgeText}
          </Badge>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-4xl">
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
