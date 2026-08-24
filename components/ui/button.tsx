import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[4px] text-sm font-sans font-semibold tracking-normal leading-none transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
  {

    variants: {
      variant: {
        primary: "bg-primary text-primary-fg hover:opacity-90 active:scale-[0.99] shadow-sm",
        secondary: "bg-surface-2 text-ink border border-border hover:border-border-hover hover:bg-surface",
        outline: "border border-border bg-transparent text-ink hover:bg-surface-2 hover:border-border-hover",
        ghost: "bg-transparent text-ink hover:bg-surface-2 hover:text-ink",
        accent: "bg-accent text-accent-fg hover:opacity-90 active:scale-[0.99] shadow-sm",
        link: "bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto font-normal",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4.5 text-sm",
        lg: "h-12 px-6 text-base",
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


