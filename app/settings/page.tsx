"use client";

import { useEffect, useState } from "react";
import { Settings, Save, Check, AlertCircle, Loader2 } from "lucide-react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubpageHeroHeader } from "@/components/ui/subpage-hero-header";
import { cn } from "@/lib/utils";
import { getAuthenticatedUser, updateUserProfileInDB } from "@/lib/services/auth.service";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-ink">{label}</span>
      <button
        onClick={onChange}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={cn(
          "h-6 w-11 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-surface-2"
        )}
      >
        <span
          className={cn(
            "block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [emailNotify, setEmailNotify] = useState(true);
  const [inApp, setInApp] = useState(true);
  const [push, setPush] = useState(false);
  const [quietHours, setQuietHours] = useState(false);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const u = getAuthenticatedUser();
    if (u) {
      setUserName(u.name || "");
      setUserEmail(u.email || "");
      setCurrentEmail(u.email || "");
    }
  }, []);

  const handleSaveChanges = async () => {
    if (!userName.trim() || !userEmail.trim()) return;
    setIsLoading(true);
    setErrorMsg("");
    try {
      const updated = await updateUserProfileInDB(
        currentEmail || userEmail,
        userName.trim(),
        userEmail.trim()
      );
      setCurrentEmail(updated.email);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update profile in database.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-app max-w-4xl py-8">
      <SubpageHeroHeader
        icon={Settings}
        badgeText="Preferences & Account"
        title="Settings"
        description="Manage your account profile, notification channels, and personal learning goals."
      />

      {isSaved && (
        <div className="mt-4 flex items-center gap-2 rounded-[4px] border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
          <Check size={16} /> Profile updated in PostgreSQL database & saved across all pages!
        </div>
      )}

      {errorMsg && (
        <div className="mt-4 flex items-center gap-2 rounded-[4px] border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-mono font-medium text-red-600 dark:text-red-400">
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}


      <Card className="mt-6">
        <CardContent>
          <CardTitle>Account</CardTitle>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-ink-muted">Full name</label>
              <input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your full name"
                className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-muted">Email</label>
              <input
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent>
          <CardTitle>Notifications</CardTitle>
          <div className="mt-2 divide-y divide-border">
            <Toggle checked={emailNotify} onChange={() => setEmailNotify((v: boolean) => !v)} label="Email notifications" />
            <Toggle checked={inApp} onChange={() => setInApp((v: boolean) => !v)} label="In-app notifications" />
            <Toggle checked={push} onChange={() => setPush((v: boolean) => !v)} label="Push notifications (coming soon)" />
            <Toggle checked={quietHours} onChange={() => setQuietHours((v: boolean) => !v)} label="Quiet hours (9pm–8am)" />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent>
          <CardTitle>Learning Preferences</CardTitle>
          <div className="mt-4">
            <label className="text-xs font-medium text-ink-muted">Daily goal</label>
            <select
              defaultValue="30 minutes"
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink focus:outline-none"
            >
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>60 minutes</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveChanges} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Saving to Database...
            </>
          ) : (
            <>
              <Save size={16} /> Save Changes
            </>
          )}
        </Button>
      </div>

    </div>
  );
}

