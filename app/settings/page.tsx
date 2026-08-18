"use client";

import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [email, setEmail] = useState(true);
  const [inApp, setInApp] = useState(true);
  const [push, setPush] = useState(false);
  const [quietHours, setQuietHours] = useState(false);

  return (
    <div className="container-app max-w-2xl py-8">
      <h1 className="text-2xl font-bold text-ink">Settings</h1>

      <Card className="mt-6">
        <CardContent>
          <CardTitle>Account</CardTitle>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-ink-muted">Full name</label>
              <input
                defaultValue="Jordan Diaz"
                className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-muted">Email</label>
              <input
                defaultValue="jordan.diaz@example.com"
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
            <Toggle checked={email} onChange={() => setEmail((v) => !v)} label="Email notifications" />
            <Toggle checked={inApp} onChange={() => setInApp((v) => !v)} label="In-app notifications" />
            <Toggle checked={push} onChange={() => setPush((v) => !v)} label="Push notifications (coming soon)" />
            <Toggle checked={quietHours} onChange={() => setQuietHours((v) => !v)} label="Quiet hours (9pm–8am)" />
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
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
