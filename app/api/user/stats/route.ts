import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        stats: true,
        enrollments: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      stats: user.stats || {
        streak: 0,
        xp: 0,
        level: 1,
        minutesDone: 0,
        completedLessons: 0,
      },
      enrollments: user.enrollments || [],
    });
  } catch (error) {
    console.error("GET user stats error:", error);
    return NextResponse.json({ message: "Failed to fetch user stats" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, streak, xp, level, minutesDone, completedLessons, courseId, progressPercentage } = body;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 1. Upsert UserStats in PostgreSQL DB
    const updatedStats = await prisma.userStats.upsert({
      where: { userId: user.id },
      update: {
        ...(typeof streak === "number" ? { streak } : {}),
        ...(typeof xp === "number" ? { xp } : {}),
        ...(typeof level === "number" ? { level } : {}),
        ...(typeof minutesDone === "number" ? { minutesDone } : {}),
        ...(typeof completedLessons === "number" ? { completedLessons } : {}),
        lastActiveDate: new Date(),
      },
      create: {
        userId: user.id,
        streak: streak || 0,
        xp: xp || 0,
        level: level || 1,
        minutesDone: minutesDone || 0,
        completedLessons: completedLessons || 0,
        lastActiveDate: new Date(),
      },
    });

    // 2. If enrolling in or updating a course enrollment, upsert in PostgreSQL DB
    if (courseId) {
      // Find course by ID or slug
      const course = await prisma.course.findFirst({
        where: {
          OR: [{ id: courseId }, { slug: courseId }],
        },
      });

      if (course) {
        await prisma.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: user.id,
              courseId: course.id,
            },
          },
          update: {
            ...(typeof progressPercentage === "number" ? { progressPercentage } : {}),
          },
          create: {
            userId: user.id,
            courseId: course.id,
            progressPercentage: progressPercentage || 0,
          },
        });
      }
    }

    // Return updated user data from PostgreSQL
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        stats: true,
        enrollments: {
          include: {
            course: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "User stats and course enrollments saved to PostgreSQL database.",
      stats: updatedUser?.stats,
      enrollments: updatedUser?.enrollments || [],
    });
  } catch (error) {
    console.error("POST user stats error:", error);
    return NextResponse.json({ message: "Failed to save user stats to database" }, { status: 500 });
  }
}
