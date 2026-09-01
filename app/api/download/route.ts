import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let fileUrl = searchParams.get("url") || searchParams.get("file");

    if (!fileUrl) {
      return new NextResponse("File URL is required", { status: 400 });
    }

    // Decode URL
    fileUrl = decodeURIComponent(fileUrl).trim();

    // Determine filename
    const filename = path.basename(fileUrl) || "download.pdf";

    // Candidate file paths
    const candidates = [
      // 1. Direct path inside public
      path.join(process.cwd(), "public", fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl),
      // 2. Inside public/uploads/resources
      path.join(process.cwd(), "public", "uploads", "resources", filename),
      // 3. Inside public/uploads
      path.join(process.cwd(), "public", "uploads", filename),
      // 4. Fallback in user's Downloads folder
      path.join("C:\\Users\\User\\Downloads", filename),
    ];

    let foundPath: string | null = null;
    for (const candidate of candidates) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        foundPath = candidate;
        break;
      }
    }

    if (!foundPath) {
      return new NextResponse("Requested file was not found on server", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const fileBuffer = await readFile(foundPath);
    const ext = path.extname(foundPath).toLowerCase();

    // Determine Content-Type
    let contentType = "application/octet-stream";
    if (ext === ".pdf") contentType = "application/pdf";
    else if (ext === ".mp4") contentType = "video/mp4";
    else if (ext === ".zip") contentType = "application/zip";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Download route error:", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
