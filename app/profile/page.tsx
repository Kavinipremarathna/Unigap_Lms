"use client";

import { useEffect, useState } from "react";
import { BookOpen, Clock, Flame, Award, User } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubpageHeroHeader } from "@/components/ui/subpage-hero-header";
import { getAuthenticatedUser, AuthUser } from "@/lib/services/auth.service";
import { getUserStats, getEnrolledUserCourses, UserStats } from "@/lib/services/user-progress";

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    streak: 0,
    xp: 0,
    level: 1,
    minutesDone: 0,
    completedLessons: 0,
    enrolledCourseIds: [],
    lessonProgress: {},
  });
  const [enrolledCount, setEnrolledCount] = useState(0);

  const loadProfile = () => {
    const u = getAuthenticatedUser();
    setCurrentUser(u);
    const stats = getUserStats();
    setUserStats(stats);
    const enrolled = getEnrolledUserCourses();
    setEnrolledCount(enrolled.length);
  };

  useEffect(() => {
    loadProfile();
    window.addEventListener("unigap_auth_changed", loadProfile);
    window.addEventListener("unigap_user_stats_updated", loadProfile);
    return () => {
      window.removeEventListener("unigap_auth_changed", loadProfile);
      window.removeEventListener("unigap_user_stats_updated", loadProfile);
    };
  }, []);

  const displayName = currentUser?.name || "Learner";
  const displayEmail = currentUser?.email || "learner@unigap.edu";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .substring(0, 2)
    .toUpperCase() || "U";

  const stats = [
    { label: "Enrolled Courses", value: String(enrolledCount), icon: BookOpen },
    { label: "Learning Time", value: `${Math.round((userStats.minutesDone || 0) / 60 * 10) / 10}h`, icon: Clock },
    { label: "Current Streak", value: `${userStats.streak || 0} days`, icon: Flame },
    { label: "XP Points", value: `${(userStats.xp || 0).toLocaleString()} XP`, icon: Award },
  ];

  return (
    <div className="container-app py-8">
      <SubpageHeroHeader
        icon={User}
        badgeText="Account Profile"
        title={displayName}
        description={`Registered learner account. Currently building real-world skills on UNIGAP.`}
        rightContent={
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary font-mono text-lg font-bold text-primary-fg ring-4 ring-primary/20">
              {initials}
            </div>
            <div>
              <p className="font-mono text-xs text-ink-muted">{displayEmail}</p>
              <div className="mt-1 flex gap-1.5">
                <Badge variant="brass">Level {userStats.level || 1}</Badge>
                <Badge variant="xp">{(userStats.xp || 0).toLocaleString()} XP</Badge>
              </div>
            </div>
          </div>
        }
      />



      <p className="mt-6 max-w-xl text-sm text-ink-muted">
        Frontend developer learning cloud fundamentals to round out full-stack skills.
        Currently focused on finishing React Development.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 text-center">
            <s.icon size={20} className="mx-auto text-primary" />
            <p className="mt-2 text-xl font-bold text-ink">{s.value}</p>
            <p className="text-xs text-ink-muted">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-ink">Learning Goals & Interests</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {["React", "Cloud Computing", "System Design", "TypeScript"].map((s) => (
            <Badge key={s} variant="default">{s}</Badge>
          ))}
        </div>
      </div>

      <Card className="mt-8">
        <CardContent>
          <h2 className="font-semibold text-ink">Recent Achievements</h2>
          <p className="mt-1 text-sm text-ink-muted">See the full list on the Achievements page.</p>
        </CardContent>
      </Card>
    </div>
  );
}
