"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg text-ink flex items-center justify-center p-6 transition-colors relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6 rounded-3xl border border-border/80 bg-surface/90 p-8 backdrop-blur-xl shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500">
          <AlertTriangle size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="font-sans text-2xl font-bold tracking-tight text-ink">
            Something went wrong!
          </h1>
          <p className="text-xs text-ink-muted leading-relaxed">
            An unexpected error occurred while loading this page. You can try refreshing or returning to the homepage.
          </p>
        </div>

        {error.digest && (
          <p className="text-[11px] font-mono text-ink-muted/70 bg-surface-2 p-2 rounded-lg border border-border/60 overflow-hidden text-ellipsis">
            Error Digest: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={() => reset()}
            variant="primary"
            className="flex-1 rounded-xl gap-2 shadow-md"
          >
            <RefreshCw size={16} /> Try Again
          </Button>
          <Link href="/" className="flex-1">
            <Button variant="secondary" className="w-full rounded-xl gap-2">
              <Home size={16} /> Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
