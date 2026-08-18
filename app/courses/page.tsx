import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CourseExplorer } from "@/components/courses/course-explorer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Courses",
  description:
    "Explore our complete course catalog across web development, programming, AI, data science, and cloud computing on UNIGAP.",
};

export default function CoursesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Navbar />
      <main className="flex-1">
        <CourseExplorer variant="public" />
      </main>
      <Footer />
    </div>
  );
}
