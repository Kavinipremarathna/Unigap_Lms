import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const passwordHash = await bcrypt.hash("Unigap@123", 10);
  console.log("Seeding UNIGAP database with bcrypt passwords...");

  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@unigap.edu" },
    update: { role: "SUPER_ADMIN", passwordHash },
    create: {
      email: "superadmin@unigap.edu",
      name: "UNIGAP Super Admin",
      passwordHash,
      role: "SUPER_ADMIN",
      department: "Executive Leadership",
    },
  });

  const kaviniSuperAdmin = await prisma.user.upsert({
    where: { email: "kkgpremarathna@gmail.com" },
    update: { role: "SUPER_ADMIN", passwordHash },
    create: {
      email: "kkgpremarathna@gmail.com",
      name: "Kavini Gavesha",
      passwordHash,
      role: "SUPER_ADMIN",
      department: "Executive Leadership",
    },
  });


  const admin = await prisma.user.upsert({
    where: { email: "admin@unigap.edu" },
    update: { role: "ADMIN", passwordHash },
    create: {
      email: "admin@unigap.edu",
      name: "UNIGAP Course Admin",
      passwordHash,
      role: "ADMIN",
      department: "Course Management",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@unigap.edu" },
    update: { role: "STUDENT", passwordHash },
    create: {
      email: "student@unigap.edu",
      name: "Test Student",
      passwordHash,
      role: "STUDENT",
    },
  });

  const instructor = await prisma.instructor.upsert({
    where: { id: "inst-seed-1" },
    update: {},
    create: {
      id: "inst-seed-1",
      name: "Dr. Sarah Jenkins",
      title: "Senior Full-Stack Architect",
      bio: "12+ years building enterprise scale distributed web systems.",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
      rating: 4.9,
      coursesCount: 3,
    },
  });

  const course = await prisma.course.upsert({
    where: { slug: "javascript-mastery" },
    update: {},
    create: {
      title: "JavaScript & TypeScript Mastery 2026",
      slug: "javascript-mastery",
      description:
        "Master modern ES2026, TypeScript, async patterns, and clean code architecture.",
      shortDesc: "Complete guide to modern JS & TS development.",
      category: "Development",
      level: "Beginner",
      price: 0,
      isFree: true,
      status: "Published",
      isPublished: true,
      instructorId: instructor.id,
      rating: 4.8,
      durationHours: 12.5,
    },
  });

  const achievement1 = await prisma.achievement.upsert({
    where: { id: "achieve-first-step" },
    update: {},
    create: {
      id: "achieve-first-step",
      title: "First Step",
      description: "Complete your first lesson on UNIGAP.",
      requirement: "Complete 1 Lesson",
      xp: 50,
      category: "milestone",
      icon: "award",
      active: true,
    },
  });

  const achievement2 = await prisma.achievement.upsert({
    where: { id: "achieve-7-day-streak" },
    update: {},
    create: {
      id: "achieve-7-day-streak",
      title: "7 Day Streak",
      description: "Learn for seven consecutive days without missing a day.",
      requirement: "Maintain a 7-day streak",
      xp: 200,
      category: "streak",
      icon: "flame",
      active: true,
    },
  });

  const achievement3 = await prisma.achievement.upsert({
    where: { id: "achieve-quiz-master" },
    update: {},
    create: {
      id: "achieve-quiz-master",
      title: "Quiz Master",
      description: "Successfully complete 10 quizzes with a passing grade.",
      requirement: "Complete 10 quizzes",
      xp: 150,
      category: "mastery",
      icon: "trophy",
      active: true,
    },
  });

  const achievement4 = await prisma.achievement.upsert({
    where: { id: "achieve-goal-crusher" },
    update: {},
    create: {
      id: "achieve-goal-crusher",
      title: "Goal Crusher",
      description: "Complete five weekly learning goals.",
      requirement: "Complete 5 weekly goals",
      xp: 300,
      category: "goal",
      icon: "target",
      active: true,
    },
  });

  console.log("Seed completed successfully.");
  console.log(`Super Admin: ${superAdmin.email}`);
  console.log(`Admin: ${admin.email}`);
  console.log(`Student: ${student.email}`);
  console.log(`Instructor: ${instructor.name}`);
  console.log(`Course: ${course.title}`);
  console.log(`Achievements seeded in PostgreSQL DB: 4`);
}

main()
  .catch((error) => {
    console.error("❌ Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });