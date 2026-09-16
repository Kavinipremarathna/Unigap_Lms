"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg text-ink flex items-center justify-center p-6 transition-colors">
      <div className="max-w-md w-full text-center space-y-6 rounded-3xl border border-border/80 bg-surface/90 p-8 backdrop-blur-xl shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <AlertCircle size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="font-sans text-2xl font-bold tracking-tight text-ink">
            Dashboard Module Error
          </h2>
          <p className="text-xs text-ink-muted leading-relaxed">
            An issue occurred while rendering your learner dashboard. You can reload the dashboard or return home.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={() => reset()}
            variant="primary"
            className="flex-1 rounded-xl gap-2 shadow-md"
          >
            <RefreshCw size={16} /> Retry
          </Button>
          <Link href="/dashboard" className="flex-1">
            <Button variant="secondary" className="w-full rounded-xl gap-2">
              <LayoutDashboard size={16} /> Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
