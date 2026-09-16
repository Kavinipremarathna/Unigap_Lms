"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerWithNestJS } from "@/lib/services/auth.service";
import { Logo } from "@/components/layout/logo";
import {
  ArrowRight,
  Check,
  Sparkles,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("/dashboard");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const target = params.get("redirect");
      if (target) {
        setRedirectUrl(target);
      }
    }
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) return;

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please check and try again.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      await registerWithNestJS(fullName, email, password);
      if (redirectUrl && redirectUrl !== "/dashboard") {
        window.location.href = redirectUrl;
        return;
      }
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg text-ink px-4 py-8 md:py-12 transition-colors relative overflow-hidden flex items-center justify-center">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#920090]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid w-full overflow-hidden rounded-3xl border border-border/80 bg-surface/90 shadow-2xl backdrop-blur-xl md:grid-cols-12">

          {/* LEFT SIDE */}
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-surface-2 via-surface-2 to-primary/5 p-10 md:col-span-5 md:flex md:flex-col md:justify-between border-r border-border/60">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <Link href="/" aria-label="UNIGAP home" className="inline-block transition-transform hover:scale-105">
                <Logo />
              </Link>

              <div className="mt-12">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary backdrop-blur-md">
                  <Sparkles size={14} className="text-primary animate-pulse" />
                  <span>Start your journey today</span>
                </div>

                <h1 className="font-sans text-3xl font-extrabold leading-tight tracking-tight text-ink">
                  Build skills.
                  <br />
                  Build momentum.
                  <br />
                  <span className="gradient-text-primary">Go further.</span>
                </h1>

                <p className="mt-4 leading-relaxed text-xs text-ink-muted">
                  Join UNIGAP Learn and turn your learning goals into daily progress with curated courses, XP rewards, streaks, and certificates.
                </p>
              </div>
            </div>

            {/* BENEFITS */}
            <div className="relative z-10 mt-10 space-y-3 font-sans text-xs font-medium text-ink-muted">
              {[
                "Structured learning tracks & free courses",
                "Daily streak tracking & XP rewards",
                "Recognized skill certificates upon completion",
                "Full access to interactive quizzes & community",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 shrink-0">
                    <Check size={13} strokeWidth={2.5} />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="relative z-10 mt-10 pt-6 border-t border-border/50 text-[11px] text-ink-muted">
              Joined by 10,000+ ambitious learners nationwide.
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-8 sm:p-12 md:col-span-7 bg-surface/80">
            <div className="mx-auto max-w-md">

              <div className="mb-6">
                <div className="inline-block md:hidden mb-4">
                  <Logo />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  UNIGAP Learn Enrollment
                </p>
                <h2 className="mt-1 font-sans text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                  Create Student Account
                </h2>
                <p className="mt-1.5 text-xs text-ink-muted leading-relaxed">
                  Register below to enroll in courses and set your official student name for completion certificates.
                </p>

                {redirectUrl !== "/dashboard" && (
                  <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-amber-500/15 p-3.5 text-xs font-mono font-bold text-amber-800 dark:text-amber-200 border border-amber-500/30">
                    <Sparkles size={16} className="shrink-0 text-amber-600" />
                    <span>Login / Register required to enroll in course</span>
                  </div>
                )}
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-6 flex items-center gap-2.5 rounded-2xl bg-red-500/10 p-4 text-xs font-medium text-red-600 dark:text-red-400 border border-red-500/30 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">

                {/* FULL NAME FOR CERTIFICATE */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="fullName" className="block text-xs font-bold text-ink">
                      Full Legal Name <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] font-mono font-semibold text-[#920090] dark:text-[#f14df0]">
                      Printed on Certificates 🎓
                    </span>
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Johnathan Alex Smith"
                    required
                    disabled={isLoading}
                    className="w-full rounded-xl border border-border bg-surface-2/60 px-4 py-3 text-xs text-ink placeholder:text-ink-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  />
                  <p className="mt-1 text-[11px] text-ink-muted">
                    This exact name will be automatically printed on your official Certificate of Completion upon finishing courses.
                  </p>
                </div>

                {/* EMAIL */}
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-ink/80">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                    className="w-full rounded-xl border border-border bg-surface-2/60 px-4 py-3 text-xs text-ink placeholder:text-ink-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  />
                </div>

                {/* PASSWORD */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-ink/80">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      disabled={isLoading}
                      className="w-full rounded-xl border border-border bg-surface-2/60 px-4 py-3 text-xs text-ink placeholder:text-ink-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-medium text-ink/80">
                      Confirm password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      disabled={isLoading}
                      className="w-full rounded-xl border border-border bg-surface-2/60 px-4 py-3 text-xs text-ink placeholder:text-ink-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* TERMS */}
                <label className="flex cursor-pointer items-start gap-3 py-1">
                  <input
                    type="checkbox"
                    required
                    disabled={isLoading}
                    className="mt-0.5 h-4 w-4 rounded border-border bg-surface-2 accent-primary"
                  />
                  <span className="text-xs leading-5 text-ink-muted">
                    I agree to the UNIGAP Learn{" "}
                    <span className="font-semibold text-primary hover:underline">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-primary hover:underline">
                      Privacy Policy
                    </span>
                    .
                  </span>
                </label>

                {/* REGISTER BUTTON */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-[#920090] to-primary px-5 py-3.5 text-xs font-bold text-primary-fg shadow-lg shadow-primary/20 transition-all hover:opacity-95 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.99] disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Creating Account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>

              </form>

              {/* LOGIN LINK */}
              <p className="mt-6 text-center text-xs text-ink-muted">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}