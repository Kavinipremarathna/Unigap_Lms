"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface LandingPageContent {
  // Top Announcement Banner
  bannerActive: boolean;
  bannerText: string;
  bannerLink: string;

  // Hero Section
  heroBadge: string;
  heroHeadingLine1: string;
  heroHeadingLine2: string;
  heroHeadingGradient: string;
  heroSubheading: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
  statLearners: string;
  statCourses: string;
  statRating: string;

  // Categories Section
  categoriesTitle: string;
  categoriesSubtitle: string;

  // Popular Courses Section
  popularCoursesTitle: string;
  popularCoursesSubtitle: string;

  // How UNIGAP Works
  howWorksTitle: string;
  howWorksSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  // AI Learning Companion
  aiBadgeText: string;
  aiTitle: string;
  aiDescription: string;
  aiFeature1: string;
  aiFeature2: string;
  aiFeature3: string;
  aiCardTitle: string;
  aiCardQuote: string;

  // Gamification Section
  gamificationTitle: string;
  gamificationSubtitle: string;
  streakBoxTitle: string;
  streakBoxDesc: string;
  xpBoxTitle: string;
  xpBoxDesc: string;
  achievementsBoxTitle: string;
  achievementsBoxDesc: string;

  // Progress Rings Section
  progressTitle: string;
  progressSubtitle: string;

  // Achievements Section
  achievementsTitle: string;
  achievementsSubtitle: string;
  achievementsButtonText: string;

  // Certificates Section
  certificatesTitle: string;
  certificatesSubtitle: string;
  certificatesButtonText: string;
  certificateCardTitle: string;
  certificateCourseName: string;
  certificateIssuedTo: string;
  certificateImageUrl: string;

  // Testimonials Section
  testimonialsTitle: string;

  // FAQ Section
  faqTitle: string;

  // Final CTA
  finalCtaTitle: string;
  finalCtaSubtitle: string;
  finalCtaPrimaryText: string;
  finalCtaSecondaryText: string;
}

export interface LearnerDashboardContent {
  greetingSubtext: string;
  companionTitle: string;
  companionMessage: string;
  companionActionText: string;
  dailyGoalMinutes: number;
  promoActive: boolean;
  promoBadge: string;
  promoHeading: string;
  promoDescription: string;
}

interface SiteContentContextType {
  landing: LandingPageContent;
  dashboard: LearnerDashboardContent;
  updateLanding: (data: Partial<LandingPageContent>) => void;
  updateDashboard: (data: Partial<LearnerDashboardContent>) => void;
  resetLandingDefaults: () => void;
}

