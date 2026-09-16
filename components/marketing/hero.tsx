"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame,
  Star,
  Trophy,
  Sparkles,
  ArrowRight,
  Zap,
  BookOpen,
  CheckCircle2,
  PlayCircle,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/lib/context/site-content-context";

export function Hero() {
  const { landing } = useSiteContent();

  return (
    <section className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-surface-2/40 via-bg to-surface-2/40 py-14 md:py-24 transition-colors">
      {/* Background Subtle Radial Lighting Glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[550px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#520051]/15 via-[#920090]/15 to-[#d400d1]/10 blur-3xl dark:from-[#920090]/25 dark:via-[#d400d1]/20 dark:to-transparent" />

      <div className="container-app relative z-10 grid gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left Hero Content Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6 lg:col-span-6"
        >
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-extrabold text-primary shadow-xs backdrop-blur-md">
            <Sparkles size={14} className="text-primary animate-pulse" />
            <span>{landing.heroBadge || "NextGen Learning Platform 2026"}</span>
          </div>

          {/* Heading */}
          <h1 className="font-sans text-4xl font-extrabold leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {landing.heroHeadingLine1 || "Shape the Future"}
            <br />
            {landing.heroHeadingLine2 || "with UNIGAP"}
            <br />
            <span className="gradient-text-primary">
              {landing.heroHeadingGradient || "Tech Excellence"}
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-lg text-base leading-relaxed text-ink-muted sm:text-lg">
            {landing.heroSubheading ||
              "Master in-demand skills through interactive courses, real-world projects, and AI-powered learning paths designed for modern tech leaders."}
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href={landing.ctaPrimaryLink || "/courses"}>
              <Button size="lg" className="gap-2.5 shadow-xl hover:shadow-2xl rounded-2xl">
                {landing.ctaPrimaryText || "Explore Courses"} <ArrowRight size={18} />
              </Button>
            </Link>

            <Link href={landing.ctaSecondaryLink || "/dashboard"}>
              <Button size="lg" variant="secondary" className="gap-2.5 rounded-2xl">
                <PlayCircle size={18} className="text-primary" />
                {landing.ctaSecondaryText || "Learner Dashboard"}
              </Button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/80">
            <div className="rounded-2xl bg-surface p-4 border border-border/80 shadow-2xs transition hover:border-primary/40">
              <p className="font-sans text-xl font-extrabold text-ink">
                {landing.statLearners || "15,000+"}
              </p>
              <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mt-1">Active Learners</p>
            </div>

            <div className="rounded-2xl bg-surface p-4 border border-border/80 shadow-2xs transition hover:border-primary/40">
              <p className="font-sans text-xl font-extrabold text-primary">
                {landing.statCourses || "120+"}
              </p>
              <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mt-1">Tech Courses</p>
            </div>

            <div className="rounded-2xl bg-surface p-4 border border-border/80 shadow-2xs transition hover:border-primary/40">
              <p className="font-sans text-xl font-extrabold text-ink">
                {landing.statRating || "4.9 ★"}
              </p>
              <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mt-1">Rating Score</p>
            </div>
          </div>
        </motion.div>

        {/* Right Hero Column: Interactive Animated Learning Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:col-span-6"
        >
          <div className="relative mx-auto max-w-lg">
            {/* Interactive Live Learning Card Wrapper */}
            <div className="overflow-hidden rounded-3xl border border-border/80 bg-surface p-6 shadow-2xl transition hover:shadow-3xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br from-primary via-[#920090] to-primary text-white shadow-lg shadow-primary/25 ring-2 ring-primary/20 shrink-0">
                    <GraduationCap size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-ink">Continue Your Progress</h3>
                    <p className="text-xs text-ink-muted">Fullstack Next.js 14 & React Architecture</p>
                  </div>
                </div>
                <span className="rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-xs font-extrabold text-primary">
                  82% Completed
                </span>
              </div>

              {/* Animated Progress Bar */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-ink-muted">
                  <span>Course Overall Progress</span>
                  <span className="text-primary font-bold">18 / 22 Lessons</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-surface-2 border border-border/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "82%" }}
                    transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-primary via-[#920090] to-[#d400d1]"
                  />
                </div>
              </div>

              {/* Current Lesson Badge */}
              <div className="mt-5 rounded-2xl bg-surface-2 p-4 border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary text-white text-xs font-extrabold shadow-sm">
                      19
                    </span>
                    <div>
                      <p className="text-xs font-bold text-ink">Next Lesson: Server Actions & Cache Revalidation</p>
                      <p className="text-[11px] text-ink-muted">12 min video • Interactive Lab</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                    Up Next
                  </span>
                </div>
              </div>

              {/* Metrics Bar */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20 ring-1 ring-amber-400/30">
                    <Flame size={20} />
                  </div>
                  <div>
                    <p className="font-sans text-base font-extrabold text-amber-900 dark:text-amber-200 leading-none">7 Days</p>
                    <p className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mt-0.5">Active Streak</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-primary to-[#920090] text-white shadow-md shadow-primary/20 ring-1 ring-primary/30">
                    <Star size={20} className="fill-amber-300 text-amber-300" />
                  </div>
                  <div>
                    <p className="font-sans text-base font-extrabold text-ink leading-none">1,240 XP</p>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider mt-0.5">Total Rewards</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Top Badge (Animated) */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 -top-5 flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-xl"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-primary to-[#920090] text-white shadow-md shadow-primary/20">
                <Trophy size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-primary">Badge Unlocked</p>
                <p className="text-xs font-bold text-ink">Quiz Master</p>
              </div>
            </motion.div>

            {/* Floating Bottom Badge (Animated) */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-4 -left-4 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-surface px-4 py-3 shadow-xl"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Verified</p>
                <p className="text-xs font-bold text-ink">Certificate Issued</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



