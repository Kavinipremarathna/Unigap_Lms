import { CourseExplorer } from "@/components/courses/course-explorer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Courses",
  description: "Browse, filter, and discover online courses across tech, programming, AI, and design on UNIGAP.",
};

export default function DashboardCoursesPage() {
  return <CourseExplorer variant="dashboard" />;
}
