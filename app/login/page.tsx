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

      if (redirectUrl !== "/dashboard") {
        router.push(redirectUrl);
        return;
      }

      if (data.user.role === "SUPER_ADMIN") {
        router.push("/admin");
        return;
      }

      if (data.user.role === "ADMIN") {
        router.push("/admin");
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the server. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg text-ink px-5 py-12 transition-colors">
      <div className="w-full max-w-md rounded-[4px] border border-border bg-surface p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8 text-center flex flex-col items-center">
          <Link href="/" aria-label="UNIGAP home">
            <Logo />
          </Link>

          <h1 className="mt-6 font-serif text-2xl font-medium text-ink">
            Welcome Back
          </h1>

          <p className="mt-2 text-xs font-mono text-ink-muted">
            Log in to access your enrolled courses and continue learning.
          </p>

          {redirectUrl !== "/dashboard" && (
            <div className="mt-4 flex items-center justify-center gap-1.5 rounded-[4px] bg-primary/15 p-2.5 text-xs font-mono font-medium text-primary border border-primary/30">
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
              className="mb-1.5 block text-xs font-mono text-ink-muted"
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
              className="w-full rounded-[4px] border border-border bg-surface-2 px-4 py-3 text-xs text-ink placeholder:text-ink-muted outline-none transition focus:border-primary"
            />
          </div>

          {/* Password */}
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
              placeholder="••••••••"
              required
              className="w-full rounded-[4px] border border-border bg-surface-2 px-4 py-3 text-xs text-ink placeholder:text-ink-muted outline-none transition focus:border-primary"
            />
          </div>

          {/* Login */}
          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-[4px] bg-primary px-5 py-3.5 text-xs font-semibold text-primary-fg transition hover:opacity-90 shadow-sm"
          >
            Log In & Continue <ArrowRight size={16} />
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 space-y-3 text-center text-xs font-mono">
          <p className="text-ink-muted">
            Don&apos;t have an account?{" "}
            <Link
              href={`/register${redirectUrl !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
              className="font-semibold text-primary hover:underline"
            >
              Create Account
            </Link>
          </p>

          <div className="my-4 border-t border-border" />

          <p>
            <Link
              href="/admin/login"
              className="font-medium text-ink-muted hover:text-ink"
            >
              Log in as Admin
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}