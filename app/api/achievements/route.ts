import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    let userId: string | null = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.substring(7);
        const payload = await verifyToken(token);
        if (payload?.userId) {
          userId = payload.userId;
        }
      } catch {
        // ignore
      }
    }

    // Query all achievements from PostgreSQL
    const achievements = await prisma.achievement.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        unlockedBy: true,
      },
    });

    let userStats = null;
    let unlockedAchievementIds = new Set<string>();

    if (userId) {
      userStats = await prisma.userStats.findUnique({
        where: { userId },
      });
      const userUnlocks = await prisma.userAchievement.findMany({
        where: { userId },
      });
      unlockedAchievementIds = new Set(userUnlocks.map((u) => u.achievementId));
    }

    const formattedAchievements = achievements.map((a) => {
      const isUnlocked = userId ? unlockedAchievementIds.has(a.id) : false;
      return {
        id: a.id,
        title: a.title,
        description: a.description,
        requirement: a.requirement,
        xp: a.xp,
        category: a.category,
        icon: a.icon,
        active: a.active,
        unlockedBy: a.unlockedBy.length,
        unlocked: isUnlocked,
        progress: isUnlocked ? 100 : 0,
        createdAt: a.createdAt,
      };
    });

    return NextResponse.json({
      achievements: formattedAchievements,
      userStats: userStats || { xp: 0, streak: 0, level: 1 },
    });
  } catch (error) {
    console.error("GET /api/achievements error:", error);
    return NextResponse.json(
      { message: "Failed to fetch achievements from database." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, requirement, xp, category, icon } = body;

    if (!title || !description) {
      return NextResponse.json(
        { message: "Title and description are required." },
        { status: 400 }
      );
    }

    const created = await prisma.achievement.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        requirement: requirement ? requirement.trim() : "Complete requirement",
        xp: Number(xp) || 50,
        category: category || "milestone",
        icon: icon || "award",
        active: true,
      },
    });

    return NextResponse.json({
      message: "Achievement created and saved to PostgreSQL database.",
      achievement: created,
    });
  } catch (error) {
    console.error("POST /api/achievements error:", error);
    return NextResponse.json(
      { message: "Failed to create achievement in database." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, requirement, xp, category, icon, active } = body;

    if (!id) {
      return NextResponse.json({ message: "Achievement ID required." }, { status: 400 });
    }

    const updated = await prisma.achievement.update({
      where: { id },
      data: {
        ...(title ? { title: title.trim() } : {}),
        ...(description ? { description: description.trim() } : {}),
        ...(requirement ? { requirement: requirement.trim() } : {}),
        ...(xp !== undefined ? { xp: Number(xp) } : {}),
        ...(category ? { category } : {}),
        ...(icon ? { icon } : {}),
        ...(active !== undefined ? { active: Boolean(active) } : {}),
      },
    });

    return NextResponse.json({
      message: "Achievement updated in database.",
      achievement: updated,
    });
  } catch (error) {
    console.error("PATCH /api/achievements error:", error);
    return NextResponse.json(
      { message: "Failed to update achievement in database." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Achievement ID required." }, { status: 400 });
    }

    await prisma.achievement.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Achievement deleted from database." });
  } catch (error) {
    console.error("DELETE /api/achievements error:", error);
    return NextResponse.json(
      { message: "Failed to delete achievement from database." },
      { status: 500 }
    );
  }
}
