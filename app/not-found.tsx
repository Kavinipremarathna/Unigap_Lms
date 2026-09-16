import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg text-ink flex items-center justify-center p-6 transition-colors relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-6 rounded-3xl border border-border/80 bg-surface/90 p-10 backdrop-blur-xl shadow-2xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20 text-primary">
          <Search size={36} />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">404 Error</p>
          <h1 className="font-sans text-3xl font-extrabold tracking-tight text-ink">
            Page Not Found
          </h1>
          <p className="text-xs text-ink-muted leading-relaxed">
            The page you are looking for does not exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link href="/courses" className="flex-1">
            <Button variant="primary" className="w-full rounded-xl gap-2 shadow-md">
              <Search size={16} /> Explore Courses
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="secondary" className="w-full rounded-xl gap-2">
              <Home size={16} /> Back Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
