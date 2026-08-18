import { Achievement } from "@/lib/types";

export const achievements: Achievement[] = [
  { id: "ach-1", title: "First Course", description: "Enrolled in your first course", icon: "Rocket", unlocked: true, category: "milestone" },
  { id: "ach-2", title: "7-Day Streak", description: "Learned 7 days in a row", icon: "Flame", unlocked: true, category: "streak" },
  { id: "ach-3", title: "10 Lessons Completed", description: "Finished 10 lessons across any course", icon: "BookOpen", unlocked: true, category: "milestone" },
  { id: "ach-4", title: "Quiz Master", description: "Scored 100% on 3 quizzes", icon: "Brain", unlocked: true, category: "mastery" },
  { id: "ach-5", title: "Weekly Goal", description: "Hit your weekly learning goal", icon: "Target", unlocked: true, category: "goal" },
  { id: "ach-6", title: "30-Day Streak", description: "Learned 30 days in a row", icon: "Flame", unlocked: false, progress: 23, category: "streak" },
  { id: "ach-7", title: "Course Completer", description: "Finish your first full course", icon: "GraduationCap", unlocked: false, progress: 82, category: "milestone" },
  { id: "ach-8", title: "Goal Crusher", description: "Exceed your weekly goal 4 weeks running", icon: "TrendingUp", unlocked: false, progress: 50, category: "goal" },
  { id: "ach-9", title: "Night Owl", description: "Complete 5 lessons after 9pm", icon: "Moon", unlocked: false, progress: 40, category: "milestone" },
  { id: "ach-10", title: "Perfectionist", description: "Score 100% on 10 quizzes", icon: "Award", unlocked: false, progress: 30, category: "mastery" },
];
