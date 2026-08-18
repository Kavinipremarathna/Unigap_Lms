import { BookOpen, Clock, Flame, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Courses Completed", value: "4", icon: BookOpen },
  { label: "Learning Time", value: "62h", icon: Clock },
  { label: "Current Streak", value: "7 days", icon: Flame },
  { label: "Certificates", value: "1", icon: Award },
];

export default function ProfilePage() {
  return (
    <div className="container-app py-8">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-xl font-bold text-white">
          JD
        </div>
        <div>
          <h1 className="text-2xl font-bold text-ink">Jordan Diaz</h1>
          <p className="text-sm text-ink-muted">jordan.diaz@example.com</p>
          <div className="mt-1.5 flex gap-2">
            <Badge variant="primary">Level 8</Badge>
            <Badge variant="xp">1,240 XP</Badge>
          </div>
        </div>
      </div>

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
