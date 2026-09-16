"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { Check, X, Sparkles, HelpCircle, ShieldCheck, Zap, ChevronDown, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const pricingTiers = [
  {
    id: "free",
    name: "Free Learner",
    monthlyPrice: 0,
    annualPrice: 0,
    period: "forever",
    description: "Start exploring free courses and build your daily learning streak.",
    features: [
      "Access to all Free Courses",
      "Daily goal & streak tracking",
      "Community forum access",
      "Basic level badges",
    ],
    cta: "Get Started Free",
    ctaHref: "/register",
    highlighted: false,
    badge: null,
  },
  {
    id: "pro",
    name: "Pro Learner",
    monthlyPrice: 19,
    annualPrice: 12,
    period: "month",
    description: "Full access to all courses, verified certificates, and AI learning tools.",
    features: [
      "Unlimited access to ALL Free & Paid Courses",
      "Official Verified Skill Certificates",
      "Personal AI Learning Companion",
      "Advanced XP & streak analytics",
      "Downloadable source code & resources",
      "Priority instructor support",
    ],
    cta: "Start Pro Trial",
    ctaHref: "/register?plan=pro",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "annual",
    name: "Pro Lifetime / Team",
    monthlyPrice: 39,
    annualPrice: 29,
    period: "month",
    description: "Designed for ambitious developers and team upskilling with dedicated mentorship.",
    features: [
      "Everything in Pro Learner",
      "Team progress dashboard & metrics",
      "1-on-1 monthly code review session",
      "Early access to newly released courses",
      "Custom learning pathway builder",
      "Dedicated account support",
    ],
    cta: "Upgrade to Annual",
    ctaHref: "/register?plan=annual",
    highlighted: false,
    badge: "Best Value",
  },
];

const comparisonMatrix = [
  {
    category: "Course Access & Content",
    items: [
      { name: "Free Course Catalog", free: true, pro: true, annual: true },
      { name: "Paid Premium Courses ($49-$99)", free: false, pro: true, annual: true },
      { name: "Video Lessons & HD Streaming", free: true, pro: true, annual: true },
      { name: "Downloadable Exercise Files & Code", free: false, pro: true, annual: true },
      { name: "Early Access to New Releases", free: false, pro: false, annual: true },
    ],
  },
  {
    category: "Certification & Gamification",
    items: [
      { name: "Daily Streak & Goal Tracker", free: true, pro: true, annual: true },
      { name: "XP & Achievement Badges", free: true, pro: true, annual: true },
      { name: "Verified PDF Skill Certificates", free: false, pro: true, annual: true },
      { name: "Shareable LinkedIn Credentials", free: false, pro: true, annual: true },
    ],
  },
  {
    category: "AI & Learning Tools",
    items: [
      { name: "Interactive Quiz Assessments", free: true, pro: true, annual: true },
      { name: "Personal AI Learning Assistant", free: false, pro: true, annual: true },
      { name: "1-on-1 Monthly Mentorship / Code Review", free: false, pro: false, annual: true },
      { name: "Priority Support Response (<2 hours)", free: false, pro: true, annual: true },
    ],
  },
];

