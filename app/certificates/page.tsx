"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Award, Download, Eye, ShieldCheck, ArrowRight, UserCheck, Info, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubpageHeroHeader } from "@/components/ui/subpage-hero-header";
import { CertificateModal, CertificateData } from "@/components/certificates/certificate-modal";

const NESTJS_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function CertificatesPage() {
  const [isAdminRole, setIsAdminRole] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedRole = localStorage.getItem("unigap_admin_role");
      const authUserStr = localStorage.getItem("unigap_auth_user");
      let roleStr = savedRole;
      if (authUserStr) {
        const authUser = JSON.parse(authUserStr);
        if (authUser?.role) roleStr = authUser.role;
      }
      const isAdm =
        (roleStr || "").toLowerCase().includes("admin") ||
        (roleStr || "").toLowerCase().includes("super");
      setIsAdminRole(isAdm);
    } catch {
      // fallback
    }

    async function fetchCertificates() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("unigap_auth_token") || "";
        const res = await fetch(`${NESTJS_API_URL}/certificates/my`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data: CertificateData[] = await res.json();
        setCertificates(data);
      } catch (err: any) {
        setError("Could not load certificates. Please try again later.");
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCertificates();
  }, []);

  return (
    <div className="container-app py-8">
      <SubpageHeroHeader
        icon={Award}
        badgeText="Student Credentials"
        title="Student Certificates"
        description="Verified certificates of course completion earned by enrolled students."
        rightContent={
          <div className="rounded-[4px] border border-border bg-surface p-3.5 min-w-[140px] text-center">
            <span className="font-mono text-xs text-ink-muted uppercase">Student Earned</span>
            <p className="mt-1 font-mono text-2xl font-bold text-primary">{certificates.length}</p>
          </div>
        }
      />

      {/* Admin Notice Banner */}
      {isAdminRole && (
        <div className="mt-6 rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 via-white to-purple-50 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#520051] text-white">
                <ShieldCheck size={20} />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#920090] uppercase tracking-wider">
                  <Info size={12} /> Administrator Role Notice
                </span>
                <h3 className="font-bold text-base text-[#520051]">
                  Certificates are issued exclusively to enrolled Students
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Super Admin and Admin accounts oversee platform operations. To manage, issue, or verify student course certificates, use the central Admin Registry.
                </p>
              </div>
            </div>

            <Link
              href="/admin/certificates"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#520051] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#920090] transition"
            >
              <UserCheck size={16} /> Open Admin Certificate Registry <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="mt-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#520051]">
            {isAdminRole ? "Enrolled Student Certificates" : "My Earned Course Certificates"}
          </h2>
          <p className="text-xs text-slate-500">
            {isAdminRole
              ? "Official completion certificates issued to enrolled students."
              : "Official credentials issued under your student account name."}
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="mt-12 flex flex-col items-center gap-3 text-slate-400">
          <Loader2 size={32} className="animate-spin" />
          <p className="text-sm">Loading your certificates…</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && certificates.length === 0 && (
        <div className="mt-12 flex flex-col items-center gap-3 text-slate-400">
          <Award size={40} className="opacity-30" />
          <p className="text-sm font-medium">No certificates earned yet.</p>
          <p className="text-xs">Complete a course to receive your first certificate.</p>
        </div>
      )}

      {/* Certificate grid */}
      {!loading && !error && certificates.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((c) => (
            <Card key={c.id} className="overflow-hidden border border-border transition hover:shadow-lg">
              <div className="flex h-28 items-center justify-center bg-gradient-to-br from-[#520051] to-[#920090] text-white">
                <Award size={36} />
              </div>
              <CardContent className="p-5">
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-[#920090]">
                  Student Credential
                </span>
                <h3 className="mt-2 font-bold text-[#520051] line-clamp-1">{c.courseTitle}</h3>
                <p className="mt-1 text-xs text-slate-600">
                  Student Name: <strong className="text-slate-900 font-bold">{c.recipientName}</strong>
                </p>
                <p className="text-[11px] text-slate-400">Completed {c.issueDate}</p>
                <p className="font-mono text-[10px] text-[#920090] mt-0.5">ID: {c.certificateHash}</p>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedCert(c)}
                    className="flex-1 gap-1 text-xs cursor-pointer"
                  >
                    <Eye size={14} /> View Cert
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setSelectedCert(c)}
                    className="flex-1 gap-1 text-xs cursor-pointer"
                  >
                    <Download size={14} /> Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}
