import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || file?.name || "Untitled Video";
    const lessonId = (formData.get("lessonId") as string) || null;
    const uploadedByEmail = (formData.get("email") as string) || null;

    if (!file) {
      return NextResponse.json({ message: "No video file provided." }, { status: 400 });
    }

    // Verify MIME type is a video
    if (!file.type.startsWith("video/")) {
      return NextResponse.json(
        { message: "Invalid file format. Please upload a valid video file (.mp4, .webm, .mov, etc)." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "videos");
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique safe filename
    const fileExtension = path.extname(file.name) || ".mp4";
    const uniqueFilename = `video_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${fileExtension}`;
    const filePath = path.join(uploadsDir, uniqueFilename);

    // Write video binary file to disk
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/videos/${uniqueFilename}`;

    // Find uploader ID if email is provided
    let uploaderId: string | null = null;
    if (uploadedByEmail) {
      const uploader = await prisma.user.findUnique({ where: { email: uploadedByEmail } });
      if (uploader) uploaderId = uploader.id;
    }

    // Create VideoUpload record in PostgreSQL Database via Prisma
    const videoRecord = await prisma.videoUpload.create({
      data: {
        title,
        filename: file.name,
        fileUrl: publicUrl,
        mimeType: file.type || "video/mp4",
        fileSize: file.size,
        lessonId: lessonId || undefined,
        uploadedById: uploaderId || undefined,
        status: "READY",
      },
    });

    return NextResponse.json({
      message: "Video uploaded successfully and saved to PostgreSQL database.",
      video: videoRecord,
    });
  } catch (error) {
    console.error("Video upload API error:", error);
    return NextResponse.json(
      { message: "Failed to upload video file to server." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const videos = await prisma.videoUpload.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        lesson: true,
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("GET videos error:", error);
    return NextResponse.json({ message: "Failed to fetch videos from database." }, { status: 500 });
  }
}
