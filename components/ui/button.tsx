import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:shadow-glow",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-fg hover:brightness-110 shadow-card",
        secondary: "bg-surface-2 text-ink hover:bg-border/60 border border-border",
        outline: "border border-border bg-transparent text-ink hover:bg-surface-2",
        ghost: "bg-transparent text-ink hover:bg-surface-2",
        accent: "bg-accent text-accent-fg hover:brightness-110 shadow-card",
        link: "bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-9 px-3.5",
        md: "h-11 px-5",
        lg: "h-13 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
