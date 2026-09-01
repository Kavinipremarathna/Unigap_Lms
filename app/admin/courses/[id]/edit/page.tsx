"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Video,
  FileText,
  HelpCircle,
  Eye,
  EyeOff,
  BookOpen,
  Upload,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminAuth } from "@/lib/context/admin-auth-context";
import { getStoredCourses, saveCustomCourse } from "@/lib/mock/courses";
import { getStoredInstructors } from "@/lib/mock/instructors";
import { Course, Level } from "@/lib/types";

type LessonType = "Video" | "Article" | "Quiz";

export type QuizQuestion = {
  id: string | number;
  question: string;
  options: string[];
  correctIndex: number;
  points?: number;
};

type Lesson = {
  id: number;
  title: string;
  type: LessonType;
  duration: string;
  published: boolean;
  videoUrl?: string;
  readingBody?: string;
  attachmentUrl?: string;
  quizQuestion?: string;
  quizOptions?: string[];
  quizCorrectIndex?: number;
  quizQuestions?: QuizQuestion[];
};

type Module = {
  id: number;
  title: string;
  lessons: Lesson[];
};

const initialModules: Module[] = [
  {
    id: 1,
    title: "Getting Started with React",
    lessons: [
      {
        id: 1,
        title: "What is React?",
        type: "Video",
        duration: "12 min",
        published: true,
      },
      {
        id: 2,
        title: "Setting Up Your Development Environment",
        type: "Video",
        duration: "18 min",
        published: true,
      },
      {
        id: 3,
        title: "Your First React Component",
        type: "Article",
        duration: "10 min",
        published: true,
      },
    ],
  },
  {
    id: 2,
    title: "React Components",
    lessons: [
      {
        id: 4,
        title: "Functional Components",
        type: "Video",
        duration: "20 min",
        published: true,
      },
      {
        id: 5,
        title: "Props and Component Communication",
        type: "Video",
        duration: "25 min",
        published: true,
      },
      {
        id: 6,
        title: "Components Quiz",
        type: "Quiz",
        duration: "10 min",
        published: true,
      },
    ],
  },
];

