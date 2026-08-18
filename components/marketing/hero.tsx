"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Star, Trophy, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/lib/context/site-content-context";

export function Hero() {
  const { landing } = useSiteContent();

  return (
    <section className="path-bg relative overflow-hidden border-b border-border">
      <div className="container-app grid gap-12 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles size={13} /> {landing.heroBadge}
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {landing.heroHeadingLine1}
            <br />
            {landing.heroHeadingLine2}
            <br />
            <span className="bg-gradient-to-r from-[#520051] via-[#920090] to-[#d400d1] bg-clip-text text-transparent">
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

          <div className="mt-10 flex items-center gap-6 text-sm text-ink-muted">
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
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-elevated">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Continue Learning</p>
              <span className="text-xs font-medium text-ink-muted">82%</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "82%" }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-[#520051] via-[#920090] to-[#d400d1]"
              />
            </div>
            <p className="mt-2 text-xs text-ink-muted">React Development — Building REST APIs</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-streak/10 p-3">
                <Flame size={18} className="text-streak" />
                <div>
                  <p className="text-sm font-bold text-ink leading-none">7</p>
                  <p className="text-[10px] text-ink-muted">day streak</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-xp/10 p-3">
                <Star size={18} className="text-xp" />
                <div>
                  <p className="text-sm font-bold text-ink leading-none">1,240</p>
                  <p className="text-[10px] text-ink-muted">XP</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 -top-6 flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 shadow-elevated"
          >
            <Trophy size={16} className="text-warning" />
            <span className="text-xs font-semibold text-ink">Achievement unlocked!</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-5 -left-5 flex items-center gap-2 rounded-xl border border-primary/20 bg-gradient-to-br from-primary-50 to-surface px-3 py-2 shadow-elevated"
          >
            <Sparkles size={16} className="text-primary" />
            <span className="text-xs font-semibold text-ink">2 lessons to go</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
