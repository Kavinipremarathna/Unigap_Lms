"use client";

import { useState } from "react";
import { PartyPopper, Flame, Target, Sparkles, CreditCard, CheckCheck, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubpageHeroHeader } from "@/components/ui/subpage-hero-header";
import { cn } from "@/lib/utils";

const tabs = ["All", "Learning", "Achievements", "Payments", "System"] as const;

const notifications = [
  { id: 1, tab: "Achievements", icon: PartyPopper, text: "Course completed! You finished Python Programming.", time: "2h ago", read: false },
  { id: 2, tab: "Learning", icon: Flame, text: "Your 7-day streak is active — keep it going.", time: "5h ago", read: false },
  { id: 3, tab: "Learning", icon: Target, text: "You're close to your weekly goal — 10 minutes left.", time: "1d ago", read: true },
  { id: 4, tab: "System", icon: Sparkles, text: "Your AI learning companion has a new recommendation.", time: "1d ago", read: true },
  { id: 5, tab: "Payments", icon: CreditCard, text: "Your Pro Monthly subscription renewed successfully.", time: "3d ago", read: true },
];

export default function NotificationsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [items, setItems] = useState(notifications);

  const filtered = tab === "All" ? items : items.filter((n) => n.tab === tab);

  return (
    <div className="container-app py-8">
      <SubpageHeroHeader
        icon={Bell}
        badgeText="System Alerts & Activity"
        title="Notifications"
        description="Stay updated with your course milestones, achievements, streaks, and account activity."
        rightContent={
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
          >
            <CheckCheck size={14} /> Mark all as read
          </Button>
        }
      />


      <div className="mt-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-semibold",
              tab === t ? "bg-primary text-primary-fg" : "bg-surface-2 text-ink-muted"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        {filtered.map((n) => (
          <Card
            key={n.id}
            className={cn("flex items-start gap-3 p-4", !n.read && "border-primary/30 bg-primary-50/40")}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2">
              <n.icon size={16} className="text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink">{n.text}</p>
              <p className="mt-1 text-xs text-ink-muted">{n.time}</p>
            </div>
            {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-muted">No notifications in this category.</p>
        )}
      </div>
    </div>
  );
}
