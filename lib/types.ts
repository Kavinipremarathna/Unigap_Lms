export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatarColor: string;
  rating: number;
  courses: number;
  learners: number;
}

export interface LessonRef {
  id: string;
  title: string;
  durationMin: number;
  type: "video" | "reading" | "quiz";
  completed: boolean;
  locked: boolean;
}

export interface ModuleRef {
  id: string;
  title: string;
  lessons: LessonRef[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  level: Level;
  durationHours: number;
  rating: number;
  reviewCount: number;
  learners: number;
  price: number;
  isFree: boolean;
  instructorId: string;
  instructorName?: string;
  gradient: [string, string];
  outcomes: string[];
  requirements: string[];
  status?: "Published" | "Draft";
  isPublished?: boolean;
  enrolled?: boolean;
  progress?: number; // 0-100
  currentLesson?: string;
  lastAccessed?: string;
  curriculum?: ModuleRef[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number; // 0-100 for locked achievements
  category: "milestone" | "streak" | "mastery" | "goal";
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: "forever" | "month" | "year";
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}
