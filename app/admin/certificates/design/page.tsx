"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  ArrowLeft,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Star,
  Medal,
  CheckCircle2,
  Sliders,
  Eye,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  CertificateTemplateConfig,
  CertificateTheme,
  CertificateBorderStyle,
  CertificateSealStyle,
  DEFAULT_CERTIFICATE_TEMPLATE,
  getCertificateTemplate,
  saveCertificateTemplate,
} from "@/lib/services/certificate-template";

export default function AdminCertificateDesignerPage() {
  const [template, setTemplate] = useState<CertificateTemplateConfig>(DEFAULT_CERTIFICATE_TEMPLATE);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setTemplate(getCertificateTemplate());
  }, []);

  const handleSave = () => {
    saveCertificateTemplate(template);
    setToastMessage("Certificate Template Saved! Active for all course completions.");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReset = () => {
    setTemplate(DEFAULT_CERTIFICATE_TEMPLATE);
    saveCertificateTemplate(DEFAULT_CERTIFICATE_TEMPLATE);
    setToastMessage("Reset to Default Certificate Template.");
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Preview mock data
  const previewRecipient = "Jordan Diaz";
  const previewCourse = "React & Next.js Fullstack Masterclass 2026";
  const previewDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const previewHash = "UNI-CERT-2026-PREVIEW";

  // Dynamic Theme Styling map
  const themeStyles = {
    parchment: {
      outerBorder: "border-[#7c6a46]",
      cornerBorder: "border-[#9a865b]",
      bg: "bg-[#fbf9f4]",
      accentText: "text-[#7c6a46]",
      headerText: "text-[#4a3b2c]",
      badgeBg: "bg-[#4a3b2c]",
      sealBg: "bg-amber-100 text-[#4a3b2c] border-amber-300",
    },
    purple: {
      outerBorder: "border-[#520051]",
      cornerBorder: "border-[#920090]",
      bg: "bg-[#faf7fb]",
      accentText: "text-[#920090]",
      headerText: "text-[#520051]",
      badgeBg: "bg-[#520051]",
      sealBg: "bg-purple-100 text-[#520051] border-purple-300",
    },
    gold: {
      outerBorder: "border-amber-600",
      cornerBorder: "border-amber-500",
      bg: "bg-[#fffdf7]",
      accentText: "text-amber-600",
      headerText: "text-amber-900",
      badgeBg: "bg-amber-700",
      sealBg: "bg-amber-100 text-amber-800 border-amber-300",
    },
    emerald: {
      outerBorder: "border-emerald-700",
      cornerBorder: "border-emerald-500",
      bg: "bg-[#f6fbf8]",
      accentText: "text-emerald-600",
      headerText: "text-emerald-950",
      badgeBg: "bg-emerald-800",
      sealBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
    },
    navy: {
      outerBorder: "border-slate-800",
      cornerBorder: "border-blue-600",
      bg: "bg-[#f8fafc]",
      accentText: "text-blue-600",
      headerText: "text-slate-900",
      badgeBg: "bg-slate-900",
      sealBg: "bg-blue-100 text-blue-900 border-blue-300",
    },
    slate: {
      outerBorder: "border-zinc-700",
      cornerBorder: "border-zinc-500",
      bg: "bg-[#fafafa]",
      accentText: "text-zinc-600",
      headerText: "text-zinc-900",
      badgeBg: "bg-zinc-800",
      sealBg: "bg-zinc-200 text-zinc-800 border-zinc-300",
    },
  }[template.theme] || {
    outerBorder: "border-[#520051]",
    cornerBorder: "border-[#920090]",
    bg: "bg-[#faf7fb]",
    accentText: "text-[#920090]",
    headerText: "text-[#520051]",
    badgeBg: "bg-[#520051]",
    sealBg: "bg-purple-100 text-[#520051] border-purple-300",
  };

  return (
    <AdminShell>
      <main className="container-app px-6 py-8">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/certificates"
              className="mb-2 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#920090] hover:underline"
            >
              <ArrowLeft size={14} /> Back to Certificates Registry
            </Link>
            <h1 className="text-3xl font-extrabold text-[#520051]">Certificate Template Designer</h1>
            <p className="mt-1 text-xs text-slate-500">
              Customize the official certificate layout, typography, seal branding, and signature generated when students finish courses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              <RotateCcw size={15} /> Reset Default
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-[#520051] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#920090] transition cursor-pointer active:scale-95"
            >
              <Save size={16} /> Save Template Settings
            </button>
          </div>
        </div>

        {/* Designer Main Layout (Controls Left, Live Preview Right) */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Controls Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Theme & Palette */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sliders size={18} className="text-[#920090]" />
                <h3 className="font-bold text-sm text-[#520051]">Theme & Palette</h3>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Theme Style</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    { id: "purple", label: "Deep Purple", bg: "bg-purple-900" },
                    { id: "gold", label: "Classic Gold", bg: "bg-amber-600" },
                    { id: "emerald", label: "Emerald Honor", bg: "bg-emerald-700" },
                    { id: "navy", label: "Executive Navy", bg: "bg-slate-900" },
                    { id: "slate", label: "Minimal Slate", bg: "bg-zinc-700" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTemplate({ ...template, theme: t.id as CertificateTheme })}
                      className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-xs font-semibold transition cursor-pointer ${
                        template.theme === t.id
                          ? "border-[#920090] bg-purple-50/60 font-bold text-[#520051] shadow-xs"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className={`h-4 w-4 rounded-full ${t.bg}`} />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Frame Border Style</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    { id: "double", label: "Double Line Frame" },
                    { id: "ornate", label: "Ornate Corners" },
                    { id: "modern", label: "Modern Accent" },
                    { id: "minimal", label: "Minimal Clean" },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setTemplate({ ...template, borderStyle: b.id as CertificateBorderStyle })}
                      className={`rounded-xl border p-2.5 text-xs font-semibold transition cursor-pointer ${
                        template.borderStyle === b.id
                          ? "border-[#920090] bg-purple-50/60 font-bold text-[#520051]"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Seal Badge Icon</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    { id: "shield", label: "Shield Seal" },
                    { id: "gold_medal", label: "Gold Medal" },
                    { id: "crest", label: "Academy Crest" },
                    { id: "star", label: "Star Credential" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setTemplate({ ...template, sealStyle: s.id as CertificateSealStyle })}
                      className={`rounded-xl border p-2.5 text-xs font-semibold transition cursor-pointer ${
                        template.sealStyle === s.id
                          ? "border-[#920090] bg-purple-50/60 font-bold text-[#520051]"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Certificate Content Wording */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Award size={18} className="text-[#920090]" />
                <h3 className="font-bold text-sm text-[#520051]">Text & Typography</h3>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Academy / Institution Header</label>
                <input
                  type="text"
                  value={template.institutionName}
                  onChange={(e) => setTemplate({ ...template, institutionName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#920090]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Main Certificate Title</label>
                <input
                  type="text"
                  value={template.certificateTitle}
                  onChange={(e) => setTemplate({ ...template, certificateTitle: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#920090]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Presentation Lead-In Text</label>
                <input
                  type="text"
                  value={template.presentationText}
                  onChange={(e) => setTemplate({ ...template, presentationText: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#920090]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Completion Statement</label>
                <textarea
                  rows={2}
                  value={template.completionStatement}
                  onChange={(e) => setTemplate({ ...template, completionStatement: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#920090]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Signatory Name</label>
                  <input
                    type="text"
                    value={template.signatoryName}
                    onChange={(e) => setTemplate({ ...template, signatoryName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#920090]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Signatory Title</label>
                  <input
                    type="text"
                    value={template.signatoryTitle}
                    onChange={(e) => setTemplate({ ...template, signatoryTitle: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#920090]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Live Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4 sticky top-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#920090] uppercase tracking-wider">
                <Eye size={15} /> Real-time Template Preview
              </span>
              <span className="text-[11px] font-mono text-slate-400">Updates live as you edit</span>
            </div>

            {/* Live Certificate Canvas Card */}
            <div
              className="relative overflow-hidden rounded-2xl border-8 border-[#8c7b64] bg-[#f6f3ea] p-8 sm:p-10 text-[#3b352b] shadow-xl transition-all duration-300 font-serif select-none"
              style={{
                backgroundImage: "radial-gradient(#e8e2d2 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            >
              {/* Multi-line Frame Border */}
              <div className="pointer-events-none absolute inset-2 rounded-lg border-2 border-[#5c5346]/40 p-1">
                <div className="h-full w-full rounded-md border border-[#8c7b64]/30" />
              </div>

              {/* Ornate Corner Accents */}
              <div className="absolute top-3 left-3 text-[#6b5f4f] text-xl font-serif select-none">❦</div>
              <div className="absolute top-3 right-3 text-[#6b5f4f] text-xl font-serif select-none">❦</div>
              <div className="absolute bottom-3 left-3 text-[#6b5f4f] text-xl font-serif select-none">❦</div>
              <div className="absolute bottom-3 right-3 text-[#6b5f4f] text-xl font-serif select-none">❦</div>

              {/* Certificate Header */}
              <div className="text-center space-y-1">
                <p className="text-xs font-serif text-[#5c5346] tracking-wider uppercase font-semibold">
                  {template.institutionName || "UNIGAP Learn"}
                </p>

                {/* Scrollwork Divider Line 1 */}
                <div className="flex items-center justify-center gap-3 text-[#8c7b64] text-xs my-1">
                  <span className="h-[1px] w-24 bg-[#8c7b64]" />
                  <span className="text-xs">❦</span>
                  <span className="h-[1px] w-24 bg-[#8c7b64]" />
                </div>

                <h1 className="font-serif text-2xl sm:text-4xl font-black tracking-[0.2em] text-[#2c261e] uppercase py-0.5">
                  {template.certificateTitle || "CERTIFICATE"}
                </h1>

                {/* Scrollwork Divider Line 2 */}
                <div className="flex items-center justify-center gap-3 text-[#8c7b64] text-xs my-1">
                  <span className="h-[1px] w-24 bg-[#8c7b64]" />
                  <span className="text-xs">❦</span>
                  <span className="h-[1px] w-24 bg-[#8c7b64]" />
                </div>

                <p className="font-serif text-[11px] font-bold tracking-[0.3em] uppercase text-[#6b5f4f] pt-0.5">
                  {template.subTitle || "OF AUTHENTICITY"}
                </p>
              </div>

              {/* Recipient Details */}
              <div className="mt-6 text-center space-y-3">
                <p className="text-[11px] font-serif font-bold uppercase tracking-[0.18em] text-[#6b5f4f]">
                  {template.presentationText || "THIS CERTIFICATE IS PROUDLY PRESENTED TO"}
                </p>

                {/* ENROLLED STUDENT NAME ON BASELINE UNDERLINE */}
                <div className="relative inline-block min-w-[240px] sm:min-w-[320px] border-b-2 border-[#5c5346] pb-1 px-6">
                  <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#1e1914]">
                    {previewRecipient}
                  </h2>
                </div>

                {/* Completion Statement Paragraph */}
                <div className="mx-auto max-w-sm text-[11px] leading-relaxed text-[#5c5346] font-serif space-y-1">
                  <p>
                    {template.completionStatement ||
                      "for successfully completing all curriculum modules, practical assessments, and academic evaluations for the course:"}
                  </p>
                  <p className="text-xs font-bold text-[#2a251e] italic font-serif">
                    &quot;{previewCourse}&quot;
                  </p>
                </div>
              </div>

              {/* Certificate Footer Meta */}
              <div className="mt-8 grid grid-cols-3 items-end text-center font-serif text-[11px]">
                {/* Left Date Line */}
                <div className="space-y-1 text-center">
                  <div className="mx-auto w-28 sm:w-36 border-b border-[#5c5346] pb-0.5 font-bold text-[11px] text-[#2a251e]">
                    {previewDate}
                  </div>
                  <p className="text-[10px] font-bold text-[#6b5f4f] uppercase tracking-wider">Date</p>
                </div>

                {/* Center Ribboned Rosette Seal */}
                <div className="flex flex-col items-center relative -bottom-1">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#a39478] via-[#8c7b64] to-[#5c5346] text-[#fffdfa] shadow-md border-2 border-[#f6f3ea] ring-3 ring-[#8c7b64]/30">
                    <div className="absolute inset-1 rounded-full border border-dashed border-[#f6f3ea]/60" />
                    <Medal size={24} className="text-amber-100" />
                    {/* Ribbon Tails */}
                    <div className="absolute -bottom-2.5 left-2.5 w-2.5 h-4 bg-[#5c5346] rotate-12 -z-10 rounded-b-sm" />
                    <div className="absolute -bottom-2.5 right-2.5 w-2.5 h-4 bg-[#5c5346] -rotate-12 -z-10 rounded-b-sm" />
                  </div>
                  <span className="mt-2 text-[8px] font-bold text-[#6b5f4f] uppercase tracking-widest font-mono">
                    {previewHash}
                  </span>
                </div>

                {/* Right Signature Line */}
                <div className="space-y-1 text-center">
                  <div className="mx-auto w-28 sm:w-36 border-b border-[#5c5346] pb-0.5 font-serif italic text-xs text-[#2a251e] font-bold">
                    {template.signatoryName || "Dr. Alexander Reed"}
                  </div>
                  <p className="text-[10px] font-bold text-[#6b5f4f] uppercase tracking-wider">Signature</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-4 text-white shadow-2xl border border-purple-500/40 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
          <div className="text-xs font-medium">
            <p className="font-bold text-white">{toastMessage}</p>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
