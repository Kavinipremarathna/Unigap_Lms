import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code, expectedCode } = body;

    if (!email || !code || !expectedCode) {
      return NextResponse.json(
        { message: "Email and 6-digit verification code are required." },
        { status: 400 }
      );
    }

    if (code.trim() !== expectedCode.trim()) {
      return NextResponse.json(
        { message: "Invalid email verification code. Please check your email and try again." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { message: "Super Admin authorization required." },
        { status: 403 }
      );
    }

    const token = createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      message: "Super Admin email verification successful. Login access granted.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Super Admin 2FA error:", error);
    return NextResponse.json(
      { message: "Failed to verify Super Admin email access." },
      { status: 500 }
    );
  }
}
