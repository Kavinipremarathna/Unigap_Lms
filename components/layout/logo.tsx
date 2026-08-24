import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-serif text-lg font-medium tracking-tight text-ink", className)}>
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden>
        <path
          d="M4 20C8 20 8 8 14 8C20 8 20 20 24 20"
          stroke="url(#unigap-grad)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="4" cy="20" r="2.6" fill="#C79D5D" />
        <circle cx="14" cy="8" r="2.6" fill="#8FB088" />
        <circle cx="24" cy="20" r="2.6" fill="#C79D5D" />
        <defs>
          <linearGradient id="unigap-grad" x1="4" y1="20" x2="24" y2="8">
            <stop stopColor="#C79D5D" />
            <stop offset="1" stopColor="#8FB088" />
          </linearGradient>
        </defs>
      </svg>
      UNIGAP
    </span>
  );
}