const pricingFaqs = [
  {
    question: "Can I try UNIGAP for free before subscribing?",
    answer: "Yes! UNIGAP offers a wide selection of 100% Free Courses. You can create an account, start learning, track daily streaks, and earn badges without adding a credit card.",
  },
  {
    question: "How do verified certificates work?",
    answer: "When you complete 100% of a course's lessons and pass the final quiz on a Pro plan, a unique verified certificate with a serial ID is instantly generated. You can share it directly to LinkedIn or download a PDF.",
  },
  {
    question: "Can I upgrade or cancel my subscription anytime?",
    answer: "Absoloutely. You can switch between Monthly and Annual billing or cancel your subscription at any time directly from your Account Settings with a single click. No hidden fees or lock-ins.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We support all major credit/debit cards (Visa, MasterCard, American Express), PayPal, and direct bank transfers for team plans.",
  },
  {
    question: "Do you offer team or institutional discounts?",
    answer: "Yes! If you are purchasing for a team of 5 or more learners, contact our team for volume pricing and custom learning paths.",
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="bg-bg text-ink min-h-screen flex flex-col transition-colors">
      <Navbar />

      <main className="container-app py-12 md:py-16 flex-1 space-y-16">
        {/* HERO HEADER */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md">
            <Sparkles size={14} className="text-primary animate-pulse" />
            <span>Flexible Plans for Every Learner</span>
          </div>

          <h1 className="font-sans text-3xl font-extrabold text-ink sm:text-5xl tracking-tight leading-tight">
            Simple, transparent <span className="gradient-text-primary">pricing</span>
          </h1>

          <p className="text-sm md:text-base text-ink-muted leading-relaxed max-w-xl mx-auto">
            Start free with our foundation courses. Upgrade to Pro anytime for full course access, verified certificates, and AI learning tools.
          </p>

          {/* BILLING TOGGLE */}
          <div className="pt-6 flex justify-center items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface-2/90 p-1.5 backdrop-blur-md shadow-md">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "rounded-full px-6 py-2.5 text-xs font-extrabold transition-all cursor-pointer select-none",
                  billingCycle === "monthly"
                    ? "bg-primary text-primary-fg shadow-lg shadow-primary/25 scale-[1.02]"
                    : "text-ink-muted hover:text-ink hover:bg-surface/50"
                )}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={cn(
                  "rounded-full px-6 py-2.5 text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer select-none",
                  billingCycle === "annual"
                    ? "bg-primary text-primary-fg shadow-lg shadow-primary/25 scale-[1.02]"
                    : "text-ink-muted hover:text-ink hover:bg-surface/50"
                )}
              >
                <span>Annual Billing</span>
                <span className="rounded-full bg-emerald-500 text-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-xs">
                  Save 35%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* PRICING CARDS GRID */}
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3 items-stretch">
          {pricingTiers.map((tier) => {
            const isAnnual = billingCycle === "annual";
            const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;
            const totalPrice = isAnnual ? tier.annualPrice * 12 : tier.monthlyPrice;

            return (
              <Card
                key={tier.id}
                className={cn(
                  "flex flex-col p-8 rounded-3xl border border-border/80 bg-surface/90 backdrop-blur-xl relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
                  tier.highlighted && "border-primary/80 ring-2 ring-primary/40 shadow-xl bg-gradient-to-b from-surface-2/90 via-surface/90 to-surface/90"
                )}
              >
                {tier.badge && (
                  <span
                    className={cn(
                      "absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider shadow-md",
                      tier.highlighted
                        ? "bg-gradient-to-r from-primary to-[#920090] text-primary-fg"
                        : "bg-surface-2 border border-border text-ink font-semibold"
                    )}
                  >
                    {tier.badge}
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="font-sans text-xl font-bold text-ink">{tier.name}</h3>
                  <p className="mt-2 text-xs text-ink-muted leading-relaxed min-h-[36px]">
                    {tier.description}
                  </p>
                </div>

                <div className="mb-8 flex items-baseline gap-1.5 border-b border-border/60 pb-6">
                  {tier.period === "forever" ? (
                    <div>
                      <span className="font-sans text-4xl sm:text-5xl font-extrabold text-ink tracking-tight">
                        $0
                      </span>
                      <span className="ml-2 text-xs font-semibold text-ink-muted">forever free</span>
                    </div>
                  ) : isAnnual ? (
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1">
                        <span className="font-sans text-4xl sm:text-5xl font-extrabold text-ink tracking-tight">
                          ${tier.annualPrice}
                        </span>
                        <span className="text-xs font-bold text-ink-muted">/ month</span>
                      </div>
                      <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        ${totalPrice} billed annually (Save 35%)
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1">
                        <span className="font-sans text-4xl sm:text-5xl font-extrabold text-ink tracking-tight">
                          ${tier.monthlyPrice}
                        </span>
                        <span className="text-xs font-bold text-ink-muted">/ month</span>
                      </div>
                      <p className="text-[11px] font-semibold text-ink-muted">
                        Billed monthly, cancel anytime
                      </p>
                    </div>
                  )}
                </div>

                <ul className="flex-1 space-y-3.5 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs text-ink/90 font-medium">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 shrink-0 mt-0.5">
                        <Check size={13} strokeWidth={2.5} />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={tier.ctaHref} className="w-full">
                  <Button
                    size="lg"
                    variant={tier.highlighted ? "primary" : "secondary"}
                    className={cn(
                      "w-full rounded-2xl font-bold transition-all shadow-md group flex items-center justify-center gap-2",
                      tier.highlighted && "bg-gradient-to-r from-primary via-[#920090] to-primary hover:shadow-primary/30"
                    )}
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>

        {/* TRUST BANNER */}
        <div className="mx-auto max-w-4xl rounded-3xl border border-border/80 bg-surface-2/60 p-6 md:p-8 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-sans text-sm font-bold text-ink">14-Day Money-Back Guarantee</h4>
              <p className="text-xs text-ink-muted">
                Try Pro risk-free. If you are not completely satisfied within 14 days, receive a 100% refund.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <Zap size={14} /> Instant Access
            </span>
          </div>
        </div>

        {/* FEATURE COMPARISON MATRIX TABLE */}
        <div className="mx-auto max-w-5xl space-y-6 pt-6">
          <div className="text-center space-y-2">
            <h2 className="font-sans text-2xl font-bold text-ink">Full Feature Comparison</h2>
            <p className="text-xs text-ink-muted">Compare plan features side by side to find your ideal fit.</p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border/80 bg-surface/90 backdrop-blur-xl shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/80 bg-surface-2/80">
                    <th className="p-5 font-bold text-ink text-sm w-2/5">Features & Capabilities</th>
                    <th className="p-5 font-bold text-ink text-center w-1/5">Free Learner</th>
                    <th className="p-5 font-bold text-primary text-center w-1/5 bg-primary/5">Pro Learner</th>
                    <th className="p-5 font-bold text-ink text-center w-1/5">Pro Lifetime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {comparisonMatrix.map((section, sIdx) => (
                    <Fragment key={sIdx}>
                      <tr className="bg-surface-2/40">
                        <td colSpan={4} className="px-5 py-3 font-bold text-primary text-[11px] uppercase tracking-wider">
                          {section.category}
                        </td>
                      </tr>
                      {section.items.map((item, iIdx) => (
                        <tr key={iIdx} className="hover:bg-surface-2/30 transition-colors">
                          <td className="p-4 font-medium text-ink/90">{item.name}</td>
                          <td className="p-4 text-center">
                            {item.free ? (
                              <Check size={16} className="mx-auto text-emerald-500" strokeWidth={2.5} />
                            ) : (
                              <X size={16} className="mx-auto text-ink-muted/40" />
                            )}
                          </td>
                          <td className="p-4 text-center bg-primary/5">
                            {item.pro ? (
                              <Check size={16} className="mx-auto text-emerald-500" strokeWidth={2.5} />
                            ) : (
                              <X size={16} className="mx-auto text-ink-muted/40" />
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {item.annual ? (
                              <Check size={16} className="mx-auto text-emerald-500" strokeWidth={2.5} />
                            ) : (
                              <X size={16} className="mx-auto text-ink-muted/40" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* PRICING FAQ ACCORDION */}
        <div className="mx-auto max-w-3xl space-y-6 pt-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <HelpCircle size={14} />
              <span>Got Questions?</span>
            </div>
            <h2 className="font-sans text-2xl font-bold text-ink">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {pricingFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-ink hover:text-primary transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={cn("text-ink-muted transition-transform duration-200 shrink-0", isOpen && "rotate-180 text-primary")}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs text-ink-muted leading-relaxed border-t border-border/40 mt-1 pt-3 animate-in fade-in slide-in-from-top-1">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FINAL CTA BANNER */}
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-primary via-[#920090] to-primary p-8 md:p-12 text-center text-primary-fg shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <h3 className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight">
              Ready to accelerate your learning?
            </h3>
            <p className="text-xs md:text-sm text-primary-fg/80 leading-relaxed">
              Join thousands of students mastering top skills with structured courses, daily streaks, and verified certificates.
            </p>
            <div className="pt-2">
              <Link href="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full bg-white text-primary font-bold hover:bg-white/90 shadow-xl px-8"
                >
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


