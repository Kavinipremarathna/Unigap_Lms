import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-surface-2 text-ink-muted",
        primary: "bg-primary-50 text-primary",
        success: "bg-success/10 text-success",
        warning: "bg-warning/15 text-warning",
        error: "bg-error/10 text-error",
        streak: "bg-streak/10 text-streak",
        xp: "bg-xp/10 text-xp",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
