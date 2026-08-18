"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Sparkles,
  Save,
  Eye,
  CheckCircle2,
  Bell,
  Layers,
  ArrowRight,
  Flame,
  Star,
  RefreshCw,
  Award,
  Trophy,
  Layout,
  HelpCircle,
  MessageSquare,
  Compass,
  Zap,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  Lock,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminAuth } from "@/lib/context/admin-auth-context";
import { useSiteContent, defaultLandingContent } from "@/lib/context/site-content-context";

export default function AdminContentManagementPage() {
  const { addActivity, isSuperAdmin } = useAdminAuth();
  const { landing, dashboard, updateLanding, updateDashboard, resetLandingDefaults } =
    useSiteContent();



  const [activeTab, setActiveTab] = useState<"landing" | "dashboard">("landing");
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [savedToast, setSavedToast] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState(landing);
  const [dashboardFormData, setDashboardFormData] = useState(dashboard);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDashboardInputChange = (field: string, value: any) => {
    setDashboardFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveLanding = (e: React.FormEvent) => {
    e.preventDefault();
    updateLanding(formData);
    addActivity(
      "Updated Full Landing Page CMS",
      "Modified marketing titles, features, steps, AI companion copy, and CTAs"
    );
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleSaveDashboard = (e: React.FormEvent) => {
    e.preventDefault();
    updateDashboard(dashboardFormData);
    addActivity(
      "Updated Learner Dashboard CMS",
      "Modified companion prompt, motivation text, and promo highlight"
    );
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset all landing page content back to original defaults?")) {
      resetLandingDefaults();
      setFormData(defaultLandingContent);
      addActivity("Reset CMS Content", "Restored default landing page copy");
    }
  };

  return (
    <AdminShell>
      <div className="container-app px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fde8fc] px-3 py-1 text-xs font-bold text-[#920090]">
                <FileText size={13} /> Full Site Content CMS
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                100% Dynamic Content
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-[#520051] sm:text-3xl">
              Site Content Management
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Customize every section, headline, description, AI prompt, and CTA button across the entire platform.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#eee5ee] bg-white px-3.5 py-2 text-xs font-bold text-[#520051] transition hover:bg-[#faf5fa]"
            >
              <Eye size={15} />
              {showPreview ? "Hide Live Preview" : "Live Preview"}
            </button>

            {/* Tab Selector */}
            <div className="flex items-center rounded-2xl border border-[#e8dce8] bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab("landing")}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  activeTab === "landing"
                    ? "bg-[#520051] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#520051]"
                }`}
              >
                <Layout size={14} /> Landing Page
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  activeTab === "dashboard"
                    ? "bg-[#520051] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#520051]"
                }`}
              >
                <Sparkles size={14} /> Dashboard Copy
              </button>
            </div>
          </div>
        </div>

        {/* Toast Alert */}
        {savedToast && (
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>Site content changes saved successfully! Live pages updated.</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-700">Persisted</span>
          </div>
        )}

        {/* LANDING PAGE CMS TAB */}
        {activeTab === "landing" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            {/* Navigation Sidebar for Landing Page Sections */}
            <div className="lg:col-span-3 space-y-1">
              <div className="rounded-2xl border border-[#eee5ee] bg-white p-3 shadow-sm">
                <p className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Landing Page Sections
                </p>
                {[
                  { id: "banner", label: "Top Banner", icon: Bell },
                  { id: "hero", label: "Hero & CTAs", icon: Zap },
                  { id: "categories", label: "Categories & Courses", icon: Compass },
                  { id: "how_works", label: "How UNIGAP Works", icon: Layers },
                  { id: "ai_companion", label: "AI Companion Spotlight", icon: Sparkles },
                  { id: "gamification", label: "Gamified Motivation", icon: Flame },
                  { id: "certificates", label: "Certificates & Credentials", icon: Award },
                  { id: "final_cta", label: "Bottom CTA Banner", icon: ArrowRight },
                ].map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveSection(section.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all text-left ${
                        activeSection === section.id
                          ? "bg-[#fde8fc] text-[#920090]"
                          : "text-slate-600 hover:bg-[#faf5fa] hover:text-[#520051]"
                      }`}
                    >
                      <Icon size={16} className="shrink-0" />
                      <span className="truncate">{section.label}</span>
                    </button>
                  );
                })}

                <div className="mt-4 border-t border-[#eee5ee] pt-3 px-1">
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                  >
                    <RefreshCw size={13} /> Reset Defaults
                  </button>
                </div>
              </div>
            </div>

            {/* Content Form Editor */}
            <div className="lg:col-span-9">
              <form onSubmit={handleSaveLanding} className="space-y-6">
                {/* SECTION 1: TOP ANNOUNCEMENT BANNER */}
                {activeSection === "banner" && (
                  <div className="rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#eee5ee] pb-4">
                      <div>
                        <h2 className="text-base font-bold text-[#520051]">Top Announcement Banner</h2>
                        <p className="text-xs text-slate-500">Sticky banner displayed at the very top of the website</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.bannerActive}
                          onChange={(e) => handleInputChange("bannerActive", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#920090]" />
                        <span className="ml-2 text-xs font-bold text-slate-700">
                          {formData.bannerActive ? "Active" : "Hidden"}
                        </span>
                      </label>
                    </div>

                    <div className="mt-5 space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700">Banner Announcement Text</label>
                        <input
                          type="text"
                          value={formData.bannerText}
                          onChange={(e) => handleInputChange("bannerText", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700">Banner Link Target URL</label>
                        <input
                          type="text"
                          value={formData.bannerLink}
                          onChange={(e) => handleInputChange("bannerLink", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 2: HERO SECTION & CTAS */}
                {activeSection === "hero" && (
                  <div className="rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-sm">
                    <h2 className="text-base font-bold text-[#520051] border-b border-[#eee5ee] pb-4">
                      Hero Section & Primary Call to Actions
                    </h2>

                    <div className="mt-5 space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700">Hero Pill Badge</label>
                        <input
                          type="text"
                          value={formData.heroBadge}
                          onChange={(e) => handleInputChange("heroBadge", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700">Heading Line 1</label>
                          <input
                            type="text"
                            value={formData.heroHeadingLine1}
                            onChange={(e) => handleInputChange("heroHeadingLine1", e.target.value)}
                            className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700">Heading Line 2</label>
                          <input
                            type="text"
                            value={formData.heroHeadingLine2}
                            onChange={(e) => handleInputChange("heroHeadingLine2", e.target.value)}
                            className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700">Heading Highlight (Gradient)</label>
                          <input
                            type="text"
                            value={formData.heroHeadingGradient}
                            onChange={(e) => handleInputChange("heroHeadingGradient", e.target.value)}
                            className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700">Hero Subheading Description</label>
                        <textarea
                          rows={3}
                          value={formData.heroSubheading}
                          onChange={(e) => handleInputChange("heroSubheading", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-xs font-bold text-slate-700">Primary CTA Button Label</label>
                          <input
                            type="text"
                            value={formData.ctaPrimaryText}
                            onChange={(e) => handleInputChange("ctaPrimaryText", e.target.value)}
                            className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700">Secondary CTA Button Label</label>
                          <input
                            type="text"
                            value={formData.ctaSecondaryText}
                            onChange={(e) => handleInputChange("ctaSecondaryText", e.target.value)}
                            className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3 pt-2">
                        <div>
                          <label className="text-xs font-bold text-slate-700">Learners Count Stat</label>
                          <input
                            type="text"
                            value={formData.statLearners}
                            onChange={(e) => handleInputChange("statLearners", e.target.value)}
                            className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700">Courses Count Stat</label>
                          <input
                            type="text"
                            value={formData.statCourses}
                            onChange={(e) => handleInputChange("statCourses", e.target.value)}
                            className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700">Avg Rating Stat</label>
                          <input
                            type="text"
                            value={formData.statRating}
                            onChange={(e) => handleInputChange("statRating", e.target.value)}
                            className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 3: CATEGORIES & POPULAR COURSES */}
                {activeSection === "categories" && (
                  <div className="rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-sm space-y-6">
                    <div>
                      <h2 className="text-base font-bold text-[#520051] border-b border-[#eee5ee] pb-4">
                        Category & Course Grid Headings
                      </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-bold text-slate-700">Categories Title</label>
                        <input
                          type="text"
                          value={formData.categoriesTitle}
                          onChange={(e) => handleInputChange("categoriesTitle", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700">Categories Subtitle</label>
                        <input
                          type="text"
                          value={formData.categoriesSubtitle}
                          onChange={(e) => handleInputChange("categoriesSubtitle", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-bold text-slate-700">Popular Courses Title</label>
                        <input
                          type="text"
                          value={formData.popularCoursesTitle}
                          onChange={(e) => handleInputChange("popularCoursesTitle", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700">Popular Courses Subtitle</label>
                        <input
                          type="text"
                          value={formData.popularCoursesSubtitle}
                          onChange={(e) => handleInputChange("popularCoursesSubtitle", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 4: HOW UNIGAP WORKS */}
                {activeSection === "how_works" && (
                  <div className="rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-sm space-y-5">
                    <h2 className="text-base font-bold text-[#520051] border-b border-[#eee5ee] pb-4">
                      How UNIGAP Works (3-Step Loop)
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-bold text-slate-700">Section Title</label>
                        <input
                          type="text"
                          value={formData.howWorksTitle}
                          onChange={(e) => handleInputChange("howWorksTitle", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700">Section Subtitle</label>
                        <input
                          type="text"
                          value={formData.howWorksSubtitle}
                          onChange={(e) => handleInputChange("howWorksSubtitle", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="rounded-2xl border border-slate-100 bg-[#faf5fa] p-4">
                        <p className="text-xs font-extrabold text-[#520051]">Step 1 Card</p>
                        <div className="mt-2 grid gap-3 sm:grid-cols-2">
                          <input
                            type="text"
                            placeholder="Step 1 Title"
                            value={formData.step1Title}
                            onChange={(e) => handleInputChange("step1Title", e.target.value)}
                            className="rounded-xl border border-[#eee5ee] bg-white p-2.5 text-xs font-semibold text-slate-800 focus:border-[#920090] focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Step 1 Description"
                            value={formData.step1Desc}
                            onChange={(e) => handleInputChange("step1Desc", e.target.value)}
                            className="rounded-xl border border-[#eee5ee] bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-100 bg-[#faf5fa] p-4">
                        <p className="text-xs font-extrabold text-[#520051]">Step 2 Card</p>
                        <div className="mt-2 grid gap-3 sm:grid-cols-2">
                          <input
                            type="text"
                            placeholder="Step 2 Title"
                            value={formData.step2Title}
                            onChange={(e) => handleInputChange("step2Title", e.target.value)}
                            className="rounded-xl border border-[#eee5ee] bg-white p-2.5 text-xs font-semibold text-slate-800 focus:border-[#920090] focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Step 2 Description"
                            value={formData.step2Desc}
                            onChange={(e) => handleInputChange("step2Desc", e.target.value)}
                            className="rounded-xl border border-[#eee5ee] bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-100 bg-[#faf5fa] p-4">
                        <p className="text-xs font-extrabold text-[#520051]">Step 3 Card</p>
                        <div className="mt-2 grid gap-3 sm:grid-cols-2">
                          <input
                            type="text"
                            placeholder="Step 3 Title"
                            value={formData.step3Title}
                            onChange={(e) => handleInputChange("step3Title", e.target.value)}
                            className="rounded-xl border border-[#eee5ee] bg-white p-2.5 text-xs font-semibold text-slate-800 focus:border-[#920090] focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Step 3 Description"
                            value={formData.step3Desc}
                            onChange={(e) => handleInputChange("step3Desc", e.target.value)}
                            className="rounded-xl border border-[#eee5ee] bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 5: AI COMPANION */}
                {activeSection === "ai_companion" && (
                  <div className="rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-[#520051] border-b border-[#eee5ee] pb-4">
                      AI Learning Companion Feature Spotlight
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-bold text-slate-700">Feature Badge</label>
                        <input
                          type="text"
                          value={formData.aiBadgeText}
                          onChange={(e) => handleInputChange("aiBadgeText", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700">Headline Title</label>
                        <input
                          type="text"
                          value={formData.aiTitle}
                          onChange={(e) => handleInputChange("aiTitle", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700">Feature Description</label>
                      <textarea
                        rows={3}
                        value={formData.aiDescription}
                        onChange={(e) => handleInputChange("aiDescription", e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="text-xs font-bold text-slate-700">Checkmark Bullet Points</label>
                      <input
                        type="text"
                        value={formData.aiFeature1}
                        onChange={(e) => handleInputChange("aiFeature1", e.target.value)}
                        className="w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-2.5 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={formData.aiFeature2}
                        onChange={(e) => handleInputChange("aiFeature2", e.target.value)}
                        className="w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-2.5 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={formData.aiFeature3}
                        onChange={(e) => handleInputChange("aiFeature3", e.target.value)}
                        className="w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-2.5 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                      />
                    </div>

                    <div className="rounded-2xl border border-purple-100 bg-[#fde8fc]/40 p-4 space-y-3 mt-4">
                      <p className="text-xs font-bold text-[#520051]">AI Demo Floating Card Box</p>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600">Card Header Title</label>
                        <input
                          type="text"
                          value={formData.aiCardTitle}
                          onChange={(e) => handleInputChange("aiCardTitle", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600">Sample Companion Message</label>
                        <textarea
                          rows={2}
                          value={formData.aiCardQuote}
                          onChange={(e) => handleInputChange("aiCardQuote", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 6: GAMIFICATION & CERTIFICATES */}
                {activeSection === "gamification" && (
                  <div className="rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-[#520051] border-b border-[#eee5ee] pb-4">
                      Gamified Motivation Cards
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-bold text-slate-700">Section Title</label>
                        <input
                          type="text"
                          value={formData.gamificationTitle}
                          onChange={(e) => handleInputChange("gamificationTitle", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700">Section Subtitle</label>
                        <input
                          type="text"
                          value={formData.gamificationSubtitle}
                          onChange={(e) => handleInputChange("gamificationSubtitle", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 pt-2">
                      <div>
                        <label className="text-xs font-bold text-slate-700">Streak Card Label</label>
                        <input
                          type="text"
                          value={formData.streakBoxTitle}
                          onChange={(e) => handleInputChange("streakBoxTitle", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-2.5 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700">XP Card Label</label>
                        <input
                          type="text"
                          value={formData.xpBoxTitle}
                          onChange={(e) => handleInputChange("xpBoxTitle", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-2.5 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700">Achievements Card Label</label>
                        <input
                          type="text"
                          value={formData.achievementsBoxTitle}
                          onChange={(e) => handleInputChange("achievementsBoxTitle", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-2.5 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 7: CERTIFICATES */}
                {activeSection === "certificates" && (
                  <div className="rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-sm space-y-5">
                    <div className="border-b border-[#eee5ee] pb-4">
                      <h2 className="text-base font-bold text-[#520051]">
                        Certificates & Credential Section
                      </h2>
                      <p className="text-xs text-slate-500">
                        Upload or select a custom certificate preview image to display on the landing page.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-bold text-slate-700">Certificates Section Title</label>
                        <input
                          type="text"
                          value={formData.certificatesTitle}
                          onChange={(e) => handleInputChange("certificatesTitle", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700">Button CTA Text</label>
                        <input
                          type="text"
                          value={formData.certificatesButtonText}
                          onChange={(e) => handleInputChange("certificatesButtonText", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700">Certificates Subtitle Description</label>
                      <textarea
                        rows={2}
                        value={formData.certificatesSubtitle}
                        onChange={(e) => handleInputChange("certificatesSubtitle", e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                      />
                    </div>

                    {/* Certificate Image Upload & URL Section */}
                    <div className="rounded-2xl border border-purple-100 bg-[#fde8fc]/40 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#520051]">
                          <ImageIcon size={16} className="text-[#920090]" />
                          <span>Certificate Preview Image</span>
                        </div>
                        {formData.certificateImageUrl && (
                          <button
                            type="button"
                            onClick={() => handleInputChange("certificateImageUrl", "")}
                            className="flex items-center gap-1 text-[11px] font-bold text-red-600 hover:underline"
                          >
                            <X size={13} /> Remove Image
                          </button>
                        )}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 items-start">
                        {/* Upload Controls */}
                        <div className="space-y-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-600">Upload Image File</label>
                            <div className="mt-1 flex items-center gap-2">
                              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#920090]/40 bg-white px-4 py-3 text-xs font-bold text-[#920090] transition hover:bg-[#fde8fc]">
                                <Upload size={16} />
                                <span>Choose Image File...</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (ev) => {
                                        if (ev.target?.result) {
                                          handleInputChange("certificateImageUrl", ev.target.result as string);
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                            <p className="mt-1 text-[10px] text-slate-400">PNG, JPG, SVG or WEBP image supported</p>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600">Or Paste Image URL</label>
                            <div className="relative mt-1">
                              <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                type="text"
                                placeholder="https://example.com/certificate-preview.png"
                                value={formData.certificateImageUrl}
                                onChange={(e) => handleInputChange("certificateImageUrl", e.target.value)}
                                className="w-full rounded-xl border border-[#eee5ee] bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Visual Image Preview */}
                        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Live Certificate Preview
                          </p>
                          {formData.certificateImageUrl ? (
                            <div className="relative overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={formData.certificateImageUrl}
                                alt="Certificate Preview"
                                className="h-44 w-full object-contain p-2"
                              />
                            </div>
                          ) : (
                            <div className="rounded-lg border-2 border-dashed border-[#d400d1]/30 bg-[#fde8fc]/30 p-5 text-center">
                              <Award size={32} className="mx-auto text-[#920090]" />
                              <p className="mt-2 text-xs font-bold text-[#520051]">
                                {formData.certificateCardTitle || "Certificate of Completion"}
                              </p>
                              <p className="mt-0.5 text-sm font-bold text-slate-800">
                                {formData.certificateCourseName || "React Development"}
                              </p>
                              <p className="mt-0.5 text-[10px] text-slate-500">
                                {formData.certificateIssuedTo || "Issued to Jordan Diaz · UNIGAP-2026-04821"}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-[#faf5fa] p-4 space-y-3">
                      <p className="text-xs font-bold text-[#520051]">Fallback Text Card Info (When no image is uploaded)</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          type="text"
                          placeholder="Certificate Course Name"
                          value={formData.certificateCourseName}
                          onChange={(e) => handleInputChange("certificateCourseName", e.target.value)}
                          className="rounded-xl border border-[#eee5ee] bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Issued To string"
                          value={formData.certificateIssuedTo}
                          onChange={(e) => handleInputChange("certificateIssuedTo", e.target.value)}
                          className="rounded-xl border border-[#eee5ee] bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 8: BOTTOM CTA */}
                {activeSection === "final_cta" && (
                  <div className="rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-[#520051] border-b border-[#eee5ee] pb-4">
                      Bottom Call to Action Banner
                    </h2>

                    <div>
                      <label className="text-xs font-bold text-slate-700">Final CTA Headline</label>
                      <input
                        type="text"
                        value={formData.finalCtaTitle}
                        onChange={(e) => handleInputChange("finalCtaTitle", e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700">Final CTA Subtitle</label>
                      <input
                        type="text"
                        value={formData.finalCtaSubtitle}
                        onChange={(e) => handleInputChange("finalCtaSubtitle", e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-bold text-slate-700">Primary Button Label</label>
                        <input
                          type="text"
                          value={formData.finalCtaPrimaryText}
                          onChange={(e) => handleInputChange("finalCtaPrimaryText", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700">Secondary Button Label</label>
                        <input
                          type="text"
                          value={formData.finalCtaSecondaryText}
                          onChange={(e) => handleInputChange("finalCtaSecondaryText", e.target.value)}
                          className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button Bar */}
                <div className="flex items-center justify-end gap-3 rounded-2xl border border-[#eee5ee] bg-white p-4 shadow-sm">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#520051] to-[#920090] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:opacity-95"
                  >
                    <Save size={15} /> Save All Landing Page Content
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DASHBOARD COPY TAB */}
        {activeTab === "dashboard" && (
          <div className="mt-6 max-w-4xl space-y-6">
            <form onSubmit={handleSaveDashboard} className="space-y-6">
              <div className="rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-[#520051] border-b border-[#eee5ee] pb-4">
                  Learner Dashboard Copy & Companion Prompt
                </h2>

                <div>
                  <label className="text-xs font-bold text-slate-700">Greeting Subtitle Nudge</label>
                  <input
                    type="text"
                    value={dashboardFormData.greetingSubtext}
                    onChange={(e) => handleDashboardInputChange("greetingSubtext", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700">AI Companion Box Title</label>
                    <input
                      type="text"
                      value={dashboardFormData.companionTitle}
                      onChange={(e) => handleDashboardInputChange("companionTitle", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Button CTA Text</label>
                    <input
                      type="text"
                      value={dashboardFormData.companionActionText}
                      onChange={(e) => handleDashboardInputChange("companionActionText", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">AI Companion Contextual Prompt Message</label>
                  <textarea
                    rows={3}
                    value={dashboardFormData.companionMessage}
                    onChange={(e) => handleDashboardInputChange("companionMessage", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#eee5ee] pb-4">
                  <div>
                    <h2 className="text-base font-bold text-[#520051]">Special Track Highlight Card</h2>
                    <p className="text-xs text-slate-500">Promoted track displayed inside the learner dashboard sidebar</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dashboardFormData.promoActive}
                      onChange={(e) => handleDashboardInputChange("promoActive", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#920090]" />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Promo Track Badge</label>
                    <input
                      type="text"
                      value={dashboardFormData.promoBadge}
                      onChange={(e) => handleDashboardInputChange("promoBadge", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Promo Course Heading</label>
                    <input
                      type="text"
                      value={dashboardFormData.promoHeading}
                      onChange={(e) => handleDashboardInputChange("promoHeading", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Promo Description</label>
                  <textarea
                    rows={2}
                    value={dashboardFormData.promoDescription}
                    onChange={(e) => handleDashboardInputChange("promoDescription", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#eee5ee] bg-[#faf5fa] p-3 text-xs font-medium text-slate-800 focus:border-[#920090] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#520051] to-[#920090] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:opacity-95"
                >
                  <Save size={15} /> Save Dashboard CMS Content
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
