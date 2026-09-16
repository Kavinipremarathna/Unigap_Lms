"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Route Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg text-ink flex items-center justify-center p-6 transition-colors">
      <div className="max-w-md w-full text-center space-y-6 rounded-3xl border border-border/80 bg-surface/90 p-8 backdrop-blur-xl shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20">
          <ShieldAlert size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="font-sans text-2xl font-bold tracking-tight text-ink">
            Admin Module Error
          </h2>
          <p className="text-xs text-ink-muted leading-relaxed">
            An unexpected error occurred in the Admin Portal.
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
          <Link href="/admin" className="flex-1">
            <Button variant="secondary" className="w-full rounded-xl gap-2">
              <AlertTriangle size={16} /> Admin Overview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
