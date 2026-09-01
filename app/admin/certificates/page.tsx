"use client";

import { useState, useEffect } from "react";
import {
  Award,
  Search,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ShieldCheck,
  X,
  FileCheck,
  Eye,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getStoredCertificates, IssuedCertificate } from "@/lib/mock/admin";
import { CertificateModal, CertificateData } from "@/components/certificates/certificate-modal";

const defaultMockCertificates: IssuedCertificate[] = [
  {
    id: "cert-101",
    certificateHash: "UNI-CERT-2026-8819A",
    recipientName: "Kavini Gavesha",
    recipientEmail: "kkgpremarathna@gmail.com",
    courseTitle: "JavaScript & TypeScript Mastery 2026",
    issueDate: "August 28, 2026",
    grade: "Distinction (98%)",
    status: "valid",
  },
  {
    id: "cert-102",
    certificateHash: "UNI-CERT-2026-9921B",
    recipientName: "Alex Rivera",
    recipientEmail: "alex.rivera@unigap.edu",
    courseTitle: "Fullstack Next.js & React Masterclass",
    issueDate: "August 20, 2026",
    grade: "Pass (92%)",
    status: "valid",
  },
  {
    id: "cert-103",
    certificateHash: "UNI-CERT-2026-4410C",
    recipientName: "Sarah Chen",
    recipientEmail: "sarah.chen@unigap.edu",
    courseTitle: "Python Data Science & Machine Learning",
    issueDate: "August 15, 2026",
    grade: "Distinction (99%)",
    status: "valid",
  },
];

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<IssuedCertificate[]>(defaultMockCertificates);
  const [search, setSearch] = useState("");
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyResult, setVerifyResult] = useState<IssuedCertificate | null | "not_found">(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedPreviewCert, setSelectedPreviewCert] = useState<CertificateData | null>(null);

  const [newRecipientName, setNewRecipientName] = useState("");
  const [newRecipientEmail, setNewRecipientEmail] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");

  const loadCertificates = () => {
    const stored = getStoredCertificates();
    if (stored && stored.length > 0) {
      setCertificates(stored);
    } else {
      setCertificates(defaultMockCertificates);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const filteredCertificates = certificates.filter(
    (c) =>
      c.certificateHash.toLowerCase().includes(search.toLowerCase()) ||
      c.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      c.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInput.trim()) return;
    const found = certificates.find(
      (c) => c.certificateHash.toLowerCase() === verifyInput.trim().toLowerCase()
    );
    setVerifyResult(found || "not_found");
  };

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipientName.trim() || !newCourseTitle.trim()) return;

    const created: IssuedCertificate = {
      id: `cert-${Date.now()}`,
      certificateHash: `UNI-CERT-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      recipientName: newRecipientName.trim(),
      recipientEmail: newRecipientEmail.trim() || "learner@unigap.edu",
      courseTitle: newCourseTitle.trim(),
      issueDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      grade: "Distinction",
      status: "valid",
    };

    const updated = [created, ...certificates];
    setCertificates(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("unigap_admin_certificates", JSON.stringify(updated));
      } catch {
        // ignore
      }
    }

    setNewRecipientName("");
    setNewRecipientEmail("");
    setNewCourseTitle("");
    setShowIssueModal(false);
    setSelectedPreviewCert(created);
  };

  return (
    <AdminShell>
      <main className="container-app px-6 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#920090]">Credentials Registry</p>
            <h1 className="mt-1 text-3xl font-bold text-[#520051]">Issued Certificates</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage course completion credentials with enrolled student names and course titles.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowIssueModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#520051] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#920090] cursor-pointer"
          >
            <Plus size={16} /> Issue Custom Certificate
          </button>
        </div>

        {/* Verification Checker Bar */}
        <div className="mt-8 rounded-3xl bg-gradient-to-r from-[#520051] to-[#920090] p-6 text-white shadow-md">
          <div className="flex items-center gap-3">
            <ShieldCheck size={26} className="text-amber-300" />
            <div>
              <h2 className="text-lg font-bold">Instant Certificate Authenticity Verification</h2>
              <p className="text-xs text-purple-100">Test cryptographic verification hash code.</p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="mt-4 flex max-w-xl gap-3">
            <input
              type="text"
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              placeholder="e.g. UNI-CERT-2026-8819A"
              className="flex-1 rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-xs text-white placeholder-purple-200 outline-none backdrop-blur-xs focus:bg-white/20"
            />
            <button
              type="submit"
              className="rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-[#520051] hover:bg-purple-50 cursor-pointer"
            >
              Verify Hash
            </button>
          </form>

          {verifyResult && verifyResult !== "not_found" && (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-emerald-500/20 p-3 backdrop-blur-xs border border-emerald-400/40 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
                <span>
                  VALID CERTIFICATE: Issued to <strong>{verifyResult.recipientName}</strong> for &quot;
                  {verifyResult.courseTitle}&quot; on {verifyResult.issueDate}. Grade: {verifyResult.grade}.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPreviewCert(verifyResult)}
                className="shrink-0 rounded-lg bg-white px-3 py-1 text-xs font-bold text-[#520051]"
              >
                View Certificate
              </button>
            </div>
          )}

          {verifyResult === "not_found" && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-red-500/20 p-3 backdrop-blur-xs border border-red-400/40 text-xs font-semibold">
              <AlertTriangle size={16} className="text-red-300" />
              <span>INVALID HASH: No registered certificate found with this verification hash code.</span>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mt-8 rounded-2xl border border-[#eee5ee] bg-white p-4 shadow-xs">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search certificate hash, recipient student name, or course title..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-11 pr-4 text-xs outline-none focus:border-[#920090]"
            />
          </div>
        </div>

        {/* Certificates Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#eee5ee] bg-white shadow-xs">
          {filteredCertificates.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-[#faf5fa] text-[11px] font-bold uppercase tracking-wider text-[#520051]">
                  <tr>
                    <th className="px-6 py-4">Verification Hash</th>
                    <th className="px-6 py-4">Enrolled Student Name</th>
                    <th className="px-6 py-4">Course Title</th>
                    <th className="px-6 py-4">Issue Date</th>
                    <th className="px-6 py-4">Grade</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCertificates.map((cert) => (
                    <tr
                      key={cert.id}
                      onClick={() => setSelectedPreviewCert(cert)}
                      className="hover:bg-purple-50/50 transition cursor-pointer"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-bold text-[#920090]">
                        {cert.certificateHash}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{cert.recipientName}</p>
                        <p className="text-[11px] text-slate-400">{cert.recipientEmail}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#520051]">{cert.courseTitle}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{cert.issueDate}</td>
                      <td className="px-6 py-4 font-semibold text-emerald-600">{cert.grade}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPreviewCert(cert);
                          }}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#520051] hover:bg-[#fde8fc] hover:border-[#920090]"
                        >
                          <Eye size={14} /> View Certificate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#faf5fa] text-[#520051]">
                <FileCheck size={24} />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#520051]">No Certificates Found</h3>
              <p className="mt-1 text-xs text-slate-500">
                Issue a custom certificate using the button above.
              </p>
            </div>
          )}
        </div>

        {/* Issue Custom Certificate Modal */}
        {showIssueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-[#520051]">Issue Official Certificate</h3>
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="rounded-lg p-1 text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleIssueCertificate} className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Enrolled Student Full Name</label>
                  <input
                    required
                    type="text"
                    value={newRecipientName}
                    onChange={(e) => setNewRecipientName(e.target.value)}
                    placeholder="e.g. Jordan Diaz or Kavini Gavesha"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#920090]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Student Email Address</label>
                  <input
                    type="email"
                    value={newRecipientEmail}
                    onChange={(e) => setNewRecipientEmail(e.target.value)}
                    placeholder="e.g. student@unigap.edu"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#920090]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Course Title</label>
                  <input
                    required
                    type="text"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    placeholder="e.g. JavaScript & TypeScript Mastery 2026"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#920090]"
                  />
                </div>
                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(false)}
                    className="w-1/2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 rounded-xl bg-[#520051] py-2.5 text-xs font-semibold text-white hover:bg-[#920090] cursor-pointer shadow-md"
                  >
                    Issue Certificate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Certificate Modal View */}
        <CertificateModal
          certificate={selectedPreviewCert}
          onClose={() => setSelectedPreviewCert(null)}
        />
      </main>
    </AdminShell>
  );
}
