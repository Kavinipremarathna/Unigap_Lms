import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const currentEmail =
      typeof body.currentEmail === "string"
        ? body.currentEmail.trim().toLowerCase()
        : "";

    const name =
      typeof body.name === "string" && body.name.trim()
        ? body.name.trim()
        : undefined;

    const email =
      typeof body.email === "string" && body.email.trim()
        ? body.email.trim().toLowerCase()
        : undefined;

    if (!currentEmail) {
      return NextResponse.json(
        { message: "Current user email is required." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: currentEmail },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User account not found in database." },
        { status: 404 }
      );
    }

    // Check if new email is taken by another user
    if (email && email !== currentEmail) {
      const emailTaken = await prisma.user.findUnique({
        where: { email },
      });
      if (emailTaken) {
        return NextResponse.json(
          { message: "This email address is already in use by another account." },
          { status: 400 }
        );
      }
    }

    // 1. Update User in PostgreSQL DB via Prisma (Replaces name and/or email column)
    const updatedUser = await prisma.user.update({
      where: { email: currentEmail },
      data: {
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
      },
    });

    // 2. Generate a new JWT token with updated login access credentials (new email)
    const newToken = createToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    });

    const response = NextResponse.json({
      message: "Profile updated successfully in PostgreSQL database. Login credentials updated.",
      token: newToken,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });

    // 3. Set updated HTTP-only auth cookie with new login credentials
    response.cookies.set("auth_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Failed to save profile changes to database." },
      { status: 500 }
    );
  }
}

