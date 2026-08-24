"use client";

import { Sparkles, ArrowRight, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AICompanionCard({
  message,
  href = "/dashboard",
}: {
  message: string;
  href?: string;
}) {
  return (
    <Card className="relative overflow-hidden border border-border bg-surface p-6 rounded-[4px]">
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-primary/5 blur-2xl" />
      <div className="flex items-start gap-3.5">
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-primary/30 bg-primary/15"
        >
          <Sparkles size={18} className="text-primary" />
        </motion.div>
        <div className="min-w-0">
          <p className="font-serif text-base font-medium text-ink">Your Learning Companion</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{message}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2.5 pt-2">
        <Link href={href}>
          <Button size="sm" variant="primary">
            Continue Learning <ArrowRight size={14} />
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button size="sm" variant="secondary">
            <BarChart3 size={14} /> View My Progress
          </Button>
        </Link>
      </div>
    </Card>
  );
}


