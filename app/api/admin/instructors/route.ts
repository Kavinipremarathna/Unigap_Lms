import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const instructors = await prisma.instructor.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        courses: {
          include: {
            enrollments: true,
          },
        },
      },
    });

    const formatted = instructors.map((i) => {
      const totalStudents = i.courses.reduce((sum, c) => sum + c.enrollments.length, 0);
      return {
        id: i.id,
        name: i.name,
        email: `${i.name.toLowerCase().replace(/[^a-z0-9]/g, ".")}@unigap.edu`,
        bio: i.bio || "Instructor at UNIGAP",
        avatar: i.avatar || "SJ",
        title: i.title || "Senior Educator",
        department: "Computer Science",
        coursesCount: i.courses.length,
        studentsCount: totalStudents,
        rating: i.rating,
        createdAt: i.createdAt,
      };
    });

    return NextResponse.json({ instructors: formatted });
  } catch (error) {
    console.error("GET /api/admin/instructors error:", error);
    return NextResponse.json({ message: "Failed to fetch instructors." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, bio, title, avatar } = body;

    if (!name) {
      return NextResponse.json({ message: "Instructor name is required." }, { status: 400 });
    }

    const created = await prisma.instructor.create({
      data: {
        name: name.trim(),
        bio: bio ? bio.trim() : "Instructor at UNIGAP",
        title: title ? title.trim() : "Senior Educator",
        avatar: avatar ? avatar.trim() : "SJ",
      },
    });

    return NextResponse.json({
      message: "Instructor added successfully to PostgreSQL database.",
      instructor: created,
    });
  } catch (error) {
    console.error("POST /api/admin/instructors error:", error);
    return NextResponse.json({ message: "Failed to add instructor to PostgreSQL." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, name, bio, title, avatar } = body;

    if (!id) {
      return NextResponse.json({ message: "Instructor ID required." }, { status: 400 });
    }

    const updated = await prisma.instructor.update({
      where: { id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(bio ? { bio: bio.trim() } : {}),
        ...(title ? { title: title.trim() } : {}),
        ...(avatar ? { avatar: avatar.trim() } : {}),
      },
    });

    return NextResponse.json({
      message: "Instructor updated successfully in PostgreSQL database.",
      instructor: updated,
    });
  } catch (error) {
    console.error("PATCH /api/admin/instructors error:", error);
    return NextResponse.json({ message: "Failed to update instructor in PostgreSQL." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Instructor ID is required." }, { status: 400 });
    }

    // Deleting instructor automatically cascades and deletes all associated courses & enrollments
    await prisma.instructor.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Instructor and all associated courses & enrollments permanently deleted from PostgreSQL.",
    });
  } catch (error) {
    console.error("DELETE /api/admin/instructors error:", error);
    return NextResponse.json({ message: "Failed to delete instructor from PostgreSQL." }, { status: 500 });
  }
}
