"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/logo";

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

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!email.trim() || !password) return;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Invalid email or password.");
        return;
      }

      if (data.user.role === "SUPER_ADMIN" || data.user.role === "ADMIN") {
        if (typeof window !== "undefined") {
          const normRole = (data.user.role || "").toLowerCase().includes("super") ? "super_admin" : "admin";
          localStorage.setItem("unigap_admin_role", normRole);
          localStorage.setItem("unigap_admin_profile", JSON.stringify({ ...data.user, role: normRole }));
          if (data.token) {
            localStorage.setItem("unigap_admin_token", data.token);
          }
        }
        window.location.href = "/admin";
        return;
      }

      if (redirectUrl && redirectUrl !== "/dashboard") {
        window.location.href = redirectUrl;
        return;
      }

      window.location.href = "/dashboard";


    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the server. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-surface-2/50 via-bg to-surface-2/50 text-ink px-5 py-14 transition-colors relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#520051]/15 via-[#920090]/15 to-transparent blur-3xl" />
      
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-border/80 bg-surface p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="mb-8 text-center flex flex-col items-center">
          <Link href="/" aria-label="UNIGAP home">
            <Logo />
          </Link>

          <h1 className="mt-6 font-heading text-2xl font-extrabold text-ink sm:text-3xl">
            Welcome Back
          </h1>

          <p className="mt-2 text-xs font-mono text-ink-muted">
            Log in to access your enrolled courses and continue learning.
          </p>

          {redirectUrl !== "/dashboard" && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-amber-500/15 p-3 text-xs font-mono font-bold text-amber-700 dark:text-amber-300 border border-amber-500/30">
              <Lock size={14} /> Log in required to access course details
            </div>
          )}
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-mono font-bold uppercase tracking-wider text-ink-muted"
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
              className="w-full rounded-2xl border border-border/80 bg-surface-2 px-4 py-3.5 text-xs text-ink placeholder:text-ink-muted outline-none transition focus:border-[#920090] focus:ring-2 focus:ring-[#920090]/20"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-mono font-bold uppercase tracking-wider text-ink-muted"
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
              className="w-full rounded-2xl border border-border/80 bg-surface-2 px-4 py-3.5 text-xs text-ink placeholder:text-ink-muted outline-none transition focus:border-[#920090] focus:ring-2 focus:ring-[#920090]/20"
            />
          </div>

          {/* Login Submit Button */}
          <button
            type="submit"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#520051] px-5 py-4 text-xs font-bold text-white transition hover:bg-[#920090] shadow-lg active:scale-98 cursor-pointer dark:bg-[#920090] dark:hover:bg-[#d400d1]"
          >
            Log In & Continue <ArrowRight size={16} />
          </button>
        </form>

        {/* Links */}
        <div className="mt-8 space-y-4 text-center text-xs font-mono">
          <p className="text-ink-muted">
            Don&apos;t have an account?{" "}
            <Link
              href={`/register${redirectUrl !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
              className="font-bold text-[#920090] dark:text-[#f14df0] hover:underline"
            >
              Create Account Free
            </Link>
          </p>

          <div className="my-4 border-t border-border/80" />

          <p>
            <Link
              href="/admin/login"
              className="font-bold text-ink-muted hover:text-ink flex items-center justify-center gap-1.5"
            >
              <ShieldCheck size={14} className="text-[#920090]" /> Access Admin Portal
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}