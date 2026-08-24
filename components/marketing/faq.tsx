"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Is UNIGAP suitable for complete beginners?",
    a: "Yes. Every course lists its level clearly, and beginner paths assume no prior experience. The daily goal and streak system are designed to build consistency from day one.",
  },
  {
    q: "Do I get a certificate when I finish a course?",
    a: "Paid courses include a verified certificate on completion, viewable and downloadable from your certificate gallery. Free courses include a completion badge.",
  },
  {
    q: "How does the AI learning companion work?",
    a: "It looks at your current progress — lessons completed, streak, and time remaining — and surfaces a short, relevant nudge or recommendation, rather than acting as a general chatbot.",
  },
  {
    q: "Can I switch between free and paid plans?",
    a: "Yes, you can upgrade or downgrade at any time from your settings. Your progress and achievements carry over regardless of plan.",
  },
  {
    q: "Is UNIGAP available on mobile?",
    a: "Yes. The full learning experience — courses, dashboard, and achievements — is responsive and optimized for mobile use.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-2xl divide-y divide-border">
      {faqs.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q} className="py-4.5">
            <button
              className="flex w-full items-center justify-between gap-4 text-left hover:text-primary transition-colors"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
            >
              <span className="font-serif text-base font-medium text-ink">{item.q}</span>
              <ChevronDown
                size={18}
                className={cn("shrink-0 text-primary transition-transform duration-200", open && "rotate-180")}
              />
            </button>
            {open && <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}


