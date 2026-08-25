"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, KeyRound, AlertCircle, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"login" | "verify_email">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Super Admin 2FA Email verification states
  const [sentCode, setSentCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const handleInitialLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Admin authentication failed.");
        return;
      }

      if (data.requires2FA) {
        setSentCode(data.verificationCode);
        setUserCode(data.verificationCode);
        setStep("verify_email");
        return;
      }


      // Standard Admin login succeeded
      if (typeof window !== "undefined") {
        const normRole = (data.user?.role || "").toLowerCase().includes("super") ? "super_admin" : "admin";
        localStorage.setItem("unigap_admin_role", normRole);
        localStorage.setItem("unigap_admin_profile", JSON.stringify({ ...data.user, role: normRole }));
        if (data.token) {
          localStorage.setItem("unigap_auth_token", data.token);
        }
        localStorage.setItem("unigap_auth_user", JSON.stringify({ ...data.user, role: normRole }));
        localStorage.setItem("unigap_auth_logged_in", "true");
        window.dispatchEvent(new Event("unigap_auth_changed"));
      }
      router.push("/admin");
    } catch (err: any) {
      setErrorMsg("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userCode.trim()) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/auth/admin-verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: userCode,
          expectedCode: sentCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Invalid verification code.");
        return;
      }

      setVerifiedSuccess(true);
      if (typeof window !== "undefined") {
        const normRole = (data.user?.role || "").toLowerCase().includes("super") ? "super_admin" : "admin";
        localStorage.setItem("unigap_admin_role", normRole);
        localStorage.setItem("unigap_admin_profile", JSON.stringify({ ...data.user, role: normRole }));
        if (data.token) {
          localStorage.setItem("unigap_auth_token", data.token);
        }
        localStorage.setItem("unigap_auth_user", JSON.stringify({ ...data.user, role: normRole }));
        localStorage.setItem("unigap_auth_logged_in", "true");
        window.dispatchEvent(new Event("unigap_auth_changed"));
      }

      setTimeout(() => {
        router.push("/admin");
      }, 1000);

    } catch (err: any) {
      setErrorMsg("Failed to verify email code.");

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg text-ink px-5 transition-colors py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center flex flex-col items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-2xl font-serif font-bold text-ink"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-primary text-primary-fg shadow-sm">
              <ShieldCheck size={22} />
            </span>
            UNIGAP
          </Link>

          <p className="mt-2 text-xs font-mono font-semibold uppercase tracking-widest text-primary">
            Administration Portal
          </p>
        </div>

        {/* Simulated Email Verification Inbox Notification Banner for Super Admin */}
        {step === "verify_email" && (
          <div className="mb-5 rounded-[4px] border border-primary/30 bg-primary/10 p-4 text-xs font-mono text-ink shadow-md">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <Mail size={16} /> ✉️ SIMULATED INBOX: Verification Email Sent to {email}
            </div>
            <p className="mt-1.5 text-ink-muted">
              Security Code: <strong className="text-primary font-bold text-sm bg-primary/20 px-2 py-0.5 rounded">{sentCode}</strong>
            </p>
            <p className="mt-1 text-[11px] text-ink-muted">
              (Use code <span className="font-bold text-ink">{sentCode}</span> below to verify login access)
            </p>
          </div>
        )}

        {/* Login Card */}
        <div className="rounded-[4px] border border-border bg-surface p-8 shadow-xl">
          <div className="mb-6">
            <h1 className="font-serif text-2xl font-medium text-ink">
              {step === "login" ? "Admin Login" : "Super Admin Verification"}
            </h1>

            <p className="mt-1 text-xs font-mono text-ink-muted">
              {step === "login"
                ? "Restricted portal. Admin access must be assigned by a Super Admin."
                : `Enter the 6-digit verification code sent to ${email} to authorize login access.`}
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-5 flex items-center gap-2 rounded-[4px] bg-red-500/10 p-3.5 text-xs font-mono text-red-600 dark:text-red-400 border border-red-500/30">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Alert */}
          {verifiedSuccess && (
            <div className="mb-5 flex items-center gap-2 rounded-[4px] bg-emerald-500/10 p-3.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>Verification successful! Access granted to Admin Panel...</span>
            </div>
          )}

          {step === "login" ? (
            <form onSubmit={handleInitialLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-mono text-ink-muted"
                >
                  Admin Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@unigap.edu or admin@unigap.edu"
                  required
                  disabled={isLoading}
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
                  disabled={isLoading}
                  className="w-full rounded-[4px] border border-border bg-surface-2 px-4 py-3 text-xs text-ink placeholder:text-ink-muted outline-none transition focus:border-primary"
                />
              </div>

              {/* Quick Fill Demo Credentials */}
              <div className="rounded-[4px] border border-border bg-surface-2 p-3 space-y-2 text-xs font-mono">
                <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block">
                  ⚡ Quick Demo Credentials (1-Click Fill)
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("superadmin@unigap.edu");
                      setPassword("Unigap@123");
                    }}
                    className="flex-1 rounded border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs text-primary font-bold hover:bg-primary/20 transition"
                  >
                    👑 Super Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("kkgpremarathna@gmail.com");
                    }}
                    className="flex-1 rounded border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs text-accent font-bold hover:bg-accent/20 transition"
                  >
                    👑 Kavini (Super Admin)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("admin@unigap.edu");
                      setPassword("Unigap@123");
                    }}
                    className="flex-1 rounded border border-border bg-surface px-2.5 py-1 text-xs text-ink font-bold hover:bg-surface-2 transition"
                  >
                    🛡️ Admin
                  </button>

                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-[4px] bg-primary px-5 py-3.5 text-xs font-semibold text-primary-fg transition hover:opacity-90 shadow-sm disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Authenticating...
                  </>
                ) : (
                  <>
                    Sign in to Admin Panel <ArrowRight size={16} />
                  </>
                )}
              </button>

            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label
                  htmlFor="userCode"
                  className="mb-1.5 block text-xs font-mono text-ink-muted"
                >
                  6-Digit Email Verification Code
                </label>

                <div className="relative flex items-center">
                  <KeyRound size={16} className="absolute left-3.5 text-ink-muted" />
                  <input
                    id="userCode"
                    type="text"
                    maxLength={6}
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    placeholder="e.g. 584920"
                    required
                    disabled={isLoading || verifiedSuccess}
                    className="w-full rounded-[4px] border border-border bg-surface-2 pl-10 pr-4 py-3 text-sm font-mono font-bold tracking-widest text-ink placeholder:tracking-normal placeholder:text-ink-muted outline-none transition focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || verifiedSuccess}
                className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-primary px-5 py-3.5 text-xs font-semibold text-primary-fg transition hover:opacity-90 shadow-sm disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Verifying Code...
                  </>
                ) : (
                  <>
                    Verify Email & Grant Access <CheckCircle2 size={16} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep("login")}
                className="w-full text-center text-xs font-mono text-ink-muted hover:text-ink pt-2"
              >
                ← Back to Login Step 1
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-border pt-5 text-center">
            <Link
              href="/"
              className="text-xs font-mono font-semibold text-primary hover:underline"
            >
              ← Back to UNIGAP LMS
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-[11px] font-mono text-ink-muted">
          Notice: Admin login access can only be assigned by a Super Admin.
        </p>
      </div>
    </main>
  );
}