import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No file provided." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads/resources directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "resources");
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique safe filename
    const ext = path.extname(file.name) || "";
    const uniqueFilename = `resource_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, uniqueFilename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/resources/${uniqueFilename}`;

    return NextResponse.json({
      message: "Resource uploaded successfully.",
      url: publicUrl,
      originalName: file.name,
    });
  } catch (error) {
    console.error("Resource upload error:", error);
    return NextResponse.json({ message: "Failed to upload resource file." }, { status: 500 });
  }
}
