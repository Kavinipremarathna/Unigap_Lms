import { prisma } from "../lib/prisma";

async function verify() {
  try {
    const userCount = await prisma.user.count();
    const courseCount = await prisma.course.count();
    console.log(`✅ Connected. (Found ${userCount} users, ${courseCount} courses)`);
  } catch (error) {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
