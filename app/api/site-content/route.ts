import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contents = await prisma.siteContent.findMany();
    
    const result: Record<string, any> = {};
    contents.forEach((item) => {
      result[item.section] = item.content;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/site-content error:", error);
    return NextResponse.json({ message: "Failed to fetch site content from database." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { section, content } = body;

    if (!section || !content) {
      return NextResponse.json(
        { message: "Section name and content JSON required." },
        { status: 400 }
      );
    }

    const updated = await prisma.siteContent.upsert({
      where: { section },
      update: {
        content: content as any,
      },
      create: {
        section,
        content: content as any,
      },
    });

    return NextResponse.json({
      message: `Site content for section '${section}' saved to PostgreSQL database.`,
      siteContent: updated,
    });
  } catch (error) {
    console.error("POST /api/site-content error:", error);
    return NextResponse.json(
      { message: "Failed to save site content to database." },
      { status: 500 }
    );
  }
}