export default function AdminCourseEditorPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;
  const { addActivity } = useAdminAuth();

  const [existingCourse, setExistingCourse] = useState<Course | null>(null);
  const [allInstructors, setAllInstructors] = useState<string[]>([]);
  const [title, setTitle] = useState("React Fundamentals");
  const [description, setDescription] = useState(
    "Learn React from the fundamentals to building modern interactive applications."
  );
  const [instructor, setInstructor] = useState("Alexander Reed");
  const [category, setCategory] = useState("Web Development");
  const [level, setLevel] = useState<Level>("Beginner");
  const [price, setPrice] = useState("49");
  const [status, setStatus] = useState<"Published" | "Draft">("Published");
  const [thumbnail, setThumbnail] = useState("");
  const [objectives, setObjectives] = useState([
    "Understand the fundamentals of React",
    "Build reusable React components",
    "Manage state and component data",
    "Build modern interactive interfaces",
  ]);
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [expandedModules, setExpandedModules] = useState<number[]>([1, 2]);

  useEffect(() => {
    const loadedInstructors = getStoredInstructors().map((i) => i.name);
    setAllInstructors(loadedInstructors);

    if (!courseId) return;

    const loadData = async () => {
      let found: any = null;
      try {
        const res = await fetch("/api/admin/courses");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.courses)) {
            found = data.courses.find(
              (c: any) =>
                String(c.id) === String(courseId) ||
                c.slug === courseId ||
                c.slug?.toLowerCase() === String(courseId).toLowerCase() ||
                c.title?.toLowerCase() === String(courseId).toLowerCase()
            );
          }
        }
      } catch (err) {
        console.error("Load course error:", err);
      }

      if (!found) {
        const all = getStoredCourses();
        found =
          all.find((c) => c.id === courseId || c.slug === courseId) ||
          all[parseInt(courseId) - 1] ||
          all[0];
      }

      if (found) {
        setExistingCourse(found);
        setTitle(found.title);
        setDescription(found.description || found.shortDescription || "");
        setInstructor(found.instructorName || found.instructorId || "Alexander Reed");
        setCategory(found.category || "Civil Engineering");
        setLevel(found.level || "Beginner");
        setPrice(found.isFree ? "0" : String(found.price || 0));
        setStatus(found.status || (found.isPublished === false ? "Draft" : "Published"));
        setObjectives(
          found.outcomes?.length ? found.outcomes : ["Master core concepts"]
        );
        if (found.curriculum?.length) {
          setModules(
            found.curriculum.map((m: any, mi: number) => ({
              id: mi + 1,
              title: m.title,
              lessons: m.lessons.map((l: any, li: number) => {
                const defaultQuizQuestions: QuizQuestion[] =
                  Array.isArray(l.quizQuestions) && l.quizQuestions.length > 0
                    ? l.quizQuestions.map((q: any, qi: number) => ({
                        id: q.id || qi + 1,
                        question: q.question || "",
                        options: Array.isArray(q.options) && q.options.length > 0 ? q.options : ["Option A", "Option B", "Option C", "Option D"],
                        correctIndex: Number(q.correctIndex) || 0,
                        points: Number(q.points) || 10,
                      }))
                    : [
                        {
                          id: 1,
                          question: l.quizQuestion || "",
                          options: Array.isArray(l.quizOptions) && l.quizOptions.length > 0 ? l.quizOptions : ["Option A", "Option B", "Option C", "Option D"],
                          correctIndex: Number(l.quizCorrectIndex) || 0,
                          points: 10,
                        },
                      ];

                return {
                  id: li + 1,
                  title: l.title,
                  type: (l.type === "quiz" || l.type === "Quiz"
                    ? "Quiz"
                    : l.type === "reading" || l.type === "Article"
                    ? "Article"
                    : "Video") as LessonType,
                  duration: `${l.durationMin || 10} min`,
                  published: !l.locked,
                  videoUrl: l.videoUrl || undefined,
                  readingBody: l.readingBody || undefined,
                  attachmentUrl: l.attachmentUrl || undefined,
                  quizQuestion: l.quizQuestion || undefined,
                  quizOptions: l.quizOptions || undefined,
                  quizCorrectIndex: l.quizCorrectIndex ?? undefined,
                  quizQuestions: defaultQuizQuestions,
                };
              }),
            }))
          );
        }
      }
    };

    loadData();
  }, [courseId]);

  const saveCourse = async (overrideStatus?: "Published" | "Draft") => {
    const finalStatus = overrideStatus || status;
    const numPrice = Number(price) || 0;
    const targetId = existingCourse?.id || courseId;
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const updatedCourse: Course = {
      id: targetId,
      slug: existingCourse?.slug || slug || `course-${Date.now()}`,
      title: title.trim() || "Untitled Course",
      shortDescription: description.slice(0, 140) || "No description provided.",
      description: description,
      category: category,
      level: level,
      durationHours: existingCourse?.durationHours || 12,
      rating: existingCourse?.rating || 5.0,
      reviewCount: existingCourse?.reviewCount || 1,
      learners: existingCourse?.learners || 1,
      price: numPrice,
      isFree: numPrice === 0,
      status: finalStatus,
      isPublished: finalStatus === "Published",
      instructorId: existingCourse?.instructorId || "ins-1",
      instructorName: instructor || "Alexander Reed",
      gradient: existingCourse?.gradient || ["#520051", "#920090"],
      outcomes: objectives.filter((o) => o.trim().length > 0),
      requirements: existingCourse?.requirements || ["Standard computer and internet"],
      curriculum: modules.map((m, mi) => ({
        id: `mod-${mi + 1}`,
        title: m.title,
        lessons: m.lessons.map((l, li) => {
          const firstQ = l.quizQuestions?.[0];
          return {
            id: `mod-${mi + 1}-lesson-${li + 1}`,
            title: l.title,
            durationMin: parseInt(l.duration) || 10,
            type: l.type === "Quiz" ? "quiz" : l.type === "Article" ? "reading" : "video",
            videoUrl: l.videoUrl || undefined,
            readingBody: l.readingBody || undefined,
            attachmentUrl: l.attachmentUrl || undefined,
            quizQuestion: firstQ?.question || l.quizQuestion || undefined,
            quizOptions: firstQ?.options || l.quizOptions || undefined,
            quizCorrectIndex: firstQ?.correctIndex ?? l.quizCorrectIndex ?? 0,
            quizQuestions: l.quizQuestions,
            completed: false,
            locked: !l.published,
          };
        }),
      })),
    };

    try {
      const res = await fetch("/api/admin/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: targetId,
          title: updatedCourse.title,
          description: updatedCourse.description,
          category: updatedCourse.category,
          level: updatedCourse.level,
          price: updatedCourse.price,
          isFree: updatedCourse.isFree,
          status: finalStatus,
          instructorId: updatedCourse.instructorId,
          durationHours: updatedCourse.durationHours,
          curriculum: updatedCourse.curriculum,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("PATCH failed:", errData);
        alert(`Server error: ${errData.message || "Failed to update course in database"}`);
        return;
      }

      alert(`Course "${title}" updated in PostgreSQL database! Changes are live.`);
    } catch (err) {
      console.error("PATCH /api/admin/courses error:", err);
      alert(`Network error: ${err}`);
      return;
    }

    saveCustomCourse(updatedCourse);
    addActivity("Updated Course", `Course: ${title} (${finalStatus})`);
    router.push("/admin/courses");
  };

  const toggleModule = (id: number) => {
    setExpandedModules((current) =>
      current.includes(id)
        ? current.filter((moduleId) => moduleId !== id)
        : [...current, id]
    );
  };

  const addModule = () => {
    const newModule: Module = {
      id: Date.now(),
      title: "New Module",
      lessons: [],
    };

    setModules((current) => [...current, newModule]);

    setExpandedModules((current) => [
      ...current,
      newModule.id,
    ]);
  };

  const updateModuleTitle = (
    moduleId: number,
    value: string
  ) => {
    setModules((current) =>
      current.map((module) =>
        module.id === moduleId
          ? { ...module, title: value }
          : module
      )
    );
  };

  const deleteModule = (moduleId: number) => {
    const confirmed = window.confirm(
      "Delete this module and all of its lessons?"
    );

    if (!confirmed) return;

    setModules((current) =>
      current.filter((module) => module.id !== moduleId)
    );
  };

  const addLesson = (moduleId: number) => {
    const title = window.prompt(
      "Enter the lesson title:"
    );

    if (!title?.trim()) return;

    const lesson: Lesson = {
      id: Date.now(),
      title: title.trim(),
      type: "Video",
      duration: "10 min",
      published: false,
    };

    setModules((current) =>
      current.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: [...module.lessons, lesson],
            }
          : module
      )
    );
  };

  const updateLessonTitle = (moduleId: number, lessonId: number, value: string) => {
    setModules((current) =>
      current.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, title: value } : lesson
              ),
            }
          : module
      )
    );
  };

  const updateLessonType = (moduleId: number, lessonId: number, value: LessonType) => {
    setModules((current) =>
      current.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, type: value } : lesson
              ),
            }
          : module
      )
    );
  };

  const updateLessonDuration = (moduleId: number, lessonId: number, value: string) => {
    setModules((current) =>
      current.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, duration: value } : lesson
              ),
            }
          : module
      )
    );
  };

  const updateLessonField = (moduleId: number, lessonId: number, field: keyof Lesson, value: any) => {
    setModules((current) =>
      current.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
              ),
            }
          : module
      )
    );
  };

  const deleteLesson = (
    moduleId: number,
    lessonId: number
  ) => {
    setModules((current) =>
      current.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.filter(
                (lesson) => lesson.id !== lessonId
              ),
            }
          : module
      )
    );
  };

  const addQuizQuestion = (moduleId: number, lessonId: number) => {
    setModules((current) =>
      current.map((module) => {
        if (module.id !== moduleId) return module;
        return {
          ...module,
          lessons: module.lessons.map((lesson) => {
            if (lesson.id !== lessonId) return lesson;
            const currentQuestions: QuizQuestion[] =
              lesson.quizQuestions && lesson.quizQuestions.length > 0
                ? lesson.quizQuestions
                : lesson.quizQuestion
                ? [
                    {
                      id: 1,
                      question: lesson.quizQuestion,
                      options: lesson.quizOptions || ["Option A", "Option B", "Option C", "Option D"],
                      correctIndex: lesson.quizCorrectIndex ?? 0,
                      points: 10,
                    },
                  ]
                : [];
            const newQ: QuizQuestion = {
              id: Date.now(),
              question: "",
              options: ["Option A", "Option B", "Option C", "Option D"],
              correctIndex: 0,
              points: 10,
            };
            return {
              ...lesson,
              quizQuestions: [...currentQuestions, newQ],
            };
          }),
        };
      })
    );
  };

  const updateQuizQuestionField = (
    moduleId: number,
    lessonId: number,
    qIdx: number,
    field: "question" | "points",
    value: any
  ) => {
    setModules((current) =>
      current.map((module) => {
        if (module.id !== moduleId) return module;
        return {
          ...module,
          lessons: module.lessons.map((lesson) => {
            if (lesson.id !== lessonId) return lesson;
            const questions = [...(lesson.quizQuestions || [])];
            if (questions[qIdx]) {
              questions[qIdx] = { ...questions[qIdx], [field]: value };
            }
            return { ...lesson, quizQuestions: questions };
          }),
        };
      })
    );
  };

  const updateQuizOptionText = (
    moduleId: number,
    lessonId: number,
    qIdx: number,
    optIdx: number,
    value: string
  ) => {
    setModules((current) =>
      current.map((module) => {
        if (module.id !== moduleId) return module;
        return {
          ...module,
          lessons: module.lessons.map((lesson) => {
            if (lesson.id !== lessonId) return lesson;
            const questions = [...(lesson.quizQuestions || [])];
            if (questions[qIdx]) {
              const opts = [...questions[qIdx].options];
              opts[optIdx] = value;
              questions[qIdx] = { ...questions[qIdx], options: opts };
            }
            return { ...lesson, quizQuestions: questions };
          }),
        };
      })
    );
  };

  const setQuizCorrectAnswer = (
    moduleId: number,
    lessonId: number,
    qIdx: number,
    optIdx: number
  ) => {
    setModules((current) =>
      current.map((module) => {
        if (module.id !== moduleId) return module;
        return {
          ...module,
          lessons: module.lessons.map((lesson) => {
            if (lesson.id !== lessonId) return lesson;
            const questions = [...(lesson.quizQuestions || [])];
            if (questions[qIdx]) {
              questions[qIdx] = { ...questions[qIdx], correctIndex: optIdx };
            }
            return { ...lesson, quizQuestions: questions };
          }),
        };
      })
    );
  };

  const deleteQuizQuestion = (
    moduleId: number,
    lessonId: number,
    qIdx: number
  ) => {
    setModules((current) =>
      current.map((module) => {
        if (module.id !== moduleId) return module;
        return {
          ...module,
          lessons: module.lessons.map((lesson) => {
            if (lesson.id !== lessonId) return lesson;
            const questions = [...(lesson.quizQuestions || [])].filter((_, idx) => idx !== qIdx);
            return { ...lesson, quizQuestions: questions };
          }),
        };
      })
    );
  };

  const addQuizOption = (
    moduleId: number,
    lessonId: number,
    qIdx: number
  ) => {
    setModules((current) =>
      current.map((module) => {
        if (module.id !== moduleId) return module;
        return {
          ...module,
          lessons: module.lessons.map((lesson) => {
            if (lesson.id !== lessonId) return lesson;
            const questions = [...(lesson.quizQuestions || [])];
            if (questions[qIdx]) {
              const letter = String.fromCharCode(65 + questions[qIdx].options.length);
              questions[qIdx] = {
                ...questions[qIdx],
                options: [...questions[qIdx].options, `Option ${letter}`],
              };
            }
            return { ...lesson, quizQuestions: questions };
          }),
        };
      })
    );
  };

  const deleteQuizOption = (
    moduleId: number,
    lessonId: number,
    qIdx: number,
    optIdx: number
  ) => {
    setModules((current) =>
      current.map((module) => {
        if (module.id !== moduleId) return module;
        return {
          ...module,
          lessons: module.lessons.map((lesson) => {
            if (lesson.id !== lessonId) return lesson;
            const questions = [...(lesson.quizQuestions || [])];
            if (questions[qIdx] && questions[qIdx].options.length > 2) {
              const opts = questions[qIdx].options.filter((_, i) => i !== optIdx);
              let nextCorrect = questions[qIdx].correctIndex;
              if (nextCorrect === optIdx) nextCorrect = 0;
              else if (nextCorrect > optIdx) nextCorrect -= 1;
              questions[qIdx] = { ...questions[qIdx], options: opts, correctIndex: nextCorrect };
            }
            return { ...lesson, quizQuestions: questions };
          }),
        };
      })
    );
  };

  const toggleLessonPublished = (
    moduleId: number,
    lessonId: number
  ) => {
    setModules((current) =>
      current.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId
                  ? {
                      ...lesson,
                      published: !lesson.published,
                    }
                  : lesson
              ),
            }
          : module
      )
    );
  };

  const addObjective = () => {
    setObjectives((current) => [
      ...current,
      "New learning objective",
    ]);
  };

  const updateObjective = (
    index: number,
    value: string
  ) => {
    setObjectives((current) =>
      current.map((objective, i) =>
        i === index ? value : objective
      )
    );
  };

  const deleteObjective = (index: number) => {
    setObjectives((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  return (
    <AdminShell>
      <main className="px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/courses"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#920090]"
            >
              <ArrowLeft size={16} />
              Back to Courses
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#520051] to-[#d400d1] text-white">
                <BookOpen size={22} />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-[#520051]">
                  Edit Course
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage course information and curriculum.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/courses/${existingCourse?.slug || "react-development"}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Eye size={17} />
              Preview
            </Link>

            <button
              type="button"
              onClick={() => saveCourse()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#520051] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#920090]"
            >
              <Save size={17} />
              Save Course
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#eee5ee] bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                status === "Published"
                  ? "bg-green-500"
                  : "bg-amber-500"
              }`}
            />

            <span className="text-sm font-semibold text-[#520051]">
              Course Status
            </span>

            <select
              value={status}
              onChange={(e) => {
                const next = e.target.value as "Published" | "Draft";
                setStatus(next);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold outline-none focus:border-[#920090]"
            >
              <option value="Published">
                Published
              </option>

              <option value="Draft">
                Draft
              </option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = status === "Published" ? "Draft" : "Published";
              setStatus(next);
              saveCourse(next);
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#920090]"
          >
            {status === "Published" ? (
              <>
                <EyeOff size={16} />
                Unpublish Course
              </>
            ) : (
              <>
                <Eye size={16} />
                Publish Course
              </>
            )}
          </button>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          {/* Main */}
          <div className="space-y-6 xl:col-span-2">
            {/* Basic information */}
            <section className="rounded-2xl border border-[#eee5ee] bg-white p-6 shadow-sm">
              <SectionTitle
                title="Course Information"
                description="Edit the main information displayed to learners."
              />

              <div className="mt-6 space-y-5">
                <Input
                  label="Course Title"
                  value={title}
                  onChange={setTitle}
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#520051]">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    rows={5}
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-relaxed outline-none focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Select
                    label="Instructor"
                    value={instructor}
                    onChange={setInstructor}
                    options={
                      allInstructors.length > 0
                        ? Array.from(new Set([instructor, ...allInstructors]))
                        : ["Maya Okonkwo", "Daniel Cho", "Alexander Reed"]
                    }
                  />

                  <Select
                    label="Category"
                    value={category}
                    onChange={setCategory}
                    options={[
                      "Web Development",
                      "Cloud",
                      "Design",
                      "Data Science",
                      "AI & Machine Learning",
                      "Cybersecurity",
                    ]}
                  />

                  <Select
                    label="Level"
                    value={level}
                    onChange={(value) =>
                      setLevel(
                        value as
                          | "Beginner"
                          | "Intermediate"
                          | "Advanced"
                      )
                    }
                    options={[
                      "Beginner",
                      "Intermediate",
                      "Advanced",
                    ]}
                  />

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#520051]">
                      Price
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        $
                      </span>

                      <input
                        type="number"
                        min="0"
                        value={price}
                        onChange={(e) =>
                          setPrice(e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 py-3 pl-8 pr-4 text-sm outline-none focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Thumbnail */}
            <section className="rounded-2xl border border-[#eee5ee] bg-white p-6 shadow-sm">
              <SectionTitle
                title="Course Thumbnail"
                description="Add the image that represents this course."
              />

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div className="flex min-h-[180px] items-center justify-center rounded-2xl bg-gradient-to-br from-[#520051] to-[#d400d1] text-white">
                  <div className="text-center">
                    <BookOpen
                      size={38}
                      className="mx-auto opacity-80"
                    />

                    <p className="mt-3 text-sm font-semibold">
                      Course Preview
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#520051]">
                    Thumbnail URL
                  </label>

                  <input
                    value={thumbnail}
                    onChange={(e) =>
                      setThumbnail(e.target.value)
                    }
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10"
                  />

                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    In the production version, this can be replaced
                    with an image upload.
                  </p>
                </div>
              </div>
            </section>

            {/* Learning objectives */}
            <section className="rounded-2xl border border-[#eee5ee] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <SectionTitle
                  title="Learning Objectives"
                  description="What learners should be able to achieve."
                />

                <button
                  type="button"
                  onClick={addObjective}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#920090]/20 bg-[#f7ddf7] px-3 py-2 text-xs font-semibold text-[#920090] hover:bg-[#f1cef1]"
                >
                  <Plus size={15} />
                  Add
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {objectives.map(
                  (objective, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f7ddf7] text-xs font-bold text-[#920090]">
                        {index + 1}
                      </span>

                      <input
                        value={objective}
                        onChange={(e) =>
                          updateObjective(
                            index,
                            e.target.value
                          )
                        }
                        className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#920090]"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          deleteObjective(index)
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Curriculum */}
            <section className="rounded-2xl border border-[#eee5ee] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <SectionTitle
                  title="Course Curriculum"
                  description="Manage modules, lessons and quizzes."
                />

                <button
                  type="button"
                  onClick={addModule}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#520051] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#920090]"
                >
                  <Plus size={15} />
                  Add Module
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {modules.map((module, moduleIndex) => {
                  const expanded =
                    expandedModules.includes(module.id);

                  return (
                    <div
                      key={module.id}
                      className="overflow-hidden rounded-2xl border border-slate-200"
                    >
                      {/* Module header */}
                      <div className="flex items-center gap-3 bg-[#faf7fb] p-4">
                        <GripVertical
                          size={18}
                          className="shrink-0 text-slate-300"
                        />

                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f7ddf7] text-xs font-bold text-[#920090]">
                          {moduleIndex + 1}
                        </span>

                        <input
                          value={module.title}
                          onChange={(e) =>
                            updateModuleTitle(
                              module.id,
                              e.target.value
                            )
                          }
                          className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-sm font-semibold text-[#520051] outline-none focus:border-slate-200 focus:bg-white"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            toggleModule(module.id)
                          }
                          className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-[#920090]"
                        >
                          {expanded ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteModule(module.id)
                          }
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Lessons */}
                      {expanded && (
                        <div className="p-4 space-y-4">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3"
                            >
                              <div className="grid gap-2.5 md:grid-cols-[auto_1fr_130px_100px_auto_auto] items-center">
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#faf5fa] text-xs font-extrabold text-[#520051] border border-[#eee5ee]">
                                  {moduleIndex + 1}.{lessonIndex + 1}
                                </span>

                                <input
                                  value={lesson.title}
                                  onChange={(e) =>
                                    updateLessonTitle(
                                      module.id,
                                      lesson.id,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Lesson Title..."
                                  className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-[#920090] font-semibold text-[#520051]"
                                />

                                <select
                                  value={lesson.type}
                                  onChange={(e) =>
                                    updateLessonType(
                                      module.id,
                                      lesson.id,
                                      e.target.value as LessonType
                                    )
                                  }
                                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#520051] outline-none"
                                >
                                  <option value="Video">🎥 Video</option>
                                  <option value="Article">📄 Article</option>
                                  <option value="Quiz">❓ Quiz</option>
                                </select>

                                <input
                                  value={lesson.duration}
                                  onChange={(e) =>
                                    updateLessonDuration(
                                      module.id,
                                      lesson.id,
                                      e.target.value
                                    )
                                  }
                                  placeholder="e.g. 10 min"
                                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#920090]"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleLessonPublished(
                                      module.id,
                                      lesson.id
                                    )
                                  }
                                  className={`rounded-xl px-2.5 py-1 text-xs font-bold transition ${
                                    lesson.published
                                      ? "bg-green-50 text-green-700 border border-green-200"
                                      : "bg-slate-100 text-slate-500 border border-slate-200"
                                  }`}
                                >
                                  {lesson.published ? "Published" : "Draft"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteLesson(module.id, lesson.id)
                                  }
                                  className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition cursor-pointer"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>

                              {/* Upload & Resource Configuration Controls */}
                              <div className="rounded-xl bg-[#faf5fa] p-3.5 border border-[#eee5ee] text-xs space-y-3">
                                {lesson.type === "Video" && (
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between font-bold text-[#520051]">
                                      <span>🎥 Video Content (Link URL or Direct Video Upload)</span>
                                      <span className="text-[10px] text-[#920090] font-mono">MP4, WebM, YouTube, Vimeo</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <input
                                        type="text"
                                        value={lesson.videoUrl || ""}
                                        onChange={(e) => updateLessonField(module.id, lesson.id, "videoUrl", e.target.value)}
                                        placeholder="Paste video URL link (e.g. https://youtube.com/embed/... or MP4 link)"
                                        className="flex-1 min-w-[200px] rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-[#920090]"
                                      />
                                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#520051] px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#920090] transition">
                                        <Upload size={13} /> Upload Video File
                                        <input
                                          type="file"
                                          accept="video/*"
                                          className="hidden"
                                          onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            updateLessonField(module.id, lesson.id, "videoUrl", "⏳ Uploading…");
                                            try {
                                              const fd = new FormData();
                                              fd.append("file", file);
                                              fd.append("title", lesson.title || file.name);
                                              const res = await fetch("/api/upload/video", { method: "POST", body: fd });
                                              const data = await res.json();
                                              if (!res.ok) throw new Error(data.message || "Upload failed");
                                              updateLessonField(module.id, lesson.id, "videoUrl", data.video.fileUrl);
                                            } catch (err: any) {
                                              updateLessonField(module.id, lesson.id, "videoUrl", "");
                                              alert(`Video upload failed: ${err.message}`);
                                            }
                                          }}
                                        />
                                      </label>
                                    </div>
                                    {lesson.videoUrl && (
                                      <p className="text-[11px] font-bold text-emerald-600">✓ Video Link/File set: {lesson.videoUrl}</p>
                                    )}
                                  </div>
                                )}

                                {lesson.type === "Article" && (
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between font-bold text-[#520051]">
                                      <span>📄 Article Content & Notes</span>
                                      <span className="text-[10px] text-[#920090] font-mono">Markdown, Text Notes</span>
                                    </div>
                                    <textarea
                                      rows={2}
                                      value={lesson.readingBody || ""}
                                      onChange={(e) => updateLessonField(module.id, lesson.id, "readingBody", e.target.value)}
                                      placeholder="Write or paste article lesson notes, reading guide, or instructions..."
                                      className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-[#920090]"
                                    />
                                  </div>
                                )}

                                {/* Note & File Attachment Control for All Lessons */}
                                <div className="pt-2 border-t border-slate-200/60 space-y-2">
                                  <div className="flex items-center justify-between font-bold text-[#520051]">
                                    <span>📎 Additional Note / Resource Attachment (Link URL or File Upload)</span>
                                    <span className="text-[10px] text-[#920090] font-mono">PDF, Zip, Slides, Notes</span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <input
                                      type="text"
                                      value={lesson.attachmentUrl || ""}
                                      onChange={(e) => updateLessonField(module.id, lesson.id, "attachmentUrl", e.target.value)}
                                      placeholder="Paste resource link URL (e.g. Google Drive, GitHub, PDF URL)..."
                                      className="flex-1 min-w-[200px] rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-[#920090]"
                                    />
                                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-[#520051] hover:bg-slate-50 transition">
                                      <Upload size={13} /> Upload Resource File
                                      <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.zip,.rar,.ppt,.pptx,.txt,.md"
                                        className="hidden"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (!file) return;
                                          updateLessonField(module.id, lesson.id, "attachmentUrl", "⏳ Uploading…");
                                          try {
                                            const fd = new FormData();
                                            fd.append("file", file);
                                            const res = await fetch("/api/upload/resource", { method: "POST", body: fd });
                                            const data = await res.json();
                                            if (!res.ok) throw new Error(data.message || "Upload failed");
                                            updateLessonField(module.id, lesson.id, "attachmentUrl", data.url);
                                          } catch (err: any) {
                                            updateLessonField(module.id, lesson.id, "attachmentUrl", "");
                                            alert(`Resource upload failed: ${err.message}`);
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
                                  {lesson.attachmentUrl && (
                                    <p className="text-[11px] font-bold text-emerald-600">✓ Attachment/Note set: {lesson.attachmentUrl}</p>
                                  )}
                                </div>

                                {lesson.type === "Quiz" && (
                                  <div className="pt-3 border-t border-slate-200/80 space-y-4">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div className="flex items-center gap-2">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#520051] text-white text-xs font-bold">❓</span>
                                        <span className="font-bold text-[#520051] text-xs">
                                          Quiz Assessment Configuration
                                        </span>
                                        <span className="rounded-full bg-[#f7ddf7] px-2.5 py-0.5 text-[10px] font-bold text-[#920090]">
                                          {(lesson.quizQuestions?.length || 1)} Question{(lesson.quizQuestions?.length || 1) > 1 ? "s" : ""}
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => addQuizQuestion(module.id, lesson.id)}
                                        className="inline-flex items-center gap-1 rounded-lg bg-[#520051] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#920090] transition shadow-2xs cursor-pointer"
                                      >
                                        <Plus size={12} /> Add Question
                                      </button>
                                    </div>

                                    {/* Questions List */}
                                    <div className="space-y-3">
                                      {((lesson.quizQuestions && lesson.quizQuestions.length > 0)
                                        ? lesson.quizQuestions
                                        : [
                                            {
                                              id: 1,
                                              question: lesson.quizQuestion || "",
                                              options: lesson.quizOptions || ["Option A", "Option B", "Option C", "Option D"],
                                              correctIndex: lesson.quizCorrectIndex ?? 0,
                                              points: 10,
                                            },
                                          ]
                                      ).map((q, qIdx) => (
                                        <div key={q.id || qIdx} className="rounded-xl border-2 border-purple-200/80 bg-white p-3.5 space-y-3 shadow-2xs">
                                          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                                            <div className="flex items-center gap-2">
                                              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#f7ddf7] text-xs font-extrabold text-[#920090]">
                                                Q{qIdx + 1}
                                              </span>
                                              <span className="font-bold text-xs text-[#520051]">Question Statement & Correct Answer</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                              <div className="flex items-center gap-1">
                                                <span className="text-[11px] font-semibold text-slate-500">Marks:</span>
                                                <input
                                                  type="number"
                                                  min="1"
                                                  max="100"
                                                  value={q.points || 10}
                                                  onChange={(e) => updateQuizQuestionField(module.id, lesson.id, qIdx, "points", Number(e.target.value) || 10)}
                                                  className="w-14 rounded-md border border-slate-200 px-2 py-0.5 text-xs font-bold text-[#520051] text-center outline-none focus:border-[#920090]"
                                                />
                                              </div>

                                              {(lesson.quizQuestions?.length || 0) > 1 && (
                                                <button
                                                  type="button"
                                                  onClick={() => deleteQuizQuestion(module.id, lesson.id, qIdx)}
                                                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition cursor-pointer"
                                                  title="Delete this question"
                                                >
                                                  <Trash2 size={14} />
                                                </button>
                                              )}
                                            </div>
                                          </div>

                                          <div>
                                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                              Question Title / Statement:
                                            </label>
                                            <input
                                              type="text"
                                              value={q.question || ""}
                                              onChange={(e) => updateQuizQuestionField(module.id, lesson.id, qIdx, "question", e.target.value)}
                                              placeholder={`Enter question ${qIdx + 1} statement (e.g. What is the minimum compressive strength for foundation concrete?)...`}
                                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium outline-none focus:border-[#920090]"
                                            />
                                          </div>

                                          {/* Options List */}
                                          <div className="space-y-1.5 pt-1">
                                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                                              <span>Answer Choices (Select radio to set the CORRECT answer for marks):</span>
                                              <button
                                                type="button"
                                                onClick={() => addQuizOption(module.id, lesson.id, qIdx)}
                                                className="text-[#920090] hover:underline font-bold text-[10px]"
                                              >
                                                + Add Option
                                              </button>
                                            </div>

                                            <div className="space-y-1.5">
                                              {q.options.map((opt, optIdx) => {
                                                const isCorrect = q.correctIndex === optIdx;
                                                const letter = String.fromCharCode(65 + optIdx);
                                                return (
                                                  <div
                                                    key={optIdx}
                                                    onClick={() => setQuizCorrectAnswer(module.id, lesson.id, qIdx, optIdx)}
                                                    className={`flex items-center gap-2 rounded-lg border p-2 text-xs transition cursor-pointer ${
                                                      isCorrect
                                                        ? "border-emerald-500 bg-emerald-50/80 shadow-2xs"
                                                        : "border-slate-200 bg-[#faf5fa]/40 hover:bg-slate-50"
                                                    }`}
                                                  >
                                                    {/* Radio Button */}
                                                    <input
                                                      type="radio"
                                                      name={`correct-${lesson.id}-${qIdx}`}
                                                      checked={isCorrect}
                                                      onChange={() => setQuizCorrectAnswer(module.id, lesson.id, qIdx, optIdx)}
                                                      className="h-4 w-4 accent-emerald-600 cursor-pointer"
                                                    />

                                                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold ${
                                                      isCorrect ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                                                    }`}>
                                                      {letter}
                                                    </span>

                                                    <input
                                                      type="text"
                                                      value={opt}
                                                      onClick={(e) => e.stopPropagation()}
                                                      onChange={(e) => updateQuizOptionText(module.id, lesson.id, qIdx, optIdx, e.target.value)}
                                                      placeholder={`Option ${letter} text...`}
                                                      className="flex-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-[#920090]"
                                                    />

                                                    {isCorrect ? (
                                                      <span className="shrink-0 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                                        ✓ Correct Answer (Marks Awarded)
                                                      </span>
                                                    ) : (
                                                      <button
                                                        type="button"
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          setQuizCorrectAnswer(module.id, lesson.id, qIdx, optIdx);
                                                        }}
                                                        className="shrink-0 text-[10px] font-semibold text-slate-400 hover:text-emerald-700"
                                                      >
                                                        Set Correct
                                                      </button>
                                                    )}

                                                    {q.options.length > 2 && (
                                                      <button
                                                        type="button"
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          deleteQuizOption(module.id, lesson.id, qIdx, optIdx);
                                                        }}
                                                        className="p-1 text-slate-300 hover:text-red-500 transition cursor-pointer"
                                                        title="Remove choice"
                                                      >
                                                        <Trash2 size={12} />
                                                      </button>
                                                    )}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() =>
                              addLesson(module.id)
                            }
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#920090]/30 py-3 text-xs font-semibold text-[#920090] hover:bg-[#faf7fb]"
                          >
                            <Plus size={15} />
                            Add Lesson
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right sidebar */}
          <aside className="space-y-6">
            {/* Course summary */}
            <section className="rounded-2xl border border-[#eee5ee] bg-white p-6 shadow-sm">
              <h2 className="font-bold text-[#520051]">
                Course Summary
              </h2>

              <div className="mt-5 space-y-4">
                <SummaryRow
                  label="Modules"
                  value={modules.length.toString()}
                />

                <SummaryRow
                  label="Lessons"
                  value={modules
                    .reduce(
                      (total, module) =>
                        total + module.lessons.length,
                      0
                    )
                    .toString()}
                />

                <SummaryRow
                  label="Objectives"
                  value={objectives.length.toString()}
                />

                <SummaryRow
                  label="Price"
                  value={
                    Number(price) === 0
                      ? "Free"
                      : `$${price}`
                  }
                />

                <SummaryRow
                  label="Level"
                  value={level}
                />
              </div>
            </section>

            {/* Quick actions */}
            <section className="rounded-2xl border border-[#eee5ee] bg-white p-6 shadow-sm">
              <h2 className="font-bold text-[#520051]">
                Quick Actions
              </h2>

              <div className="mt-5 space-y-2">
                <button
                  type="button"
                  onClick={() => saveCourse()}
                  className="flex w-full items-center gap-3 rounded-xl bg-[#520051] px-4 py-3 text-sm font-semibold text-white hover:bg-[#920090]"
                >
                  <Save size={17} />
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setStatus((current) =>
                      current === "Published"
                        ? "Draft"
                        : "Published"
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  {status === "Published" ? (
                    <>
                      <EyeOff size={17} />
                      Move to Draft
                    </>
                  ) : (
                    <>
                      <Eye size={17} />
                      Publish Course
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Warning */}
            <section className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-700">
                Publishing checklist
              </p>

              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-amber-700/80">
                <li>
                  ✓ Course title and description added
                </li>

                <li>
                  ✓ Instructor selected
                </li>

                <li>
                  ✓ Learning objectives added
                </li>

                <li>
                  ✓ Curriculum created
                </li>

                <li>
                  ⚠ Add a course thumbnail
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </main>
    </AdminShell>
  );
}

/* ---------------- Components ---------------- */

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="font-bold text-[#520051]">
        {title}
      </h2>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#520051]">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#520051]">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-[#520051]">
        {value}
      </span>
    </div>
  );
}

function LessonIcon({
  type,
}: {
  type: LessonType;
}) {
  if (type === "Video") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-[#920090]">
        <Video size={15} />
      </div>
    );
  }

  if (type === "Quiz") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
        <HelpCircle size={15} />
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
      <FileText size={15} />
    </div>
  );
}