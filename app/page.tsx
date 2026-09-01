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
            setFeatured(mapped.slice(0, 4));
            return;
          }
        }
      } catch (err) {
        console.error("HomePage fetch courses error:", err);
      }
      setFeatured(getStoredCourses().slice(0, 4));
    };

    loadCourses();
  }, []);

  return (
    <div className="bg-bg text-ink min-h-screen transition-colors">
      <Navbar />
      <main>
        <Hero />

        {/* Learning categories */}
        <section className="container-app py-16">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#920090]">Top Categories</p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-[#520051] sm:text-3xl">
                {landing.categoriesTitle}
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">{landing.categoriesSubtitle}</p>
            </div>
            <Link
              href="/courses"
              className="hidden text-xs font-mono font-bold text-[#920090] sm:flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <Link key={c.label} href="/courses">
                <Card className="flex flex-col items-center gap-2 p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-[#920090]/50 hover:shadow-lg rounded-2xl border border-[#eee5ee] bg-white shadow-2xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-[#920090] border border-purple-100">
                    <c.icon size={22} />
                  </div>
                  <p className="font-bold text-xs text-[#520051] leading-tight mt-1">{c.label}</p>
                  <p className="font-mono text-[11px] text-slate-400">{c.count} courses</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular courses */}
        <section className="border-t border-[#eee5ee] bg-[#faf5fa]/70 py-16">
          <div className="container-app">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#920090]">Featured Learning</p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-[#520051] sm:text-3xl">
                  {landing.popularCoursesTitle}
                </h2>
                <p className="mt-1.5 text-sm text-slate-500">{landing.popularCoursesSubtitle}</p>
              </div>
              <Link
                href="/courses"
                className="hidden text-xs font-mono font-bold text-[#920090] sm:flex items-center gap-1 hover:underline"
              >
                Browse all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </div>
        </section>

        {/* How UNIGAP works */}
        <section className="container-app py-16">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#920090]">Simple 3-Step Path</p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-[#520051] sm:text-3xl">
              {landing.howWorksTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-500">{landing.howWorksSubtitle}</p>
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
              <Card key={s.title} className="p-6 rounded-2xl border border-[#eee5ee] bg-white shadow-xs hover:shadow-md transition">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#520051] text-white font-mono text-xs font-bold">
                  {i + 1}
                </div>
                <s.icon size={24} className="mt-4 text-[#920090]" />
                <h3 className="mt-3 font-bold text-base text-[#520051]">{s.title}</h3>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* AI Learning Companion */}
        <section className="border-t border-border bg-surface-2/60 py-16">
          <div className="container-app grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge variant="brass">
                <Sparkles size={12} /> {landing.aiBadgeText}
              </Badge>
              <h2 className="mt-4 font-serif text-2xl font-medium text-ink sm:text-3xl">
                {landing.aiTitle}
              </h2>
              <p className="mt-3 text-ink-muted leading-relaxed">{landing.aiDescription}</p>
              <ul className="mt-5 space-y-2.5 text-sm text-ink">
                {[landing.aiFeature1, landing.aiFeature2, landing.aiFeature3].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-accent" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <Card className="relative overflow-hidden border border-border bg-surface p-6 rounded-[4px]">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] border border-primary/30 bg-primary/15">
                  <Sparkles size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-serif text-base font-medium text-ink">{landing.aiCardTitle}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    &ldquo;{landing.aiCardQuote}&rdquo;
                  </p>
                </div>
              </div>
              <div className="mt-5 flex gap-2 pt-2 border-t border-border">
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

        {/* Gamified learning */}
        <section className="container-app py-16">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
              {landing.gamificationTitle}
            </h2>
            <p className="mt-2 text-sm text-ink-muted">{landing.gamificationSubtitle}</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            <Card className="flex flex-col items-center gap-3 p-6 text-center rounded-[4px] border border-border bg-surface">
              <Flame size={28} className="text-primary" />
              <p className="font-serif text-xl font-medium text-ink">{landing.streakBoxTitle}</p>
              <p className="text-sm text-ink-muted">{landing.streakBoxDesc}</p>
            </Card>
            <Card className="flex flex-col items-center gap-3 p-6 text-center rounded-[4px] border border-border bg-surface">
              <Star size={28} className="text-accent" />
              <p className="font-serif text-xl font-medium text-ink">{landing.xpBoxTitle}</p>
              <p className="text-sm text-ink-muted">{landing.xpBoxDesc}</p>
            </Card>
            <Card className="flex flex-col items-center gap-3 p-6 text-center rounded-[4px] border border-border bg-surface">
              <Trophy size={28} className="text-primary" />
              <p className="font-serif text-xl font-medium text-ink">{landing.achievementsBoxTitle}</p>
              <p className="text-sm text-ink-muted">{landing.achievementsBoxDesc}</p>
            </Card>
          </div>
        </section>

        {/* Progress visualization */}
        <section className="border-t border-border bg-surface-2/60 py-16">
          <div className="container-app grid items-center gap-10 lg:grid-cols-2">
            <div className="order-2 flex justify-center gap-8 lg:order-1">
              <ProgressRing value={82} label="82%" sublabel="Course" size={120} colorVar="var(--primary)" />
              <ProgressRing value={65} label="18/22" sublabel="Lessons" size={120} colorVar="var(--accent)" />
              <ProgressRing value={40} label="20/30" sublabel="Today" size={120} colorVar="var(--primary)" />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
                {landing.progressTitle}
              </h2>
              <p className="mt-3 text-ink-muted leading-relaxed">{landing.progressSubtitle}</p>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="container-app py-16">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
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
              <Card key={a.label} className="flex flex-col items-center gap-3 p-6 text-center rounded-[4px] border border-border bg-surface">
                <div className="flex h-12 w-12 items-center justify-center rounded-[4px] border border-primary/30 bg-primary/15 text-primary">
                  <a.icon size={22} />
                </div>
                <p className="font-serif text-sm font-medium text-ink">{a.label}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/achievements">
              <Button variant="secondary">{landing.achievementsButtonText}</Button>
            </Link>
          </div>
        </section>

        {/* Certificates */}
        <section className="border-t border-border bg-surface-2/60 py-16">
          <div className="container-app grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
                {landing.certificatesTitle}
              </h2>
              <p className="mt-3 text-ink-muted leading-relaxed">
                {landing.certificatesSubtitle}
              </p>
              <Link href="/pricing" className="mt-5 inline-block">
                <Button variant="secondary">{landing.certificatesButtonText}</Button>
              </Link>
            </div>
            <Card className="overflow-hidden p-4 rounded-[4px] border border-border bg-surface">
              {landing.certificateImageUrl ? (
                <div className="relative overflow-hidden rounded-[4px] bg-bg p-2 flex items-center justify-center border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={landing.certificateImageUrl}
                    alt="Certificate Preview"
                    className="max-h-72 w-full object-contain rounded-[2px]"
                  />
                </div>
              ) : (
                <div className="rounded-[4px] border border-dashed border-primary/30 bg-primary/5 p-6 text-center">
                  <Award size={32} className="mx-auto text-primary" />
                  <p className="mt-3 text-xs font-mono uppercase tracking-wider text-primary">
                    {landing.certificateCardTitle}
                  </p>
                  <p className="mt-1 font-serif text-lg font-medium text-ink">
                    {landing.certificateCourseName}
                  </p>
                  <p className="mt-1 text-xs font-mono text-ink-muted">{landing.certificateIssuedTo}</p>
                </div>
              )}
            </Card>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container-app py-16">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
              {landing.testimonialsTitle}
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.id} className="p-6 rounded-[4px] border border-border bg-surface">
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3 pt-3 border-t border-border">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-primary-fg"
                  >
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-serif text-sm font-medium text-ink">{t.name}</p>
                    <p className="text-xs font-mono text-ink-muted">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border bg-surface-2/60 py-16">
          <div className="container-app">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
                {landing.faqTitle}
              </h2>
            </div>
            <div className="mt-10">
              <Faq />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container-app py-20">
          <Card className="overflow-hidden border border-border bg-surface p-10 text-center sm:p-16 rounded-[4px] path-bg">
            <h2 className="font-serif text-3xl font-medium text-ink sm:text-4xl">
              {landing.finalCtaTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-ink-muted leading-relaxed">
              {landing.finalCtaSubtitle}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/courses">
                <Button size="lg">
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


