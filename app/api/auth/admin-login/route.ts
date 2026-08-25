import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth";


export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!email || !password) {
      return NextResponse.json(
        { message: "Admin email and password are required." },
        { status: 400 }
      );
    }

    // 1. Query User from PostgreSQL database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Account not found. Admin access must be assigned by a Super Admin." },
        { status: 404 }
      );
    }

    // 2. Validate Password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid password. Access denied." },
        { status: 401 }
      );
    }

    // 3. RULE 1: Admin access ONLY assigned by Super Admin
    if (user.role === "STUDENT") {
      return NextResponse.json(
        { message: "Access Denied: Admin login access must be assigned by a Super Admin." },
        { status: 403 }
      );
    }

    // 4. RULE 2: Super Admin must verify login access via Email 2FA Code
    if (user.role === "SUPER_ADMIN") {
      const verificationCode = String(Math.floor(100000 + Math.random() * 900000));
      
      return NextResponse.json({
        requires2FA: true,
        message: `Email verification code sent to ${user.email}. Please verify email code to complete login access.`,
        email: user.email,
        verificationCode, // Simulated email verification code for demo & testing
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // 5. Standard Admin Login (Assigned by Super Admin)
    const token = createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      requires2FA: false,
      message: "Admin login successful.",
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
    console.error("Admin login error:", error);
    return NextResponse.json(
      { message: "Admin login authentication error." },
      { status: 500 }
    );
  }
}

