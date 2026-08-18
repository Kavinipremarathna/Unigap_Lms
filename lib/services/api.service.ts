import { getStoredCourses } from "@/lib/mock/courses";
import { getStoredInstructors } from "@/lib/mock/instructors";
import { getStoredUsers, getStoredTransactions, getStoredCertificates } from "@/lib/mock/admin";
import { getEnrolledUserCourses, getUserStats } from "@/lib/services/user-progress";
import { achievements } from "@/lib/mock/achievements";
import { Course, Instructor } from "@/lib/types";
import { AdminUser, PaymentTransaction, IssuedCertificate } from "@/lib/mock/admin";

export interface UserProfile {
  name: string;
  email: string;
  role: "learner" | "instructor" | "admin" | "super_admin";
  avatar: string;
}

export async function getCurrentUser(): Promise<UserProfile> {
  if (typeof window !== "undefined") {
    try {
      const savedRole = localStorage.getItem("unigap_admin_role") as UserProfile["role"] | null;
      const stored = localStorage.getItem("unigap_admin_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        const role = savedRole || parsed.role || "admin";
        return {
          name: parsed.name || "Administrator",
          email: parsed.email || "admin@unigap.edu",
          role,
          avatar: parsed.avatar || (role === "super_admin" ? "SU" : "AD"),
        };
      }
      if (savedRole) {
        return {
          name: "Administrator",
          email: "admin@unigap.edu",
          role: savedRole,
          avatar: savedRole === "super_admin" ? "SU" : "AD",
        };
      }
    } catch {
      // fallback
    }
  }
  return {
    name: "Learner",
    email: "learner@unigap.edu",
    role: "learner",
    avatar: "UN",
  };
}

export async function getDashboardData() {
  const user = await getCurrentUser();
  const stats = typeof window !== "undefined" ? getUserStats() : { streak: 0, xp: 0, level: 1, minutesDone: 0, completedLessons: 0, enrolledCourseIds: [], lessonProgress: {} };
  const enrolled = typeof window !== "undefined" ? getEnrolledUserCourses() : [];
  const catalog = getStoredCourses();

  return {
    user,
    stats,
    enrolledCourses: enrolled,
    catalogCourses: catalog,
    achievements: achievements,
  };
}

export async function getCourses(): Promise<Course[]> {
  return getStoredCourses();
}

export async function getEnrolledCourses(): Promise<Course[]> {
  return typeof window !== "undefined" ? getEnrolledUserCourses() : [];
}

export async function getAchievements() {
  return achievements; // Retained as reference sample data per instructions
}

export async function getCertificates(): Promise<IssuedCertificate[]> {
  return typeof window !== "undefined" ? getStoredCertificates() : [];
}

export async function getNotifications(): Promise<any[]> {
  return [];
}

export async function getUsers(): Promise<AdminUser[]> {
  return typeof window !== "undefined" ? getStoredUsers() : [];
}

export async function getInstructors(): Promise<Instructor[]> {
  return getStoredInstructors();
}

export async function getPayments(): Promise<PaymentTransaction[]> {
  return typeof window !== "undefined" ? getStoredTransactions() : [];
}

export async function getAdminStats() {
  const users = await getUsers();
  const courses = await getCourses();
  const instructors = await getInstructors();
  const payments = await getPayments();
  const certificates = await getCertificates();

  const totalRevenue = payments.reduce((acc, curr) => (curr.status === "completed" ? acc + curr.amount : acc), 0);

  return {
    totalUsers: users.length,
    activeCourses: courses.filter((c) => !c.isFree || c.price >= 0).length,
    totalInstructors: instructors.length,
    totalRevenue,
    issuedCertificates: certificates.length,
    totalEnrollments: courses.reduce((acc, curr) => acc + (curr.learners || 0), 0),
  };
}
