import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        instructor: true,
        enrollments: true,
        modules: {
          orderBy: { orderIndex: "asc" },
          include: {
            lessons: {
              orderBy: { orderIndex: "asc" },
              include: {
                quizData: true,
              },
            },
          },
        },
      },
    });

    const formatted = courses.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.description,
      shortDescription: c.shortDesc || c.description,
      category: c.category,
      level: c.level,
      price: Number(c.price),
      isFree: c.isFree,
      status: c.status,
      isPublished: c.isPublished,
      thumbnailUrl: c.thumbnailUrl || null,
      rating: c.rating,
      durationHours: c.durationHours,
      instructorId: c.instructorId,
      instructorName: c.instructor?.name || "Unassigned",
      studentsCount: c.enrollments.length,
      lessonsCount: c.modules.reduce((sum, m) => sum + m.lessons.length, 0),
      curriculum: c.modules.map((m) => ({
        id: m.id,
        title: m.title,
        lessons: m.lessons.map((l) => {
          let parsedQuestions: any[] = [];
          if (l.quizData?.options) {
            if (Array.isArray(l.quizData.options)) {
              if (
                l.quizData.options.length > 0 &&
                typeof l.quizData.options[0] === "object" &&
                l.quizData.options[0] !== null &&
                "question" in (l.quizData.options[0] as any)
              ) {
                parsedQuestions = l.quizData.options as any[];
              } else {
                parsedQuestions = [
                  {
                    id: 1,
                    question: l.quizData.question,
                    options: l.quizData.options,
                    correctIndex: l.quizData.correctIndex ?? 0,
                    points: 10,
                  },
                ];
              }
            } else if (
              typeof l.quizData.options === "object" &&
              l.quizData.options !== null &&
              "questions" in (l.quizData.options as any)
            ) {
              parsedQuestions = ((l.quizData.options as any).questions as any[]) || [];
            }
          }

          return {
            id: l.id,
            title: l.title,
            durationMin: l.durationMins,
            type: l.type,
            videoUrl: l.videoUrl || undefined,
            readingBody: l.readingBody || undefined,
            attachmentUrl: l.attachmentUrl || undefined,
            quizQuestion: parsedQuestions[0]?.question || l.quizData?.question || undefined,
            quizOptions: parsedQuestions[0]?.options || (Array.isArray(l.quizData?.options) ? (l.quizData?.options as string[]) : undefined),
            quizCorrectIndex: parsedQuestions[0]?.correctIndex ?? l.quizData?.correctIndex ?? undefined,
            quizQuestions: parsedQuestions.length > 0 ? parsedQuestions : undefined,
            completed: false,
            locked: false,
          };
        }),
      })),
      createdAt: c.createdAt,
    }));

    return NextResponse.json({ courses: formatted });
  } catch (error) {
    console.error("GET /api/admin/courses error:", error);
    return NextResponse.json({ message: "Failed to fetch courses from PostgreSQL." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, level, price, isFree, status, instructorId, durationHours, thumbnailUrl, curriculum } = body;

    if (!title || !category) {
      return NextResponse.json({ message: "Course title and category required." }, { status: 400 });
    }

    // Slug generation
    let slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Ensure instructorId exists in PostgreSQL DB
    let validInstructorId: string | null = null;
    if (instructorId) {
      const existingInst = await prisma.instructor.findUnique({
        where: { id: instructorId },
      });
      if (existingInst) {
        validInstructorId = existingInst.id;
      }
    }

    if (!validInstructorId) {
      const firstInst = await prisma.instructor.findFirst();
      if (firstInst) {
        validInstructorId = firstInst.id;
      } else {
        const newInst = await prisma.instructor.create({
          data: {
            name: "Dr. Sarah Jenkins",
            title: "Senior Educator",
            bio: "Lead Instructor at UNIGAP",
            avatar: "SJ",
          },
        });
        validInstructorId = newInst.id;
      }
    }

    // Ensure slug uniqueness
    const existingCourse = await prisma.course.findUnique({ where: { slug } });
    if (existingCourse) {
      slug = `${slug}-${Date.now()}`;
    }

    const created = await prisma.course.create({
      data: {
        title: title.trim(),
        slug: slug || `course-${Date.now()}`,
        description: description?.trim() || title,
        shortDesc: description?.trim() || title,
        category: category.trim(),
        level: level || "Beginner",
        price: isFree ? 0 : Number(price) || 0,
        isFree: Boolean(isFree || Number(price) === 0),
        status: status || "Published",
        isPublished: status !== "Draft",
        instructorId: validInstructorId,
        durationHours: Number(durationHours) || 10,
        thumbnailUrl: thumbnailUrl ? thumbnailUrl.trim() : null,
        modules: Array.isArray(curriculum) && curriculum.length > 0
          ? {
              create: curriculum.map((mod: any, mIdx: number) => ({
                title: mod.title || `Module ${mIdx + 1}`,
                orderIndex: mIdx + 1,
                lessons: Array.isArray(mod.lessons)
                  ? {
                      create: mod.lessons.map((les: any, lIdx: number) => ({
                        title: les.title || `Lesson ${lIdx + 1}`,
                        type: les.type === "quiz" ? "quiz" : les.type === "reading" ? "reading" : "video",
                        durationMins: Number(les.durationMin) || 10,
                        videoUrl: les.videoUrl || null,
                        readingBody: les.readingBody || null,
                        attachmentUrl: les.attachmentUrl || null,
                        orderIndex: lIdx + 1,
                        ...(les.type === "quiz" && (les.quizQuestion || les.quizQuestions?.length)
                          ? {
                              quiz: {
                                create: {
                                  question: les.quizQuestions?.[0]?.question || les.quizQuestion || "Quiz Assessment",
                                  options:
                                    Array.isArray(les.quizQuestions) && les.quizQuestions.length > 0
                                      ? les.quizQuestions
                                      : [
                                          {
                                            id: 1,
                                            question: les.quizQuestion,
                                            options: les.quizOptions || ["Option A", "Option B", "Option C", "Option D"],
                                            correctIndex: Number(les.quizCorrectIndex) || 0,
                                            points: 10,
                                          },
                                        ],
                                  correctIndex: Number(les.quizQuestions?.[0]?.correctIndex ?? les.quizCorrectIndex) || 0,
                                  xpReward: (les.quizQuestions?.length || 1) * 25,
                                },
                              },
                            }
                          : {}),
                      })),
                    }
                  : undefined,
              })),
            }
          : undefined,
      },
      include: {
        instructor: true,
        modules: {
          include: {
            lessons: {
              include: {
                quizData: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      message: "Course created successfully in PostgreSQL database.",
      course: created,
    });
  } catch (error) {
    console.error("POST /api/admin/courses error:", error);
    return NextResponse.json({ message: "Failed to create course in PostgreSQL." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, category, level, price, isFree, status, instructorId, durationHours, thumbnailUrl, curriculum } = body;

    if (!id && !title) {
      return NextResponse.json({ message: "Course ID or title required for editing." }, { status: 400 });
    }

    // Resolve real course in DB by ID, slug, or title
    let targetCourse = id ? await prisma.course.findUnique({ where: { id } }).catch(() => null) : null;
    if (!targetCourse) {
      targetCourse = await prisma.course.findFirst({
        where: {
          OR: [
            ...(id ? [{ id }, { slug: id }, { slug: String(id).toLowerCase() }] : []),
            ...(title ? [{ title: { equals: title.trim(), mode: "insensitive" as const } }] : []),
            ...(title ? [{ slug: title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") }] : []),
          ],
        },
      });
    }

    if (!targetCourse) {
      return NextResponse.json({ message: `Course not found in database for id: ${id || title}` }, { status: 404 });
    }

    const realCourseId = targetCourse.id;

    // 1. Update top-level course fields
    const updated = await prisma.course.update({
      where: { id: realCourseId },
      data: {
        ...(title ? { title: title.trim() } : {}),
        ...(description ? { description: description.trim(), shortDesc: description.trim() } : {}),
        ...(category ? { category: category.trim() } : {}),
        ...(level ? { level } : {}),
        ...(price !== undefined ? { price: isFree ? 0 : Number(price) } : {}),
        ...(isFree !== undefined ? { isFree: Boolean(isFree) } : {}),
        ...(status ? { status, isPublished: status !== "Draft" } : {}),
        ...(instructorId ? { instructorId } : {}),
        ...(durationHours !== undefined ? { durationHours: Number(durationHours) } : {}),
        ...(thumbnailUrl !== undefined ? { thumbnailUrl: thumbnailUrl ? thumbnailUrl.trim() : null } : {}),
      },
      include: { instructor: true },
    });

    // 2. Sync curriculum — delete all existing modules (cascades to lessons + quizData)
    //    then recreate from the admin editor payload so students always see live changes.
    if (Array.isArray(curriculum)) {
      // Fetch existing module IDs so we can delete their quizData first (if needed)
      const existingModules = await prisma.module.findMany({
        where: { courseId: realCourseId },
        include: { lessons: { include: { quizData: true } } },
      });

      // Delete quizData → lessons → modules in order
      for (const mod of existingModules) {
        for (const les of mod.lessons) {
          if (les.quizData) {
            await prisma.quiz.delete({ where: { lessonId: les.id } }).catch(() => {});
          }
          await prisma.lesson.delete({ where: { id: les.id } }).catch(() => {});
        }
        await prisma.module.delete({ where: { id: mod.id } }).catch(() => {});
      }

      // Recreate modules and lessons from the admin payload
      for (let mIdx = 0; mIdx < curriculum.length; mIdx++) {
        const mod = curriculum[mIdx];
        const createdModule = await prisma.module.create({
          data: {
            courseId: realCourseId,
            title: mod.title || `Module ${mIdx + 1}`,
            orderIndex: mIdx + 1,
          },
        });

        if (Array.isArray(mod.lessons)) {
          for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
            const les = mod.lessons[lIdx];
            const lessonType: "video" | "reading" | "quiz" =
              les.type === "quiz" || les.type === "Quiz"
                ? "quiz"
                : les.type === "reading" || les.type === "Article"
                ? "reading"
                : "video";

            const createdLesson = await prisma.lesson.create({
              data: {
                moduleId: createdModule.id,
                title: les.title || `Lesson ${lIdx + 1}`,
                type: lessonType,
                durationMins: Number(les.durationMin) || 10,
                videoUrl: les.videoUrl || null,
                readingBody: les.readingBody || null,
                attachmentUrl: les.attachmentUrl || null,
                orderIndex: lIdx + 1,
              },
            });

            // Create quiz if applicable
            if (lessonType === "quiz" && (les.quizQuestion || les.quizQuestions?.length)) {
              const questionsToSave =
                Array.isArray(les.quizQuestions) && les.quizQuestions.length > 0
                  ? les.quizQuestions
                  : [
                      {
                        id: 1,
                        question: les.quizQuestion,
                        options: les.quizOptions || ["Option A", "Option B", "Option C", "Option D"],
                        correctIndex: Number(les.quizCorrectIndex) || 0,
                        points: 10,
                      },
                    ];
              const firstQ = questionsToSave[0];
              await prisma.quiz.create({
                data: {
                  lessonId: createdLesson.id,
                  question: firstQ.question || les.quizQuestion || "Quiz Assessment",
                  options: questionsToSave,
                  correctIndex: Number(firstQ.correctIndex ?? les.quizCorrectIndex) || 0,
                  xpReward: questionsToSave.length * 25,
                },
              });
            }
          }
        }
      }
    }

    return NextResponse.json({
      message: "Course and curriculum updated in PostgreSQL database.",
      course: updated,
    });
  } catch (error) {
    console.error("PATCH /api/admin/courses error:", error);
    return NextResponse.json({ message: "Failed to update course in PostgreSQL." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Course ID is required." }, { status: 400 });
    }

    // Cascade deletion of course + all enrollments + modules + lessons + certificates
    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Course and all associated enrollments, modules, and certificates permanently deleted from PostgreSQL.",
    });
  } catch (error) {
    console.error("DELETE /api/admin/courses error:", error);
    return NextResponse.json({ message: "Failed to delete course from PostgreSQL." }, { status: 500 });
  }
}
