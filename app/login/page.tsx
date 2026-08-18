"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setAuthenticatedUser } from "@/lib/services/auth.service";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;

    setAuthenticatedUser(email);
    router.push(redirectUrl);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7fb] px-5 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[#920090]/10 bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-2xl font-extrabold text-[#520051] tracking-tight"
          >
            UNIGAP
          </Link>

          <h1 className="mt-6 text-2xl font-bold text-[#520051]">
            Welcome Back
          </h1>

          <p className="mt-2 text-xs text-slate-500">
            Log in to access your enrolled courses and continue learning.
          </p>

          {redirectUrl !== "/dashboard" && (
            <div className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-purple-50 p-2.5 text-xs font-bold text-[#920090] border border-purple-100">
              <Lock size={14} /> Log in required to complete course enrollment
            </div>
          )}
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-xs font-bold text-[#520051]"
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none transition focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-xs font-bold text-[#520051]"
            >
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
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs outline-none transition focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10"
            />
          </div>

          {/* Login */}
          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#520051] px-5 py-3.5 text-xs font-bold text-white transition hover:bg-[#920090] shadow-xs"
          >
            Log In & Continue <ArrowRight size={16} />
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 space-y-3 text-center text-xs">
          <p className="text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href={`/register${redirectUrl !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
              className="font-bold text-[#920090] hover:underline"
            >
              Create Account
            </Link>
          </p>

          <div className="my-4 border-t border-slate-100" />

          <p>
            <Link
              href="/admin/login"
              className="font-bold text-[#520051] hover:text-[#920090]"
            >
              Log in as Admin
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}