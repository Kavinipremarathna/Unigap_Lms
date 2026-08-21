"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerWithNestJS } from "@/lib/services/auth.service";
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
    <main className="min-h-screen bg-[#faf7fb] px-5 py-10">
      <div className="mx-auto flex min-h-[90vh] max-w-6xl items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-[32px] border border-[#920090]/10 bg-white shadow-[0_30px_80px_-30px_rgba(82,0,81,0.25)] md:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="relative hidden overflow-hidden bg-[#520051] p-12 text-white md:flex md:flex-col md:justify-between">

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D400D1]/30 blur-[80px]" />

            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#920090]/40 blur-[80px]" />

            <div className="relative">

              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-bold"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[#D400D1]" />
                UNIGAP
              </Link>

              <div className="mt-20">

                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5">
                  <Sparkles
                    size={14}
                    className="text-[#D400D1]"
                  />

                  <span className="text-xs font-semibold">
                    Start your journey
                  </span>
                </div>

                <h1 className="max-w-md text-4xl font-bold leading-tight">
                  Build skills.
                  <br />
                  Build momentum.
                  <br />
                  Go further.
                </h1>

                <p className="mt-5 max-w-md leading-7 text-white/60">
                  Join UNIGAP and turn your learning goals into
                  daily progress with courses, XP, streaks,
                  achievements, and an AI companion.
                </p>

              </div>

            </div>

            {/* BENEFITS */}

            <div className="relative mt-12 space-y-3">

              {[
                "Structured courses",
                "Daily learning motivation",
                "XP, streaks & achievements",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-white/70"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D400D1]/15">
                    <Check
                      size={13}
                      className="text-[#D400D1]"
                    />
                  </span>

                  {item}
                </div>
              ))}

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="p-8 sm:p-12">

            <div className="mx-auto max-w-md">

              <div className="mb-8">

                <p className="text-sm font-semibold text-[#920090]">
                  UNIGAP LMS
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#520051]">
                  Create your account
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Start your learning journey today.
                </p>

              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-xs font-medium text-red-600 border border-red-100">
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
                    className="mb-2 block text-sm font-semibold text-[#520051]"
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
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10 disabled:bg-slate-50"
                  />

                </div>

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-[#520051]"
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
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10 disabled:bg-slate-50"
                  />

                </div>

                {/* PASSWORD */}

                <div>

                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-[#520051]"
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
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10 disabled:bg-slate-50"
                  />

                </div>

                {/* CONFIRM PASSWORD */}

                <div>

                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-[#520051]"
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
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10 disabled:bg-slate-50"
                  />

                </div>

                {/* TERMS */}

                <label className="flex cursor-pointer items-start gap-3 py-2">

                  <input
                    type="checkbox"
                    required
                    disabled={isLoading}
                    className="mt-1 h-4 w-4 rounded border-slate-300 accent-[#920090]"
                  />

                  <span className="text-xs leading-5 text-slate-500">
                    I agree to the UNIGAP{" "}
                    <span className="font-semibold text-[#920090]">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-[#920090]">
                      Privacy Policy
                    </span>
                    .
                  </span>

                </label>

                {/* REGISTER BUTTON */}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#520051] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#920090] disabled:opacity-70"
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

              <p className="mt-8 text-center text-sm text-slate-500">

                Already have an account?

                <Link
                  href="/login"
                  className="ml-1 font-semibold text-[#920090] hover:text-[#D400D1]"
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