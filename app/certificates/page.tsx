import { Award, Download, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const certificates = [
  { id: "cert-1", course: "Python Programming", date: "Jun 14, 2026", certId: "UNIGAP-2026-03127" },
];

export default function CertificatesPage() {
  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-bold text-ink">Certificates</h1>
      <p className="mt-1 text-sm text-ink-muted">Verified proof of what you&apos;ve completed.</p>

      {certificates.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((c) => (
            <Card key={c.id} className="overflow-hidden">
              <div className="flex h-28 items-center justify-center bg-gradient-to-br from-primary to-accent">
                <Award size={32} className="text-white" />
              </div>
              <CardContent>
                <p className="font-semibold text-ink">{c.course}</p>
                <p className="mt-1 text-xs text-ink-muted">Completed {c.date}</p>
                <p className="text-xs text-ink-muted">ID: {c.certId}</p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="secondary" className="flex-1"><Eye size={14} /> View</Button>
                  <Button size="sm" className="flex-1"><Download size={14} /> Download</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center text-center">
          <Award size={40} className="text-ink-muted" />
          <h3 className="mt-4 text-lg font-semibold text-ink">No certificates yet</h3>
          <p className="mt-1 max-w-sm text-sm text-ink-muted">Finish a course to earn your first certificate.</p>
        </div>
      )}
    </div>
  );
}
