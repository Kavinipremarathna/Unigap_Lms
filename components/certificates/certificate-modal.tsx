"use client";

import { useState } from "react";
import {
  Award,
  ShieldCheck,
  Printer,
  Download,
  Copy,
  Check,
  X,
  GraduationCap,
  Medal,
  Star,
} from "lucide-react";
import {
  CertificateTemplateConfig,
  DEFAULT_CERTIFICATE_TEMPLATE,
  getCertificateTemplate,
} from "@/lib/services/certificate-template";

export interface CertificateData {
  id: string;
  certificateHash: string;
  recipientName: string;
  recipientEmail?: string;
  courseTitle: string;
  issueDate: string;
  grade?: string;
  instructorName?: string;
  templateConfig?: CertificateTemplateConfig;
}

interface CertificateModalProps {
  certificate: CertificateData | null;
  onClose: () => void;
}

export function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!certificate) return null;

  const tConfig: CertificateTemplateConfig =
    certificate.templateConfig || getCertificateTemplate();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const el = document.getElementById("certificate-print-area");
    if (!el) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#faf7fb",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const renderWidth = imgWidth * ratio;
      const renderHeight = imgHeight * ratio;
      const x = (pdfWidth - renderWidth) / 2;
      const y = (pdfHeight - renderHeight) / 2;

      pdf.addImage(imgData, "PNG", x, y, renderWidth, renderHeight);
      pdf.save(`Certificate-${certificate.certificateHash || "unigap"}.pdf`);
    } catch (err) {
      console.error("PDF generation error, fallback to print:", err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(certificate.certificateHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const themeStyles = {
    parchment: {
      outerBorder: "border-[#6b5f4f]",
      cornerBorder: "border-[#8c7b64]",
      bg: "bg-[#f7f4eb]",
      accentText: "text-[#5c5346]",
      headerText: "text-[#3b352b]",
      badgeBg: "bg-[#5c5346]",
      sealBg: "bg-[#8c7b64] text-[#fffdfa] border-[#5c5346]",
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
  }[tConfig.theme || "parchment"] || {
    outerBorder: "border-[#6b5f4f]",
    cornerBorder: "border-[#8c7b64]",
    bg: "bg-[#f7f4eb]",
    accentText: "text-[#5c5346]",
    headerText: "text-[#3b352b]",
    badgeBg: "bg-[#5c5346]",
    sealBg: "bg-[#8c7b64] text-[#fffdfa] border-[#5c5346]",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white p-2 shadow-2xl my-auto">
        {/* Action Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#520051] text-white">
              <Award size={20} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#520051]">Official Digital Certificate</h3>
              <p className="text-xs text-slate-500">Verified by UNIGAP Learn Credential Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyHash}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              {copied ? "Copied ID" : `Copy ID: ${certificate.certificateHash}`}
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#520051] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#920090] transition cursor-pointer disabled:opacity-50"
            >
              <Download size={15} /> {downloading ? "Generating PDF..." : "Download PDF"}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <Printer size={15} /> Print
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-red-500 hover:text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame Canvas */}
        <div
          id="certificate-print-area"
          className="relative m-2 overflow-hidden rounded-xl border-[10px] border-[#8c7b64] bg-[#f6f3ea] p-8 text-[#3b352b] shadow-inner sm:p-12 print:m-0 print:border-[10px] print:p-8 font-serif select-none"
          style={{
            backgroundImage: "radial-gradient(#e8e2d2 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {/* Multi-line Guilloche Frame Border */}
          <div className="pointer-events-none absolute inset-2 rounded-lg border-2 border-[#5c5346]/40 p-1">
            <div className="h-full w-full rounded-md border border-[#8c7b64]/30" />
          </div>

          {/* Ornate Filigree Corner Accents */}
          <div className="absolute top-4 left-4 text-[#6b5f4f] text-2xl font-serif leading-none select-none">
            ❦
          </div>
          <div className="absolute top-4 right-4 text-[#6b5f4f] text-2xl font-serif leading-none select-none">
            ❦
          </div>
          <div className="absolute bottom-4 left-4 text-[#6b5f4f] text-2xl font-serif leading-none select-none">
            ❦
          </div>
          <div className="absolute bottom-4 right-4 text-[#6b5f4f] text-2xl font-serif leading-none select-none">
            ❦
          </div>

          {/* Certificate Header */}
          <div className="text-center space-y-1 mt-2">
            <p className="text-sm font-serif text-[#5c5346] tracking-wider uppercase font-semibold">
              {tConfig.institutionName || "UNIGAP Learn"}
            </p>

            {/* Scrollwork Divider Line 1 */}
            <div className="flex items-center justify-center gap-3 text-[#8c7b64] text-xs my-1">
              <span className="h-[1px] w-32 bg-[#8c7b64]" />
              <span className="text-sm">❦</span>
              <span className="h-[1px] w-32 bg-[#8c7b64]" />
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-[0.2em] text-[#2c261e] uppercase py-1">
              {tConfig.certificateTitle || "CERTIFICATE"}
            </h1>

            {/* Scrollwork Divider Line 2 */}
            <div className="flex items-center justify-center gap-3 text-[#8c7b64] text-xs my-1">
              <span className="h-[1px] w-32 bg-[#8c7b64]" />
              <span className="text-sm">❦</span>
              <span className="h-[1px] w-32 bg-[#8c7b64]" />
            </div>

            <p className="font-serif text-xs sm:text-sm font-bold tracking-[0.35em] uppercase text-[#6b5f4f] pt-1">
              {tConfig.subTitle || "OF AUTHENTICITY"}
            </p>
          </div>

          {/* Recipient Details */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-xs font-serif font-bold uppercase tracking-[0.2em] text-[#6b5f4f]">
              {tConfig.presentationText || "THIS CERTIFICATE IS PROUDLY PRESENTED TO"}
            </p>

            {/* ENROLLED STUDENT NAME ON BASELINE UNDERLINE */}
            <div className="relative inline-block min-w-[280px] sm:min-w-[380px] border-b-2 border-[#5c5346] pb-1 px-8">
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#1e1914] tracking-wide">
                {certificate.recipientName}
              </h2>
            </div>

            {/* Completion Statement Paragraph */}
            <div className="mx-auto max-w-lg text-xs leading-relaxed text-[#5c5346] font-serif space-y-1">
              <p>
                {tConfig.completionStatement ||
                  "for successfully completing all curriculum modules, practical assessments, and academic evaluations for the course:"}
              </p>
              <p className="text-sm font-bold text-[#2a251e] pt-1 italic font-serif">
                &quot;{certificate.courseTitle}&quot;
              </p>
              {certificate.grade && (
                <p className="text-[11px] font-bold text-amber-900 bg-amber-100/80 inline-block px-3 py-0.5 rounded-full border border-amber-300 mt-1">
                  Grade Distinction: {certificate.grade}
                </p>
              )}
            </div>
          </div>

          {/* Certificate Footer Meta: Left Date Line | Central Rosette Ribbon Seal | Right Signature Line */}
          <div className="mt-12 grid grid-cols-3 items-end pt-2 text-center font-serif text-xs">
            {/* Left Date Line */}
            <div className="space-y-1 text-center">
              <div className="mx-auto w-36 sm:w-44 border-b border-[#5c5346] pb-1 font-bold text-xs text-[#2a251e]">
                {certificate.issueDate}
              </div>
              <p className="text-[11px] font-bold text-[#6b5f4f] uppercase tracking-wider">Date</p>
            </div>

            {/* Center Ribboned Rosette Seal */}
            <div className="flex flex-col items-center relative -bottom-2">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#a39478] via-[#8c7b64] to-[#5c5346] text-[#fffdfa] shadow-lg border-2 border-[#f6f3ea] ring-4 ring-[#8c7b64]/30">
                <div className="absolute inset-1 rounded-full border border-dashed border-[#f6f3ea]/60" />
                <Medal size={28} className="text-amber-100" />
                {/* Ribbon Tails */}
                <div className="absolute -bottom-3 left-3 w-3 h-5 bg-[#5c5346] rotate-12 -z-10 rounded-b-sm" />
                <div className="absolute -bottom-3 right-3 w-3 h-5 bg-[#5c5346] -rotate-12 -z-10 rounded-b-sm" />
              </div>
              <span className="mt-3 text-[9px] font-bold text-[#6b5f4f] uppercase tracking-widest font-mono">
                {certificate.certificateHash}
              </span>
            </div>

            {/* Right Signature Line */}
            <div className="space-y-1 text-center">
              <div className="mx-auto w-36 sm:w-44 border-b border-[#5c5346] pb-1 font-serif italic text-sm text-[#2a251e] font-bold">
                {tConfig.signatoryName || certificate.instructorName || "Dr. Alexander Reed"}
              </div>
              <p className="text-[11px] font-bold text-[#6b5f4f] uppercase tracking-wider">Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

