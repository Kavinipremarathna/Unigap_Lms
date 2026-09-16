import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-sans text-lg font-extrabold tracking-tight text-ink group cursor-pointer select-none", className)}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#520051] via-[#920090] to-[#d400d1] text-white shadow-lg shadow-[#920090]/25 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-[#920090]/40 ring-2 ring-primary/20">
        <div className="absolute -inset-0.5 rounded-[16px] bg-gradient-to-r from-primary to-[#d400d1] opacity-30 blur-sm group-hover:opacity-60 transition-opacity" />
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none" className="relative z-10" aria-hidden>
          <path
            d="M4 20C8 20 8 8 14 8C20 8 20 20 24 20"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="4" cy="20" r="2.8" fill="#F14DF0" />
          <circle cx="14" cy="8" r="2.8" fill="#FFFFFF" />
          <circle cx="24" cy="20" r="2.8" fill="#F14DF0" />
        </svg>
      </div>
      <span className="flex items-center gap-1.5">
        <span className="font-black tracking-tight text-ink text-xl">UNIGAP</span>
        <span className="rounded-full bg-gradient-to-r from-primary/15 via-[#920090]/15 to-primary/10 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-primary border border-primary/30 shadow-xs backdrop-blur-md">
          Learn
        </span>
      </span>
    </span>
  );
}


