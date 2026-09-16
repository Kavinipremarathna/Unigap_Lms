"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Code2,
  Terminal,
  BarChart3,
  Cloud,
  BrainCircuit,
  ShieldCheck,
  ArrowRight,
  Search,
  ListChecks,
  Sparkles,
  Flame,
  Trophy,
  Award,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseCard } from "@/components/courses/course-card";
import { Hero } from "@/components/marketing/hero";
import { Faq } from "@/components/marketing/faq";
import { ProgressRing } from "@/components/gamification/progress-ring";
import { courses, getStoredCourses } from "@/lib/mock/courses";
import { Course } from "@/lib/types";
import { testimonials } from "@/lib/mock/misc";
import { useSiteContent } from "@/lib/context/site-content-context";

const categories = [
  { label: "Web Development", icon: Code2, count: 24 },
  { label: "Civil Engineering", icon: Terminal, count: 16 },
  { label: "Electrical Engineering", icon: BarChart3, count: 18 },
  { label: "Mechanical Engineering", icon: Cloud, count: 14 },
  { label: "Artificial Intelligence", icon: BrainCircuit, count: 12 },
  { label: "Cybersecurity", icon: ShieldCheck, count: 9 },
];

export default function HomePage() {
  const { landing } = useSiteContent();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [featured, setFeatured] = useState<Course[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetch("/api/admin/courses");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.courses) && data.courses.length > 0) {
            const mapped: Course[] = data.courses.map((c: any) => ({
              id: c.id,
              slug: c.slug,
              title: c.title,
              shortDescription: c.shortDescription || c.description,
              description: c.description,
              category: c.category,
              level: c.level || "Beginner",
              durationHours: c.durationHours || 10,
              rating: typeof c.rating === "number" ? c.rating : 5.0,
              reviewCount: 12,
              learners: c.studentsCount || 0,
              price: Number(c.price) || 0,
              isFree: c.isFree,
              instructorId: c.instructorId,
              instructorName: c.instructorName,
              gradient: ["#520051", "#920090"],
              outcomes: [],
              requirements: [],
              status: c.status,
              isPublished: c.isPublished,
              thumbnailUrl: c.thumbnailUrl || null,
            }));
            setAllCourses(mapped);
            setFeatured(mapped.slice(0, 4));
            return;
          }
        }
      } catch (err) {
        console.error("HomePage fetch courses error:", err);
      }
      const local = getStoredCourses();
      setAllCourses(local);
      setFeatured(local.slice(0, 4));
    };

    loadCourses();
  }, []);

  const freeCourses = allCourses.filter((c) => c.isFree || c.price === 0).slice(0, 4);
  const paidCourses = allCourses.filter((c) => !c.isFree && c.price > 0).slice(0, 4);

  return (
    <div className="bg-bg text-ink min-h-screen transition-colors">
      <Navbar />
      <main className="space-y-16 lg:space-y-24 pb-16">
        <Hero />

        {/* 1. Learning Categories */}
        <section className="container-app pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#920090] dark:text-[#f14df0]">Top Categories</p>
              <h2 className="mt-1 font-heading text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
                {landing.categoriesTitle}
              </h2>
              <p className="mt-1.5 text-sm text-ink-muted">{landing.categoriesSubtitle}</p>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#920090] dark:text-[#f14df0] hover:underline"
            >
              View all tracks <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <Link key={c.label} href="/courses">
                <Card className="flex flex-col items-center gap-3 p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-[#920090]/50 hover:shadow-xl rounded-2xl border border-border/80 bg-surface shadow-xs group">
                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#520051]/10 text-[#520051] border border-[#520051]/20 dark:bg-[#520051] dark:text-[#fde8fc] group-hover:scale-110 transition-transform">
                    <c.icon size={24} />
                  </div>
                  <p className="font-bold text-xs text-ink leading-tight mt-1">{c.label}</p>
                  <p className="font-mono text-[11px] text-ink-muted font-medium">{c.count} courses</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* 2. Featured Popular Courses */}
        <section className="border-y border-border/80 bg-surface-2/40 py-16">
          <div className="container-app">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#920090] dark:text-[#f14df0]">Featured Learning</p>
                <h2 className="mt-1 font-heading text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
                  {landing.popularCoursesTitle}
                </h2>
                <p className="mt-1.5 text-sm text-ink-muted">{landing.popularCoursesSubtitle}</p>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#920090] dark:text-[#f14df0] hover:underline"
              >
                Browse catalog <ArrowRight size={14} />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </div>
        </section>

        {/* 3. FREE COURSES SECTION (PROMINENT HIGHLIGHT) */}
        <section className="container-app">
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-surface to-emerald-500/10 p-6 sm:p-10 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-emerald-500/20 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3.5 py-1 text-xs font-mono font-extrabold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 mb-2">
                  <Sparkles size={14} /> 100% Free Access
                </div>
                <h2 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
                  Start Learning for Free
                </h2>
                <p className="mt-1.5 text-sm text-ink-muted">
                  No credit card required. High-quality courses open to all enrolled users.
                </p>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 hover:underline"
              >
                Explore all free courses <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(freeCourses.length > 0 ? freeCourses : featured).map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </div>
        </section>

        {/* 4. PREMIUM PAID COURSES SECTION */}
        {paidCourses.length > 0 && (
          <section className="container-app">
            <div className="rounded-3xl border border-[#920090]/30 bg-gradient-to-br from-[#520051]/5 via-surface to-[#920090]/10 p-6 sm:p-10 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#920090]/20 pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#920090]/15 px-3.5 py-1 text-xs font-mono font-extrabold text-[#520051] dark:text-[#fde8fc] border border-[#920090]/30 mb-2">
                    <Star size={14} className="fill-[#920090]" /> Premium Career Tracks
                  </div>
                  <h2 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
                    Master Advanced Technologies
                  </h2>
                  <p className="mt-1.5 text-sm text-ink-muted">
                    In-depth masterclasses with instructor support, real labs, and verified certificates.
                  </p>
                </div>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#920090] dark:text-[#f14df0] hover:underline"
                >
                  View premium catalog <ArrowRight size={14} />
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {paidCourses.map((c) => (
                  <CourseCard key={c.id} course={c} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. How UNIGAP Works */}
        <section className="container-app">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#920090] dark:text-[#f14df0]">Simple 3-Step Path</p>
            <h2 className="mt-1 font-heading text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
              {landing.howWorksTitle}
            </h2>
            <p className="mt-2 text-sm text-ink-muted">{landing.howWorksSubtitle}</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Search,
                title: landing.step1Title,
                desc: landing.step1Desc,
              },
              {
                icon: ListChecks,
                title: landing.step2Title,
                desc: landing.step2Desc,
              },
              {
                icon: Trophy,
                title: landing.step3Title,
                desc: landing.step3Desc,
              },
            ].map((s, i) => (
              <Card key={s.title} className="p-7 rounded-2xl border border-border/80 bg-surface shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#520051] to-[#920090] text-white font-mono text-sm font-bold shadow-md">
                  {i + 1}
                </div>
                <s.icon size={28} className="mt-5 text-[#920090] dark:text-[#f14df0]" />
                <h3 className="mt-4 font-bold text-lg text-ink">{s.title}</h3>
                <p className="mt-2 text-xs text-ink-muted leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* 6. AI Learning Companion */}
        <section className="border-y border-border/80 bg-surface-2/40 py-16">
          <div className="container-app grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge variant="brass" className="rounded-full px-3.5 py-1 text-xs">
                <Sparkles size={13} /> {landing.aiBadgeText}
              </Badge>
              <h2 className="mt-4 font-heading text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
                {landing.aiTitle}
              </h2>
              <p className="mt-3 text-ink-muted leading-relaxed text-sm">{landing.aiDescription}</p>
              <ul className="mt-6 space-y-3 text-sm text-ink font-medium">
                {[landing.aiFeature1, landing.aiFeature2, landing.aiFeature3].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <CheckCircle2 size={18} className="text-[#920090] dark:text-[#f14df0] shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <Card className="relative overflow-hidden border border-border bg-surface p-7 rounded-3xl shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#920090]/30 bg-[#520051]/10 text-[#920090] dark:bg-[#520051] dark:text-white shadow-sm">
                  <Sparkles size={24} />
                </div>
                <div>
                  <p className="font-heading text-base font-bold text-ink">{landing.aiCardTitle}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted italic">
                    &ldquo;{landing.aiCardQuote}&rdquo;
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 pt-4 border-t border-border">
                <Link href="/dashboard">
                  <Button size="sm">Continue Learning</Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="sm" variant="secondary">
                    View My Progress
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>

        {/* 7. Gamified learning */}
        <section className="container-app">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
              {landing.gamificationTitle}
            </h2>
            <p className="mt-2 text-sm text-ink-muted">{landing.gamificationSubtitle}</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <Card className="flex flex-col items-center gap-3 p-7 text-center rounded-3xl border border-border/80 bg-surface shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-300">
                <Flame size={32} />
              </div>
              <p className="font-heading text-xl font-bold text-ink">{landing.streakBoxTitle}</p>
              <p className="text-xs text-ink-muted">{landing.streakBoxDesc}</p>
            </Card>
            <Card className="flex flex-col items-center gap-3 p-7 text-center rounded-3xl border border-border/80 bg-surface shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#520051]/15 text-[#920090] dark:text-[#f14df0]">
                <Star size={32} />
              </div>
              <p className="font-heading text-xl font-bold text-ink">{landing.xpBoxTitle}</p>
              <p className="text-xs text-ink-muted">{landing.xpBoxDesc}</p>
            </Card>
            <Card className="flex flex-col items-center gap-3 p-7 text-center rounded-3xl border border-border/80 bg-surface shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                <Trophy size={32} />
              </div>
              <p className="font-heading text-xl font-bold text-ink">{landing.achievementsBoxTitle}</p>
              <p className="text-xs text-ink-muted">{landing.achievementsBoxDesc}</p>
            </Card>
          </div>
        </section>

        {/* 8. Progress Visualization */}
        <section className="border-y border-border/80 bg-surface-2/40 py-16">
          <div className="container-app grid items-center gap-10 lg:grid-cols-2">
            <div className="order-2 flex flex-wrap justify-center gap-8 lg:order-1">
              <ProgressRing value={82} label="82%" sublabel="Course" size={130} colorVar="var(--primary)" />
              <ProgressRing value={65} label="18/22" sublabel="Lessons" size={130} colorVar="var(--accent)" />
              <ProgressRing value={40} label="20/30" sublabel="Today" size={130} colorVar="var(--primary)" />
            </div>
            <div className="order-1 lg:order-2 space-y-3">
              <h2 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
                {landing.progressTitle}
              </h2>
              <p className="text-ink-muted leading-relaxed text-sm">{landing.progressSubtitle}</p>
            </div>
          </div>
        </section>

        {/* 9. Achievements */}
        <section className="container-app">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
              {landing.achievementsTitle}
            </h2>
            <p className="mt-2 text-sm text-ink-muted">{landing.achievementsSubtitle}</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Trophy, label: "First Course" },
              { icon: Flame, label: "7-Day Streak" },
              { icon: ListChecks, label: "10 Lessons" },
              { icon: Award, label: "Quiz Master" },
            ].map((a) => (
              <Card key={a.label} className="flex flex-col items-center gap-3 p-6 text-center rounded-2xl border border-border/80 bg-surface">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#520051]/15 text-[#920090] dark:bg-[#520051] dark:text-[#fde8fc]">
                  <a.icon size={24} />
                </div>
                <p className="font-bold text-sm text-ink">{a.label}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/achievements">
              <Button variant="secondary">{landing.achievementsButtonText}</Button>
            </Link>
          </div>
        </section>

        {/* 10. Certificates */}
        <section className="border-y border-border/80 bg-surface-2/40 py-16">
          <div className="container-app grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
                {landing.certificatesTitle}
              </h2>
              <p className="text-ink-muted leading-relaxed text-sm">
                {landing.certificatesSubtitle}
              </p>
              <Link href="/pricing" className="inline-block pt-2">
                <Button variant="secondary">{landing.certificatesButtonText}</Button>
              </Link>
            </div>
            <Card className="overflow-hidden p-5 rounded-3xl border border-border bg-surface shadow-xl">
              {landing.certificateImageUrl ? (
                <div className="relative overflow-hidden rounded-2xl bg-bg p-2 flex items-center justify-center border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={landing.certificateImageUrl}
                    alt="Certificate Preview"
                    className="max-h-72 w-full object-contain rounded-xl"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#920090]/40 bg-[#520051]/5 p-8 text-center">
                  <Award size={40} className="mx-auto text-[#920090] dark:text-[#f14df0]" />
                  <p className="mt-4 text-xs font-mono font-bold uppercase tracking-wider text-[#920090] dark:text-[#f14df0]">
                    {landing.certificateCardTitle}
                  </p>
                  <p className="mt-1 font-heading text-xl font-bold text-ink">
                    {landing.certificateCourseName}
                  </p>
                  <p className="mt-2 text-xs font-mono text-ink-muted">{landing.certificateIssuedTo}</p>
                </div>
              )}
            </Card>
          </div>
        </section>

        {/* 11. Testimonials */}
        <section className="container-app">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
              {landing.testimonialsTitle}
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.id} className="p-6 rounded-2xl border border-border/80 bg-surface shadow-xs">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-muted">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3 pt-4 border-t border-border/60">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#520051] font-mono text-xs font-bold text-white shadow-sm"
                  >
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-ink">{t.name}</p>
                    <p className="text-xs font-mono text-ink-muted">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 12. FAQ */}
        <section className="border-y border-border/80 bg-surface-2/40 py-16">
          <div className="container-app">
            <div className="text-center">
              <h2 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
                {landing.faqTitle}
              </h2>
            </div>
            <div className="mt-10 max-w-3xl mx-auto">
              <Faq />
            </div>
          </div>
        </section>

        {/* 13. Final CTA Banner */}
        <section className="container-app pt-4">
          <Card className="overflow-hidden border border-border bg-surface p-10 text-center sm:p-16 rounded-3xl path-bg shadow-2xl">
            <h2 className="font-heading text-3xl font-extrabold text-ink sm:text-4xl lg:text-5xl">
              {landing.finalCtaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-ink-muted leading-relaxed text-sm sm:text-base">
              {landing.finalCtaSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/courses">
                <Button size="lg" className="shadow-xl">
                  {landing.finalCtaPrimaryText} <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="secondary">
                  {landing.finalCtaSecondaryText}
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}


