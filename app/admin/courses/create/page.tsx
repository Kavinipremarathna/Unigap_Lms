"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Trash2,
  Save,
  Eye,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminAuth } from "@/lib/context/admin-auth-context";
import { saveCustomCourse } from "@/lib/mock/courses";
import { getStoredInstructors } from "@/lib/mock/instructors";
import { Course, Level, Instructor } from "@/lib/types";

type Lesson = {
  id: number;
  title: string;
  type: "Video" | "Article" | "Quiz";
  duration: string;
};

type Module = {
  id: number;
  title: string;
  lessons: Lesson[];
};

export default function CreateCoursePage() {
  const router = useRouter();
  const { addActivity } = useAdminAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [level, setLevel] = useState("Beginner");
  const [instructor, setInstructor] = useState("");
  const [price, setPrice] = useState("0");
  const [isFree, setIsFree] = useState(true);

  const [allInstructors, setAllInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    const load = () => {
      const list = getStoredInstructors();
      setAllInstructors(list);
      if (!instructor && list.length > 0) {
        setInstructor(list[0].name);
      }
    };
    load();
    window.addEventListener("unigap_instructors_updated", load);
    return () => window.removeEventListener("unigap_instructors_updated", load);
  }, []);

  const [objectives, setObjectives] = useState<string[]>([""]);

  const [modules, setModules] = useState<Module[]>([
    {
      id: 1,
      title: "Introduction",
      lessons: [
        {
          id: 1,
          title: "Welcome to the Course",
          type: "Video",
          duration: "10 min",
        },
      ],
    },
  ]);

  const [expandedModules, setExpandedModules] = useState<number[]>([1]);

  const addObjective = () => {
    setObjectives((current) => [...current, ""]);
  };

  const updateObjective = (index: number, value: string) => {
    setObjectives((current) =>
      current.map((item, i) => (i === index ? value : item)),
    );
  };

  const removeObjective = (index: number) => {
    setObjectives((current) => current.filter((_, i) => i !== index));
  };

  const addModule = () => {
    const newModule: Module = {
      id: Date.now(),
      title: `Module ${modules.length + 1}`,
      lessons: [],
    };

    setModules((current) => [...current, newModule]);
    setExpandedModules((current) => [...current, newModule.id]);
  };

  const updateModuleTitle = (id: number, title: string) => {
    setModules((current) =>
      current.map((module) =>
        module.id === id ? { ...module, title } : module,
      ),
    );
  };

  const deleteModule = (id: number) => {
    setModules((current) => current.filter((module) => module.id !== id));

    setExpandedModules((current) =>
      current.filter((moduleId) => moduleId !== id),
    );
  };

  const addLesson = (moduleId: number) => {
    setModules((current) =>
      current.map((module) => {
        if (module.id !== moduleId) return module;

        return {
          ...module,
          lessons: [
            ...module.lessons,
            {
              id: Date.now(),
              title: "New Lesson",
              type: "Video",
              duration: "10 min",
            },
          ],
        };
      }),
    );
  };

  const updateLesson = (
    moduleId: number,
    lessonId: number,
    field: keyof Lesson,
    value: string,
  ) => {
    setModules((current) =>
      current.map((module) => {
        if (module.id !== moduleId) return module;

        return {
          ...module,
          lessons: module.lessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, [field]: value } : lesson,
          ),
        };
      }),
    );
  };

  const deleteLesson = (moduleId: number, lessonId: number) => {
    setModules((current) =>
      current.map((module) => {
        if (module.id !== moduleId) return module;

        return {
          ...module,
          lessons: module.lessons.filter((lesson) => lesson.id !== lessonId),
        };
      }),
    );
  };

  const toggleModule = (id: number) => {
    setExpandedModules((current) =>
      current.includes(id)
        ? current.filter((moduleId) => moduleId !== id)
        : [...current, id],
    );
  };

  const buildCourseObject = (isPublishing = true): Course => {
    const numPrice = isFree ? 0 : Number(price) || 0;
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const instructorName = instructor.trim() || "Alexander Reed";
    const foundInstructor = allInstructors.find(
      (i) => i.name.toLowerCase() === instructorName.toLowerCase()
    );

    const totalMinutes = modules.reduce(
      (sum, m) => sum + m.lessons.reduce((lsum, l) => lsum + (parseInt(l.duration) || 10), 0),
      0
    );
    const durationHours = Math.max(1, Math.round(totalMinutes / 60));

    return {
      id: `c-${Date.now()}`,
      slug: slug || `course-${Date.now()}`,
      title: title.trim() || "Untitled Course",
      shortDescription: description.slice(0, 140) || "No description provided.",
      description: description || "No detailed description provided.",
      category: category || "Web Development",
      level: (level as Level) || "Beginner",
      durationHours: durationHours,
      rating: 0,
      reviewCount: 0,
      learners: 0,
      price: numPrice,
      isFree,
      status: isPublishing ? "Published" : "Draft",
      isPublished: isPublishing,
      instructorId: foundInstructor ? foundInstructor.id : `ins-${Date.now()}`,
      instructorName: instructorName,
      gradient: ["#520051", "#920090"],
      outcomes: objectives.filter((o) => o.trim().length > 0),
      requirements: ["Standard internet access and computer"],
      curriculum: modules.map((m, mi) => ({
        id: `mod-${mi + 1}`,
        title: m.title,
        lessons: m.lessons.map((l, li) => ({
          id: `mod-${mi + 1}-lesson-${li + 1}`,
          title: l.title,
          durationMin: parseInt(l.duration) || 10,
          type:
            l.type.toLowerCase() === "quiz"
              ? "quiz"
              : l.type.toLowerCase() === "article"
              ? "reading"
              : "video",
          completed: false,
          locked: false,
        })),
      })),
    };
  };

  const handleSaveDraft = () => {
    if (!title.trim()) {
      alert("Please enter a course title before saving.");
      return;
    }
    const newCourse = buildCourseObject(false);
    saveCustomCourse(newCourse);
    addActivity("Saved Course Draft", `Course: ${title}`);
    alert(`Course "${title}" saved as draft and added to course directory.`);
    router.push("/admin/courses");
  };

  const handlePublish = () => {
    if (!title.trim()) {
      alert("Please enter a course title.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter a course description.");
      return;
    }

    const newCourse = buildCourseObject(true);
    saveCustomCourse(newCourse);
    addActivity("Published New Course", `Course: ${title} (${category})`);
    alert(`Course "${title}" published successfully! It is now live in the course catalog.`);
    router.push("/courses");
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

            <h1 className="text-3xl font-bold text-[#520051]">Create Course</h1>

            <p className="mt-2 text-sm text-slate-500">
              Create a new learning experience for UNIGAP students.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-2 rounded-xl border border-[#ddd2dd] bg-white px-4 py-2.5 text-sm font-semibold text-[#520051] hover:bg-[#faf5fa]"
            >
              <Save size={17} />
              Save Draft
            </button>

            <button
              type="button"
              onClick={handlePublish}
              className="inline-flex items-center gap-2 rounded-xl bg-[#520051] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#920090]"
            >
              <Eye size={17} />
              Publish Course
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 xl:col-span-2">
            {/* Basic information */}
            <section className="rounded-2xl border border-[#eee5ee] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7ddf7]">
                  <BookOpen size={20} className="text-[#920090]" />
                </div>

                <div>
                  <h2 className="font-bold text-[#520051]">
                    Basic Information
                  </h2>

                  <p className="text-xs text-slate-500">
                    General information about your course.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#520051]">
                    Course Title
                  </label>

                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. React Fundamentals"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#520051]">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    placeholder="Describe what students will learn..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10"
                  />
                </div>

                {/* Category / Level */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#520051]">
                      Category
                    </label>

                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#920090]"
                    >
                      <option>Web Development</option>
                      <option>Programming</option>
                      <option>Data Science</option>
                      <option>Artificial Intelligence</option>
                      <option>Cloud Computing</option>
                      <option>Cybersecurity</option>
                      <option>UI/UX Design</option>
                      <option>Business</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#520051]">
                      Level
                    </label>

                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#920090]"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Instructor Selection & Checklist */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-[#520051]">
                      Course Instructor
                    </label>
                    {instructor && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-bold text-green-700 border border-green-200">
                        <Check size={13} /> Selected: {instructor}
                      </span>
                    )}
                  </div>

                  {/* Direct Text Input */}
                  <input
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="Type instructor name or select from checklist below..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10"
                  />

                  {/* Instructor Checklist */}
                  <div className="mt-3 rounded-2xl border border-slate-200 bg-[#faf7fb] p-3.5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#920090]">
                      Instructor Checklist (Added by Super Admin)
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {allInstructors.map((ins) => {
                        const isChecked = instructor.trim().toLowerCase() === ins.name.trim().toLowerCase();
                        return (
                          <label
                            key={ins.id}
                            onClick={() => setInstructor(ins.name)}
                            className={`flex cursor-pointer items-center justify-between rounded-xl border p-2.5 transition ${
                              isChecked
                                ? "border-[#520051] bg-[#f7ddf7] shadow-xs"
                                : "border-slate-200 bg-white hover:border-[#920090]/40"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => setInstructor(ins.name)}
                                className="h-4 w-4 rounded border-slate-300 text-[#520051] focus:ring-[#920090]"
                              />
                              <div className="min-w-0">
                                <p className="truncate text-xs font-bold text-[#520051]">{ins.name}</p>
                                <p className="truncate text-[10px] text-slate-500">{ins.title}</p>
                              </div>
                            </div>
                            {isChecked && <Check size={14} className="text-[#520051] shrink-0" />}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Objectives */}
            <section className="rounded-2xl border border-[#eee5ee] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-[#520051]">
                    Learning Objectives
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    What will students be able to do after completing this
                    course?
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addObjective}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#f7ddf7] px-3 py-2 text-xs font-semibold text-[#920090] hover:bg-[#eed5ee]"
                >
                  <Plus size={15} />
                  Add Objective
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {objectives.map((objective, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f7ddf7] text-xs font-bold text-[#920090]">
                      {index + 1}
                    </span>

                    <input
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      placeholder="Students will be able to..."
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#920090]"
                    />

                    {objectives.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeObjective(index)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum */}
            <section className="rounded-2xl border border-[#eee5ee] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-[#520051]">
                    Course Curriculum
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Organize your course into modules and lessons.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addModule}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#520051] px-3 py-2 text-xs font-semibold text-white hover:bg-[#920090]"
                >
                  <Plus size={15} />
                  Add Module
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {modules.map((module, moduleIndex) => {
                  const expanded = expandedModules.includes(module.id);

                  return (
                    <div
                      key={module.id}
                      className="overflow-hidden rounded-xl border border-[#e8dce8]"
                    >
                      {/* Module header */}
                      <div className="flex items-center gap-3 bg-[#faf7fb] p-4">
                        <button
                          type="button"
                          onClick={() => toggleModule(module.id)}
                          className="text-slate-500"
                        >
                          {expanded ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>

                        <span className="text-xs font-bold text-[#920090]">
                          MODULE {moduleIndex + 1}
                        </span>

                        <input
                          value={module.title}
                          onChange={(e) =>
                            updateModuleTitle(module.id, e.target.value)
                          }
                          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#520051] outline-none"
                        />

                        <button
                          type="button"
                          onClick={() => deleteModule(module.id)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Lessons */}
                      {expanded && (
                        <div className="p-4">
                          <div className="space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div
                                key={lesson.id}
                                className="grid gap-2 rounded-xl border border-slate-100 bg-white p-3 md:grid-cols-[auto_1fr_130px_100px_auto]"
                              >
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                                  {lessonIndex + 1}
                                </span>

                                <input
                                  value={lesson.title}
                                  onChange={(e) =>
                                    updateLesson(
                                      module.id,
                                      lesson.id,
                                      "title",
                                      e.target.value,
                                    )
                                  }
                                  className="rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#920090]"
                                />

                                <select
                                  value={lesson.type}
                                  onChange={(e) =>
                                    updateLesson(
                                      module.id,
                                      lesson.id,
                                      "type",
                                      e.target.value,
                                    )
                                  }
                                  className="rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
                                >
                                  <option>Video</option>
                                  <option>Article</option>
                                  <option>Quiz</option>
                                </select>

                                <input
                                  value={lesson.duration}
                                  onChange={(e) =>
                                    updateLesson(
                                      module.id,
                                      lesson.id,
                                      "duration",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Duration"
                                  className="rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#920090]"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteLesson(module.id, lesson.id)
                                  }
                                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => addLesson(module.id)}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#d8c5d8] px-3 py-2 text-xs font-semibold text-[#920090] hover:bg-[#faf5fa]"
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

          {/* Right side */}
          <aside className="space-y-6">
            {/* Pricing */}
            <section className="rounded-2xl border border-[#eee5ee] bg-white p-6 shadow-sm">
              <h2 className="font-bold text-[#520051]">Pricing</h2>

              <div className="mt-5">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="h-4 w-4 accent-[#920090]"
                  />

                  <span className="text-sm font-medium text-slate-700">
                    This is a free course
                  </span>
                </label>
              </div>

              {!isFree && (
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-semibold text-[#520051]">
                    Course Price ($)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#920090]"
                  />
                </div>
              )}
            </section>

            {/* Course summary */}
            <section className="rounded-2xl border border-[#eee5ee] bg-white p-6 shadow-sm">
              <h2 className="font-bold text-[#520051]">Course Summary</h2>

              <div className="mt-5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Category</span>

                  <span className="font-semibold text-[#520051]">
                    {category}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Level</span>

                  <span className="font-semibold text-[#520051]">{level}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Modules</span>

                  <span className="font-semibold text-[#520051]">
                    {modules.length}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Lessons</span>

                  <span className="font-semibold text-[#520051]">
                    {modules.reduce(
                      (total, module) => total + module.lessons.length,
                      0,
                    )}
                  </span>
                </div>

                <div className="flex justify-between border-t border-slate-100 pt-4 text-sm">
                  <span className="text-slate-500">Price</span>

                  <span className="font-bold text-[#920090]">
                    {isFree ? "Free" : `$${price}`}
                  </span>
                </div>
              </div>
            </section>

            {/* Publish */}
            <section className="rounded-2xl bg-gradient-to-br from-[#520051] to-[#920090] p-6 text-white shadow-lg">
              <h2 className="font-bold">Ready to publish?</h2>

              <p className="mt-2 text-sm text-white/75">
                Make sure your course information and curriculum are complete
                before publishing.
              </p>

              <button
                type="button"
                onClick={handlePublish}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#520051] transition hover:bg-[#f7ddf7]"
              >
                Publish Course
              </button>
            </section>
          </aside>
        </div>
      </main>
    </AdminShell>
  );
}
