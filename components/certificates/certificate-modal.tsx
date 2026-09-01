"use client";

import { useState } from "react";
import { Award, ShieldCheck, Printer, Download, Copy, Check, X, GraduationCap } from "lucide-react";

export interface CertificateData {
  id: string;
  certificateHash: string;
  recipientName: string;
  recipientEmail?: string;
  courseTitle: string;
  issueDate: string;
  grade?: string;
  instructorName?: string;
}

interface CertificateModalProps {
  certificate: CertificateData | null;
  onClose: () => void;
}

export function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!certificate) return null;

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
              <p className="text-xs text-slate-500">Verified by UNIGAP LMS Credential Engine</p>
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
          className="relative m-2 overflow-hidden rounded-2xl border-8 border-[#520051] bg-[#faf7fb] p-8 text-slate-900 shadow-inner sm:p-12 print:m-0 print:border-8 print:p-8"
        >
          {/* Decorative Corner Borders */}
          <div className="absolute top-3 left-3 h-12 w-12 border-t-4 border-l-4 border-[#920090]" />
          <div className="absolute top-3 right-3 h-12 w-12 border-t-4 border-r-4 border-[#920090]" />
          <div className="absolute bottom-3 left-3 h-12 w-12 border-b-4 border-l-4 border-[#920090]" />
          <div className="absolute bottom-3 right-3 h-12 w-12 border-b-4 border-r-4 border-[#920090]" />

          {/* Certificate Header */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#520051] to-[#920090] text-white shadow-md">
              <GraduationCap size={36} />
            </div>

            <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.25em] text-[#920090]">
              UNIGAP ACADEMY OF ADVANCED LEARNING
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#520051] sm:text-4xl">
              Certificate of Completion
            </h1>
            <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-gradient-to-r from-[#520051] via-[#920090] to-[#520051]" />
          </div>

          {/* Recipient Details */}
          <div className="mt-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              THIS IS PROUDLY PRESENTED TO
            </p>

            {/* ENROLLED STUDENT NAME */}
            <h2 className="mt-3 text-3xl font-black text-[#520051] sm:text-4xl underline decoration-[#920090]/40 underline-offset-8">
              {certificate.recipientName}
            </h2>

            <p className="mt-6 mx-auto max-w-xl text-xs leading-relaxed text-slate-600 sm:text-sm">
              for successfully completing all curriculum modules, practical assessments, and academic evaluations for the course:
            </p>

            {/* COURSE TITLE */}
            <div className="mt-4 inline-block rounded-2xl bg-[#520051] px-6 py-3 text-white shadow-md">
              <h3 className="text-lg font-bold sm:text-xl">{certificate.courseTitle}</h3>
            </div>
          </div>

          {/* Certificate Footer Meta */}
          <div className="mt-10 grid grid-cols-3 items-end border-t border-[#e8dce8] pt-6 text-center text-xs">
            {/* Verification Seal */}
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 shadow-sm border border-amber-300">
                <ShieldCheck size={26} />
              </div>
              <span className="mt-1 text-[11px] font-bold text-[#520051]">UNIGAP Verified Credential</span>
              <span className="font-mono text-[10px] text-slate-500">{certificate.certificateHash}</span>
            </div>

            {/* Issued Date & Score */}
            <div className="space-y-1">
              <p className="text-[11px] text-slate-500 uppercase tracking-wider">Date Issued</p>
              <p className="font-bold text-sm text-[#520051]">{certificate.issueDate}</p>
              {certificate.grade && (
                <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                  Grade: {certificate.grade}
                </span>
              )}
            </div>

            {/* Instructor / Academic Signature */}
            <div className="space-y-1 text-right sm:text-center">
              <div className="mx-auto h-8 w-32 border-b-2 border-slate-400 font-serif italic text-slate-700 text-sm flex items-end justify-center">
                {certificate.instructorName || "Academic Director"}
              </div>
              <p className="text-[11px] font-bold text-[#520051]">Authorized Signature</p>
              <p className="text-[10px] text-slate-400">UNIGAP Academic Council</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
