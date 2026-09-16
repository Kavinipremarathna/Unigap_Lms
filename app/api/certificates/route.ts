import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.trim().toLowerCase();

    // If email is provided, get user's certificates
    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          certificates: {
            include: {
              course: true,
            },
            orderBy: {
              issuedAt: "desc",
            },
          },
        },
      });

      if (!user) {
        return NextResponse.json({ message: "User not found", certificates: [] }, { status: 404 });
      }

      const formatted = user.certificates.map((cert) => ({
        id: cert.id,
        certificateHash: cert.certNumber,
        recipientName: user.name,
        recipientEmail: user.email,
        courseTitle: cert.course.title,
        issueDate: new Date(cert.issuedAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        grade: "Excellent (Distinction - 95%)",
        pdfUrl: cert.pdfUrl || undefined,
      }));

      return NextResponse.json({ certificates: formatted });
    }

    // Otherwise, fetch all issued certificates (for Admin view)
    const allCerts = await prisma.certificate.findMany({
      include: {
        user: true,
        course: true,
      },
      orderBy: {
        issuedAt: "desc",
      },
    });

    const formattedAll = allCerts.map((cert) => ({
      id: cert.id,
      certificateHash: cert.certNumber,
      recipientName: cert.user.name,
      recipientEmail: cert.user.email,
      courseTitle: cert.course.title,
      issueDate: new Date(cert.issuedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      grade: "Excellent (Distinction - 95%)",
      pdfUrl: cert.pdfUrl || undefined,
    }));

    return NextResponse.json({ certificates: formattedAll });
  } catch (error) {
    console.error("GET certificates error:", error);
    return NextResponse.json({ message: "Failed to fetch certificates", certificates: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, courseTitle, courseId, certNumber, grade } = body;

    if (!email || !courseTitle || !certNumber) {
      return NextResponse.json(
        { message: "email, courseTitle, and certNumber are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Find User by email
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 2. Find or create Course by slug/id/title
    const targetSlug = courseId || courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    let course = await prisma.course.findFirst({
      where: {
        OR: [
          { id: courseId || "" },
          { slug: targetSlug },
          { title: { equals: courseTitle, mode: "insensitive" } },
        ],
      },
    });

    if (!course) {
      let inst = await prisma.instructor.findFirst();
      if (!inst) {
        inst = await prisma.instructor.create({
          data: {
            name: "Dr. Sarah Jenkins",
            title: "Senior Educator",
            bio: "Lead Instructor at UNIGAP",
            avatar: "SJ",
          },
        });
      }

      course = await prisma.course.create({
        data: {
          title: courseTitle,
          slug: targetSlug,
          description: `Course on ${courseTitle}`,
          shortDesc: `Learn ${courseTitle} at UNIGAP`,
          category: "Education",
          price: 0,
          isFree: true,
          status: "Published",
          isPublished: true,
          instructorId: inst.id,
        },
      });
    }

    // 3. Upsert Certificate record in PostgreSQL database
    const savedCert = await prisma.certificate.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
      update: {
        certNumber: certNumber,
        issuedAt: new Date(),
      },
      create: {
        userId: user.id,
        courseId: course.id,
        certNumber: certNumber,
      },
    });

    // 4. Update Enrollment progress to 100%
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
      update: {
        progressPercentage: 100,
      },
      create: {
        userId: user.id,
        courseId: course.id,
        progressPercentage: 100,
      },
    });

    return NextResponse.json({
      message: "Certificate issued and saved to PostgreSQL DB successfully.",
      certificate: {
        id: savedCert.id,
        certificateHash: savedCert.certNumber,
        recipientName: user.name,
        recipientEmail: user.email,
        courseTitle: course.title,
        issueDate: new Date(savedCert.issuedAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        grade: grade || "Excellent (Distinction - 95%)",
      },
    });
  } catch (error) {
    console.error("POST certificate error:", error);
    return NextResponse.json({ message: "Failed to issue certificate to database" }, { status: 500 });
  }
}