export const defaultLandingContent: LandingPageContent = {
  bannerActive: true,
  bannerText: "🚀 Early Bird Enrollment: Master Fullstack & AI with 20% off using code UNIGAP2026",
  bannerLink: "/pricing",

  heroBadge: "✨ AI-guided learning, built to stick",
  heroHeadingLine1: "Learn Smarter.",
  heroHeadingLine2: "Stay Motivated.",
  heroHeadingGradient: "Go Further.",
  heroSubheading: "Real courses, personalized progress, and an AI companion that keeps you moving — with achievements and certificates that mean something.",
  ctaPrimaryText: "Explore Courses",
  ctaPrimaryLink: "/courses",
  ctaSecondaryText: "Start Learning",
  ctaSecondaryLink: "/dashboard",
  statLearners: "340K+ learners",
  statCourses: "120+ courses",
  statRating: "4.8 avg. rating",

  categoriesTitle: "Explore by category",
  categoriesSubtitle: "Find the right starting point for your goals.",

  popularCoursesTitle: "Popular courses",
  popularCoursesSubtitle: "Learners are making the most progress here right now.",

  howWorksTitle: "How UNIGAP works",
  howWorksSubtitle: "A simple loop, designed to keep you moving forward.",
  step1Title: "Find your path",
  step1Desc: "Browse structured courses matched to your level and goals.",
  step2Title: "Learn in small steps",
  step2Desc: "Bite-sized lessons and a daily goal make progress easy to sustain.",
  step3Title: "Track real progress",
  step3Desc: "Streaks, XP, and achievements turn consistency into visible momentum.",

  aiBadgeText: "AI Learning Companion",
  aiTitle: "A companion that actually knows where you are",
  aiDescription: "Not a generic chatbot — a quiet presence that tracks your real progress and speaks up with context: how close you are, what's next, and why it matters right now.",
  aiFeature1: "Personalized nudges based on real progress",
  aiFeature2: "Context-aware, not generic",
  aiFeature3: "Surfaces the next best step",
  aiCardTitle: "Your Learning Companion",
  aiCardQuote: "You're only two lessons away from completing React Fundamentals. You've already made great progress this week — keep the streak going.",

  gamificationTitle: "Learning that motivates itself",
  gamificationSubtitle: "Streaks, XP, and levels — built to reward consistency, not distract from it.",
  streakBoxTitle: "7 Day Streak",
  streakBoxDesc: "Consistency, visualized daily.",
  xpBoxTitle: "1,240 XP · Level 8",
  xpBoxDesc: "Every lesson counts toward growth.",
  achievementsBoxTitle: "12 Achievements",
  achievementsBoxDesc: "Milestones worth celebrating.",

  progressTitle: "See your progress, not just your to-do list",
  progressSubtitle: "Progress rings, milestone markers, and animated counters make growth visible — so momentum feels real, not abstract.",

  achievementsTitle: "Achievements worth earning",
  achievementsSubtitle: "Real milestones, not empty badges.",
  achievementsButtonText: "View All Achievements",

  certificatesTitle: "Certificates that hold up",
  certificatesSubtitle: "Finish a course and earn a verified certificate you can share with employers, teams, or future you.",
  certificatesButtonText: "See Certificate Plans",
  certificateCardTitle: "Certificate of Completion",
  certificateCourseName: "React Development",
  certificateIssuedTo: "Issued to Jordan Diaz · UNIGAP-2026-04821",
  certificateImageUrl: "",

  testimonialsTitle: "Learners who kept going",

  faqTitle: "Frequently asked questions",

  finalCtaTitle: "Your next skill starts today",
  finalCtaSubtitle: "Join thousands of learners building real momentum with UNIGAP.",
  finalCtaPrimaryText: "Explore Courses",
  finalCtaSecondaryText: "Start Learning",
};

export const defaultDashboardContent: LearnerDashboardContent = {
  greetingSubtext: "Let's keep the momentum going. 2 lessons to complete your goal!",
  companionTitle: "Your Learning Companion",
  companionMessage: "You're only two lessons away from completing React Fundamentals. You've already made great progress this week.",
  companionActionText: "Continue Learning",
  dailyGoalMinutes: 30,
  promoActive: true,
  promoBadge: "Special Track",
  promoHeading: "Cloud Architecture Masterclass",
  promoDescription: "Advance your career with hands-on AWS, Docker, and Kubernetes labs.",
};

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [landing, setLanding] = useState<LandingPageContent>(defaultLandingContent);
  const [dashboard, setDashboard] = useState<LearnerDashboardContent>(defaultDashboardContent);

  useEffect(() => {
    try {
      const savedLanding = localStorage.getItem("unigap_landing_content");
      const savedDashboard = localStorage.getItem("unigap_dashboard_content");
      if (savedLanding) {
        setLanding((prev) => ({ ...prev, ...JSON.parse(savedLanding) }));
      }
      if (savedDashboard) {
        setDashboard((prev) => ({ ...prev, ...JSON.parse(savedDashboard) }));
      }
    } catch {
      // ignore
    }
  }, []);

  const updateLanding = (data: Partial<LandingPageContent>) => {
    setLanding((prev) => {
      const updated = { ...prev, ...data };
      try {
        localStorage.setItem("unigap_landing_content", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const updateDashboard = (data: Partial<LearnerDashboardContent>) => {
    setDashboard((prev) => {
      const updated = { ...prev, ...data };
      try {
        localStorage.setItem("unigap_dashboard_content", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const resetLandingDefaults = () => {
    setLanding(defaultLandingContent);
    try {
      localStorage.removeItem("unigap_landing_content");
    } catch {
      // ignore
    }
  };

  return (
    <SiteContentContext.Provider
      value={{
        landing,
        dashboard,
        updateLanding,
        updateDashboard,
        resetLandingDefaults,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    return {
      landing: defaultLandingContent,
      dashboard: defaultDashboardContent,
      updateLanding: () => {},
      updateDashboard: () => {},
      resetLandingDefaults: () => {},
    };
  }
  return context;
}
