"use client";

import { useState } from "react";
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
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg text-ink px-5 py-10 transition-colors">
      <div className="mx-auto flex min-h-[90vh] max-w-6xl items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-[4px] border border-border bg-surface shadow-2xl md:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="relative hidden overflow-hidden bg-surface-2 p-12 text-ink border-r border-border md:flex md:flex-col md:justify-between">

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/5 blur-[80px]" />

            <div className="relative">

              <Link href="/" aria-label="UNIGAP home">
                <Logo />
              </Link>

              <div className="mt-16">

                <div className="mb-5 inline-flex items-center gap-2 rounded-[4px] border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-xs font-medium text-primary">
                  <Sparkles
                    size={14}
                    className="text-primary"
                  />

                  <span>
                    Start your journey
                  </span>
                </div>

                <h1 className="max-w-md font-serif text-4xl font-medium leading-tight text-ink">
                  Build skills.
                  <br />
                  Build momentum.
                  <br />
                  <span className="text-primary">Go further.</span>
                </h1>

                <p className="mt-5 max-w-md leading-relaxed text-xs font-sans text-ink-muted">
                  Join UNIGAP and turn your learning goals into
                  daily progress with courses, XP, streaks,
                  achievements, and an AI companion.
                </p>

              </div>

            </div>

            {/* BENEFITS */}

            <div className="relative mt-12 space-y-3 font-mono text-xs text-ink-muted">

              {[
                "Structured courses",
                "Daily learning motivation",
                "XP, streaks & achievements",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 border border-accent/30 text-accent">
                    <Check
                      size={12}
                    />
                  </span>

                  {item}
                </div>
              ))}

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="p-8 sm:p-12 bg-surface">

            <div className="mx-auto max-w-md">

              <div className="mb-8">

                <p className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
                  UNIGAP LMS
                </p>

                <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-ink">
                  Create your account
                </h2>

                <p className="mt-2 text-xs font-mono text-ink-muted">
                  Start your learning journey today.
                </p>

              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-6 flex items-center gap-2 rounded-[4px] bg-red-500/10 p-3.5 text-xs font-mono text-red-600 dark:text-red-400 border border-red-500/30">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form
                onSubmit={handleRegister}
                className="space-y-4"
              >

                {/* FULL NAME */}

                <div>

                  <label
                    htmlFor="fullName"
                    className="mb-1.5 block text-xs font-mono text-ink-muted"
                  >
                    Full name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    required
                    disabled={isLoading}
                    className="w-full rounded-[4px] border border-border bg-surface-2 px-4 py-3 text-xs text-ink placeholder:text-ink-muted outline-none transition focus:border-primary disabled:opacity-50"
                  />

                </div>

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-mono text-ink-muted"
                  >
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
                    className="w-full rounded-[4px] border border-border bg-surface-2 px-4 py-3 text-xs text-ink placeholder:text-ink-muted outline-none transition focus:border-primary disabled:opacity-50"
                  />

                </div>

                {/* PASSWORD */}

                <div>

                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-xs font-mono text-ink-muted"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    minLength={6}
                    disabled={isLoading}
                    className="w-full rounded-[4px] border border-border bg-surface-2 px-4 py-3 text-xs text-ink placeholder:text-ink-muted outline-none transition focus:border-primary disabled:opacity-50"
                  />

                </div>

                {/* CONFIRM PASSWORD */}

                <div>

                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-xs font-mono text-ink-muted"
                  >
                    Confirm password
                  </label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                    disabled={isLoading}
                    className="w-full rounded-[4px] border border-border bg-surface-2 px-4 py-3 text-xs text-ink placeholder:text-ink-muted outline-none transition focus:border-primary disabled:opacity-50"
                  />

                </div>

                {/* TERMS */}

                <label className="flex cursor-pointer items-start gap-3 py-2">

                  <input
                    type="checkbox"
                    required
                    disabled={isLoading}
                    className="mt-1 h-4 w-4 rounded-[2px] border-border bg-surface-2 accent-primary"
                  />

                  <span className="text-xs leading-5 text-ink-muted font-mono">
                    I agree to the UNIGAP{" "}
                    <span className="font-semibold text-primary">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-primary">
                      Privacy Policy
                    </span>
                    .
                  </span>

                </label>

                {/* REGISTER BUTTON */}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex w-full items-center justify-center gap-2 rounded-[4px] bg-primary px-5 py-3.5 text-xs font-semibold text-primary-fg transition hover:opacity-90 disabled:opacity-70 shadow-sm"
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

              {/* LOGIN */}

              <p className="mt-8 text-center text-xs font-mono text-ink-muted">

                Already have an account?

                <Link
                  href="/login"
                  className="ml-1 font-semibold text-primary hover:underline"
                >
                  Login
                </Link>

              </p>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}