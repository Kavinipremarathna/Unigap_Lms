"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const handleLogin = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // Temporary prototype admin login.
    // Real authentication will be connected to NestJS later.
    router.push("/admin");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7fb] px-5">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-[#520051]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#520051] to-[#d400d1]">
              <ShieldCheck
                size={22}
                className="text-white"
              />
            </span>

            UNIGAP
          </Link>

          <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-[#920090]">
            Administration Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-[#920090]/10 bg-white p-8 shadow-xl">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#520051]">
              Admin Login
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to manage the UNIGAP learning platform.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#520051]"
              >
                Admin Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@unigap.com"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10"
              />
            </div>

            {/* Password */}
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
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#520051] px-5 py-3.5 font-semibold text-white transition hover:bg-[#920090]"
            >
              Sign in to Admin Panel
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-6 text-center">
            <Link
              href="/"
              className="text-sm font-semibold text-[#920090] hover:underline"
            >
              ← Back to UNIGAP
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Admin access is restricted to authorized platform administrators.
        </p>
      </div>
    </main>
  );
}