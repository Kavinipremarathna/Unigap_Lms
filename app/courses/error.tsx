"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function CourseErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Course Route Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink transition-colors">
      <Navbar />
      <main className="container-app flex flex-1 flex-col items-center justify-center p-8 text-center my-12">
        <div className="max-w-md w-full space-y-6 rounded-3xl border border-border/80 bg-surface/90 p-8 backdrop-blur-xl shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <AlertCircle size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-ink">
              Course Unable to Load
            </h2>
            <p className="text-xs text-ink-muted leading-relaxed">
              We encountered an issue loading course details. Please try reloading or browse all available courses.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={() => reset()}
              variant="primary"
              className="flex-1 rounded-xl gap-2 shadow-md"
            >
              <RefreshCw size={16} /> Try Again
            </Button>
            <Link href="/courses" className="flex-1">
              <Button variant="secondary" className="w-full rounded-xl gap-2">
                <BookOpen size={16} /> Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
