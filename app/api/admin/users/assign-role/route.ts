import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetUserId, targetUserEmail, newRole } = body;

    if ((!targetUserId && !targetUserEmail) || !newRole) {
      return NextResponse.json(
        { message: "Target user ID/email and new role are required." },
        { status: 400 }
      );
    }

    if (!["SUPER_ADMIN", "ADMIN", "STUDENT"].includes(newRole)) {
      return NextResponse.json(
        { message: "Invalid role specified." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(targetUserId ? [{ id: targetUserId }] : []),
          ...(targetUserEmail ? [{ email: targetUserEmail.toLowerCase() }] : []),
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Target user account not found in database." },
        { status: 404 }
      );
    }

    // Update user role in PostgreSQL DB via Prisma
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        role: newRole as "SUPER_ADMIN" | "ADMIN" | "STUDENT",
      },
    });

    return NextResponse.json({
      message: `User role successfully assigned to ${newRole} by Super Admin in PostgreSQL database.`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Assign role error:", error);
    return NextResponse.json(
      { message: "Failed to update user role in database." },
      { status: 500 }
    );
  }
}
