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
    <section className="relative overflow-hidden border-b border-[#eee5ee] bg-gradient-to-b from-[#faf5fa] via-white to-[#faf5fa] py-12 md:py-20">
      {/* Background Subtle Radial Lighting Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#520051]/10 via-[#920090]/10 to-[#d400d1]/5 blur-3xl" />

      <div className="container-app relative z-10 grid gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left Hero Content Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6 lg:col-span-6"
        >
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e8dce8] bg-[#fde8fc]/80 px-4 py-1.5 text-xs font-bold text-[#520051] shadow-xs backdrop-blur-md">
            <Sparkles size={14} className="text-[#920090]" />
            <span>{landing.heroBadge || "NextGen LMS Engine 2026"}</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl font-bold leading-[1.12] tracking-tight text-[#520051] sm:text-5xl lg:text-6xl">
            {landing.heroHeadingLine1 || "Shape the Future"}
            <br />
            {landing.heroHeadingLine2 || "with UNIGAP"}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#520051] via-[#920090] to-[#d400d1]">
              {landing.heroHeadingGradient || "Tech Excellence"}
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
            {landing.heroSubheading ||
              "Master in-demand skills through interactive courses, real-world projects, and AI-powered learning paths designed for modern tech leaders."}
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap gap-3.5 pt-2">
            <Link href={landing.ctaPrimaryLink || "/courses"}>
              <Button size="lg" className="gap-2 rounded-xl bg-[#520051] px-7 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#920090] transition cursor-pointer">
                {landing.ctaPrimaryText || "Explore Courses"} <ArrowRight size={18} />
              </Button>
            </Link>

            <Link href={landing.ctaSecondaryLink || "/dashboard"}>
              <Button size="lg" variant="secondary" className="gap-2 rounded-xl border border-[#eee5ee] bg-white px-6 py-3.5 text-sm font-bold text-[#520051] shadow-xs hover:bg-[#faf5fa] transition cursor-pointer">
                <PlayCircle size={18} className="text-[#920090]" />
                {landing.ctaSecondaryText || "Learner Dashboard"}
              </Button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#eee5ee]">
            <div className="rounded-xl bg-white p-3 border border-[#eee5ee] shadow-2xs">
              <p className="font-mono text-lg font-extrabold text-[#520051]">
                {landing.statLearners || "15,000+"}
              </p>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Learners</p>
            </div>

            <div className="rounded-xl bg-white p-3 border border-[#eee5ee] shadow-2xs">
              <p className="font-mono text-lg font-extrabold text-[#920090]">
                {landing.statCourses || "120+"}
              </p>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tech Courses</p>
            </div>

            <div className="rounded-xl bg-white p-3 border border-[#eee5ee] shadow-2xs">
              <p className="font-mono text-lg font-extrabold text-[#520051]">
                {landing.statRating || "4.9 ★"}
              </p>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Rating Score</p>
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
            <div className="overflow-hidden rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-2xl transition hover:shadow-3xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#eee5ee] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#520051] to-[#920090] text-white shadow-md">
                    <GraduationCap size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#520051]">Continue Your Progress</h3>
                    <p className="text-xs text-slate-500">Fullstack Next.js 14 & React Architecture</p>
                  </div>
                </div>
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-extrabold text-[#920090]">
                  82% Completed
                </span>
              </div>

              {/* Animated Progress Bar */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Course Overall Progress</span>
                  <span className="font-mono text-[#920090]">18 / 22 Lessons</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-[#eee5ee]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "82%" }}
                    transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-[#520051] via-[#920090] to-[#d400d1]"
                  />
                </div>
              </div>

              {/* Current Lesson Badge */}
              <div className="mt-5 rounded-2xl bg-[#faf5fa] p-4 border border-[#eee5ee]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#520051] text-white text-xs font-bold">
                      19
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#520051]">Next Lesson: Server Actions & Cache Revalidation</p>
                      <p className="text-[11px] text-slate-400">12 min video • Interactive Lab</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                    Up Next
                  </span>
                </div>
              </div>

              {/* Metrics Bar */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                    <Flame size={20} />
                  </div>
                  <div>
                    <p className="font-mono text-base font-extrabold text-amber-900 leading-none">7 Days</p>
                    <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mt-0.5">Active Streak</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-purple-200 bg-purple-50/60 p-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#520051] text-white shadow-xs">
                    <Star size={20} className="fill-amber-300 text-amber-300" />
                  </div>
                  <div>
                    <p className="font-mono text-base font-extrabold text-[#520051] leading-none">1,240 XP</p>
                    <p className="text-[10px] font-bold text-[#920090] uppercase tracking-wider mt-0.5">Total Rewards</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Top Badge (Animated) */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 -top-5 flex items-center gap-3 rounded-2xl border border-purple-200 bg-white px-4 py-3 shadow-xl"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#520051] to-[#920090] text-white shadow-xs">
                <Trophy size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#920090]">Badge Unlocked</p>
                <p className="text-xs font-bold text-[#520051]">Quiz Master</p>
              </div>
            </motion.div>

            {/* Floating Bottom Badge (Animated) */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-4 -left-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-xl"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-xs">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Verified</p>
                <p className="text-xs font-bold text-slate-800">Certificate Issued</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



