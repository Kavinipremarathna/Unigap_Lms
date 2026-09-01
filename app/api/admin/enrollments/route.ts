import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const enrollments = await prisma.enrollment.findMany({
      orderBy: { enrolledAt: "desc" },
      include: {
        user: true,
        course: {
          include: {
            instructor: true,
          },
        },
      },
    });

    const formatted = enrollments.map((e) => ({
      id: e.id,
      userId: e.userId,
      userName: e.user?.name || "Student",
      userEmail: e.user?.email || "",
      courseId: e.courseId,
      courseTitle: e.course?.title || "Deleted Course",
      instructorName: e.course?.instructor?.name || "Unassigned",
      progressPercentage: e.progressPercentage,
      enrolledAt: e.enrolledAt,
    }));

    return NextResponse.json({ enrollments: formatted });
  } catch (error) {
    console.error("GET /api/admin/enrollments error:", error);
    return NextResponse.json({ message: "Failed to fetch enrollments." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, courseId } = body;

    if (!userId || !courseId) {
      return NextResponse.json({ message: "User ID and Course ID required." }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {},
      create: {
        userId,
        courseId,
      },
      include: {
        user: true,
        course: true,
      },
    });

    return NextResponse.json({
      message: "Enrollment created and saved to PostgreSQL database.",
      enrollment,
    });
  } catch (error) {
    console.error("POST /api/admin/enrollments error:", error);
    return NextResponse.json({ message: "Failed to create enrollment." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");

    if (id) {
      await prisma.enrollment.delete({
        where: { id },
      });
    } else if (userId && courseId) {
      await prisma.enrollment.delete({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });
    } else {
      return NextResponse.json({ message: "Enrollment ID or userId+courseId required." }, { status: 400 });
    }

    return NextResponse.json({
      message: "Enrollment permanently deleted from PostgreSQL database.",
    });
  } catch (error) {
    console.error("DELETE /api/admin/enrollments error:", error);
    return NextResponse.json({ message: "Failed to delete enrollment." }, { status: 500 });
  }
}
