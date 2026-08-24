"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Star, Trophy, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/lib/context/site-content-context";

export function Hero() {
  const { landing } = useSiteContent();

  return (
    <section className="relative overflow-hidden border-b border-border bg-bg path-bg transition-colors">
      <div className="container-app grid gap-12 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono font-medium text-primary">
            <Sparkles size={13} /> {landing.heroBadge}
          </span>

          <h1 className="mt-5 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {landing.heroHeadingLine1}
            <br />
            {landing.heroHeadingLine2}
            <br />
            <span className="text-primary">
              {landing.heroHeadingGradient}
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-ink-muted leading-relaxed">
            {landing.heroSubheading}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={landing.ctaPrimaryLink || "/courses"}>
              <Button size="lg">
                {landing.ctaPrimaryText} <ArrowRight size={18} />
              </Button>
            </Link>

            <Link href={landing.ctaSecondaryLink || "/dashboard"}>
              <Button size="lg" variant="secondary">
                {landing.ctaSecondaryText}
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-6 text-xs font-mono text-ink-muted">
            <span>
              <strong className="text-ink">{landing.statLearners}</strong>
            </span>
            <span>
              <strong className="text-ink">{landing.statCourses}</strong>
            </span>
            <span>
              <strong className="text-ink">{landing.statRating}</strong>
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="rounded-[4px] border border-border bg-surface p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="font-serif text-sm font-medium text-ink">Continue Learning</p>
              <span className="font-mono text-xs font-semibold text-primary">82%</span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "82%" }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-primary"
              />
            </div>
            <p className="mt-2.5 text-xs text-ink-muted">React Development — Building REST APIs</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 rounded-[4px] border border-primary/20 bg-primary/10 p-3">
                <Flame size={18} className="text-primary" />
                <div>
                  <p className="font-mono text-sm font-bold text-ink leading-none">7</p>
                  <p className="font-mono text-[10px] text-ink-muted">day streak</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-[4px] border border-accent/20 bg-accent/10 p-3">
                <Star size={18} className="text-accent" />
                <div>
                  <p className="font-mono text-sm font-bold text-ink leading-none">1,240</p>
                  <p className="font-mono text-[10px] text-ink-muted">XP</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 -top-6 flex items-center gap-2 rounded-[4px] border border-border bg-surface-2 px-3.5 py-2 shadow-lg"
          >
            <Trophy size={16} className="text-primary" />
            <span className="text-xs font-mono font-medium text-ink">Achievement unlocked!</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-5 -left-5 flex items-center gap-2 rounded-[4px] border border-border bg-surface-2 px-3.5 py-2 shadow-lg"
          >
            <Sparkles size={16} className="text-accent" />
            <span className="text-xs font-mono font-medium text-ink">2 lessons to go</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


