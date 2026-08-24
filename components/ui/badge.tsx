import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-mono font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-surface-2 text-ink-muted border border-border",
        primary: "bg-primary/15 text-primary border border-primary/30",
        success: "bg-accent/15 text-accent border border-accent/30",
        warning: "bg-primary/15 text-primary border border-primary/30",
        error: "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30",
        streak: "bg-primary/15 text-primary border border-primary/30",
        xp: "bg-accent/15 text-accent border border-accent/30",
        brass: "bg-primary/15 text-primary border border-primary/30",
        moss: "bg-accent/15 text-accent border border-accent/30",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}


