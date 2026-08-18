"use client";

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
import { courses } from "@/lib/mock/courses";
import { testimonials } from "@/lib/mock/misc";
import { useSiteContent } from "@/lib/context/site-content-context";

const categories = [
  { label: "Web Development", icon: Code2, count: 24 },
  { label: "Programming", icon: Terminal, count: 31 },
  { label: "Data Science", icon: BarChart3, count: 18 },
  { label: "Cloud Computing", icon: Cloud, count: 14 },
  { label: "Artificial Intelligence", icon: BrainCircuit, count: 12 },
  { label: "Cybersecurity", icon: ShieldCheck, count: 9 },
];

export default function HomePage() {
  const { landing } = useSiteContent();
  const featured = [...courses].sort((a, b) => b.learners - a.learners).slice(0, 4);

  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {/* Learning categories */}
        <section className="container-app py-16">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-ink sm:text-3xl">
                {landing.categoriesTitle}
              </h2>
              <p className="mt-1.5 text-ink-muted">{landing.categoriesSubtitle}</p>
            </div>
            <Link
              href="/courses"
              className="hidden text-sm font-semibold text-primary sm:flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <Link key={c.label} href="/courses">
                <Card className="flex flex-col items-center gap-2 p-5 text-center transition-shadow hover:shadow-elevated">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50">
                    <c.icon size={20} className="text-primary" />
                  </div>
                  <p className="text-xs font-semibold text-ink leading-tight">{c.label}</p>
                  <p className="text-[11px] text-ink-muted">{c.count} courses</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular courses */}
        <section className="border-t border-border bg-surface-2/50 py-16">
          <div className="container-app">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-ink sm:text-3xl">
                  {landing.popularCoursesTitle}
                </h2>
                <p className="mt-1.5 text-ink-muted">{landing.popularCoursesSubtitle}</p>
              </div>
              <Link
                href="/courses"
                className="hidden text-sm font-semibold text-primary sm:flex items-center gap-1 hover:underline"
              >
                Browse all <ArrowRight size={15} />
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
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">
              {landing.howWorksTitle}
            </h2>
            <p className="mt-2 text-ink-muted">{landing.howWorksSubtitle}</p>
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
              <Card key={s.title} className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-fg text-sm font-bold">
                  {i + 1}
                </div>
                <s.icon size={22} className="mt-4 text-primary" />
                <h3 className="mt-3 font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-muted">{s.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* AI Learning Companion */}
        <section className="border-t border-border bg-surface-2/50 py-16">
          <div className="container-app grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge variant="primary">
                <Sparkles size={12} /> {landing.aiBadgeText}
              </Badge>
              <h2 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">
                {landing.aiTitle}
              </h2>
              <p className="mt-3 text-ink-muted leading-relaxed">{landing.aiDescription}</p>
              <ul className="mt-5 space-y-2.5 text-sm text-ink">
                {[landing.aiFeature1, landing.aiFeature2, landing.aiFeature3].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary-50 to-surface p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#520051] to-[#d400d1]">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{landing.aiCardTitle}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    &ldquo;{landing.aiCardQuote}&rdquo;
                  </p>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
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
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">
              {landing.gamificationTitle}
            </h2>
            <p className="mt-2 text-ink-muted">{landing.gamificationSubtitle}</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            <Card className="flex flex-col items-center gap-3 p-6 text-center">
              <Flame size={28} className="text-streak" />
              <p className="text-2xl font-bold text-ink">{landing.streakBoxTitle}</p>
              <p className="text-sm text-ink-muted">{landing.streakBoxDesc}</p>
            </Card>
            <Card className="flex flex-col items-center gap-3 p-6 text-center">
              <Star size={28} className="text-xp" />
              <p className="text-2xl font-bold text-ink">{landing.xpBoxTitle}</p>
              <p className="text-sm text-ink-muted">{landing.xpBoxDesc}</p>
            </Card>
            <Card className="flex flex-col items-center gap-3 p-6 text-center">
              <Trophy size={28} className="text-warning" />
              <p className="text-2xl font-bold text-ink">{landing.achievementsBoxTitle}</p>
              <p className="text-sm text-ink-muted">{landing.achievementsBoxDesc}</p>
            </Card>
          </div>
        </section>

        {/* Progress visualization */}
        <section className="border-t border-border bg-surface-2/50 py-16">
          <div className="container-app grid items-center gap-10 lg:grid-cols-2">
            <div className="order-2 flex justify-center gap-8 lg:order-1">
              <ProgressRing value={82} label="82%" sublabel="Course" size={120} />
              <ProgressRing value={65} label="18/22" sublabel="Lessons" size={120} colorVar="--accent" />
              <ProgressRing value={40} label="20/30" sublabel="Today" size={120} colorVar="--success" />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-2xl font-bold text-ink sm:text-3xl">
                {landing.progressTitle}
              </h2>
              <p className="mt-3 text-ink-muted leading-relaxed">{landing.progressSubtitle}</p>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="container-app py-16">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">
              {landing.achievementsTitle}
            </h2>
            <p className="mt-2 text-ink-muted">{landing.achievementsSubtitle}</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Trophy, label: "First Course" },
              { icon: Flame, label: "7-Day Streak" },
              { icon: ListChecks, label: "10 Lessons" },
              { icon: Award, label: "Quiz Master" },
            ].map((a) => (
              <Card key={a.label} className="flex flex-col items-center gap-3 p-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#520051] to-[#d400d1]">
                  <a.icon size={24} className="text-white" />
                </div>
                <p className="text-sm font-semibold text-ink">{a.label}</p>
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
        <section className="border-t border-border bg-surface-2/50 py-16">
          <div className="container-app grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-ink sm:text-3xl">
                {landing.certificatesTitle}
              </h2>
              <p className="mt-3 text-ink-muted leading-relaxed">
                {landing.certificatesSubtitle}
              </p>
              <Link href="/pricing" className="mt-5 inline-block">
                <Button variant="secondary">{landing.certificatesButtonText}</Button>
              </Link>
            </div>
            <Card className="overflow-hidden p-4 shadow-sm">
              {landing.certificateImageUrl ? (
                <div className="relative overflow-hidden rounded-xl bg-slate-950/5 p-2 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={landing.certificateImageUrl}
                    alt="Certificate Preview"
                    className="max-h-72 w-full object-contain rounded-lg shadow-sm"
                  />
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary-50/40 p-6 text-center">
                  <Award size={32} className="mx-auto text-primary" />
                  <p className="mt-3 text-sm font-semibold text-ink">
                    {landing.certificateCardTitle}
                  </p>
                  <p className="mt-1 text-lg font-bold text-ink">
                    {landing.certificateCourseName}
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">{landing.certificateIssuedTo}</p>
                </div>
              )}
            </Card>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container-app py-16">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">
              {landing.testimonialsTitle}
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.id} className="p-6">
                <div className="flex gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${t.avatarColor} text-xs font-semibold text-white`}
                  >
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-ink-muted">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border bg-surface-2/50 py-16">
          <div className="container-app">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-ink sm:text-3xl">
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
          <Card className="path-bg overflow-hidden border-primary/20 p-10 text-center sm:p-16">
            <h2 className="text-3xl font-bold text-ink sm:text-4xl">
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
    </>
  );
}
