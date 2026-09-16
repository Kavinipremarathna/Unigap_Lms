"use client";

import { useEffect } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full text-center space-y-6 rounded-3xl border border-slate-800 bg-slate-950 p-8 shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <AlertOctagon size={32} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Critical Application Error</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              A root error occurred. Click below to re-initialize the application.
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-purple-700 shadow-lg"
          >
            <RefreshCw size={16} /> Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
