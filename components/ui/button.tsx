import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-sans font-semibold tracking-normal leading-none transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-fg hover:opacity-95 hover:shadow-md shadow-xs cursor-pointer",
        secondary: "bg-surface-2 text-ink border border-border hover:border-border-hover hover:bg-surface cursor-pointer shadow-2xs",
        outline: "border border-border bg-transparent text-ink hover:bg-surface-2 hover:border-border-hover cursor-pointer",
        ghost: "bg-transparent text-ink hover:bg-surface-2 hover:text-ink cursor-pointer",
        accent: "bg-accent text-accent-fg hover:opacity-95 hover:shadow-md shadow-xs cursor-pointer",
        link: "bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto font-normal cursor-pointer",
      },
      size: {
        sm: "h-9 px-3.5 text-xs rounded-lg",
        md: "h-10.5 px-5 text-sm rounded-xl",
        lg: "h-12 px-7 text-base rounded-xl font-bold",
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


