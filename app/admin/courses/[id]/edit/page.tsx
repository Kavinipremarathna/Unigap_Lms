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
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminAuth } from "@/lib/context/admin-auth-context";
import { getStoredCourses, saveCustomCourse } from "@/lib/mock/courses";
import { getStoredInstructors } from "@/lib/mock/instructors";
import { Course, Level } from "@/lib/types";

type LessonType = "Video" | "Article" | "Quiz";

type Lesson = {
  id: number;
  title: string;
  type: LessonType;
  duration: string;
  published: boolean;
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
    const all = getStoredCourses();
    const found =
      all.find((c) => c.id === courseId || c.slug === courseId) ||
      all[parseInt(courseId) - 1] ||
      all[0];

    if (found) {
      setExistingCourse(found);
      setTitle(found.title);
      setDescription(found.description || found.shortDescription || "");
      setInstructor(found.instructorName || found.instructorId || "Alexander Reed");
      setCategory(found.category || "Web Development");
      setLevel(found.level || "Beginner");
      setPrice(found.isFree ? "0" : String(found.price || 49));
      setStatus(found.status || (found.isPublished === false ? "Draft" : "Published"));
      setObjectives(
        found.outcomes?.length ? found.outcomes : ["Master core concepts"]
      );
      if (found.curriculum?.length) {
        setModules(
          found.curriculum.map((m, mi) => ({
            id: mi + 1,
            title: m.title,
            lessons: m.lessons.map((l, li) => ({
              id: li + 1,
              title: l.title,
              type: (l.type === "quiz"
                ? "Quiz"
                : l.type === "reading"
                ? "Article"
                : "Video") as LessonType,
              duration: `${l.durationMin || 10} min`,
              published: !l.locked,
            })),
          }))
        );
      }
    }
  }, [courseId]);

  const saveCourse = (overrideStatus?: "Published" | "Draft") => {
    const finalStatus = overrideStatus || status;
    const numPrice = Number(price) || 0;
    const targetId = existingCourse?.id || `c-${Date.now()}`;
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
        lessons: m.lessons.map((l, li) => ({
          id: `mod-${mi + 1}-lesson-${li + 1}`,
          title: l.title,
          durationMin: parseInt(l.duration) || 10,
          type: l.type === "Quiz" ? "quiz" : l.type === "Article" ? "reading" : "video",
          completed: false,
          locked: !l.published,
        })),
      })),
    };

    saveCustomCourse(updatedCourse);
    addActivity("Updated Course", `Course: ${title} (${finalStatus})`);
    alert(`Course "${title}" updated successfully! Changes are live.`);
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
                        <div className="p-4">
                          <div className="space-y-2">
                            {module.lessons.map(
                              (lesson, lessonIndex) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                                >
                                  <GripVertical
                                    size={16}
                                    className="shrink-0 text-slate-300"
                                  />

                                  <span className="text-xs font-medium text-slate-400">
                                    {moduleIndex + 1}.
                                    {lessonIndex + 1}
                                  </span>

                                  <LessonIcon
                                    type={lesson.type}
                                  />

                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-[#520051]">
                                      {lesson.title}
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-400">
                                      {lesson.type} ·{" "}
                                      {lesson.duration}
                                    </p>
                                  </div>

                                  <span
                                    className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                                      lesson.published
                                        ? "bg-green-50 text-green-600"
                                        : "bg-slate-100 text-slate-500"
                                    }`}
                                  >
                                    {lesson.published
                                      ? "Published"
                                      : "Draft"}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleLessonPublished(
                                        module.id,
                                        lesson.id
                                      )
                                    }
                                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#920090]"
                                    title={
                                      lesson.published
                                        ? "Unpublish"
                                        : "Publish"
                                    }
                                  >
                                    {lesson.published ? (
                                      <EyeOff size={15} />
                                    ) : (
                                      <Eye size={15} />
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteLesson(
                                        module.id,
                                        lesson.id
                                      )
                                    }
                                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              )
                            )}
                          </div>

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