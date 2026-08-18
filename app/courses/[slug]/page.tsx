"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  PlayCircle,
  FileText,
  HelpCircle,
  Lock,
  Sparkles,
  Award,
  Clock,
  Star,
  Users,
  ChevronRight,
  ShieldCheck,
  Zap,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getStoredCourses } from "@/lib/mock/courses";
import { getUserStats, enrollInCourse, saveUserStats } from "@/lib/services/user-progress";
import { isUserAuthenticated } from "@/lib/services/auth.service";
import { Course, ModuleRef, LessonRef } from "@/lib/types";

export default function CourseDetailPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Read slug from URL path
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const parts = window.location.pathname.split("/");
      const currentSlug = parts[parts.length - 1];
      setSlug(currentSlug);

      if (!isUserAuthenticated()) {
        window.location.href = `/login?redirect=/courses/${currentSlug}`;
        return;
      }
    }
  }, []);

  const loadCourseData = () => {
    if (!slug) return;
    const allCourses = getStoredCourses();
    const found =
      allCourses.find((c) => c.slug === slug || c.id === slug) ||
      allCourses.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) ||
      allCourses[0];

    if (found) {
      setCourse(found);
      const stats = getUserStats();
      let enrolled =
        stats.enrolledCourseIds.includes(found.id) ||
        stats.enrolledCourseIds.includes(found.slug);

      if (!enrolled && isUserAuthenticated()) {
        enrollInCourse(found);
        enrolled = true;
      }
      setIsEnrolled(enrolled);

      // Load completed lessons for this course
      const savedCompleted = new Set<string>();
      found.curriculum?.forEach((mod) => {
        mod.lessons?.forEach((les) => {
          if (stats.lessonProgress[`${found.id}_${les.id}`]) {
            savedCompleted.add(les.id);
          }
        });
      });
      setCompletedLessonIds(savedCompleted);
    }
  };

  useEffect(() => {
    loadCourseData();
    window.addEventListener("unigap_courses_updated", loadCourseData);
    window.addEventListener("unigap_user_stats_updated", loadCourseData);
    return () => {
      window.removeEventListener("unigap_courses_updated", loadCourseData);
      window.removeEventListener("unigap_user_stats_updated", loadCourseData);
    };
  }, [slug]);

  // Flattened lesson list for progress calculation
  const allLessons = useMemo(() => {
    if (!course?.curriculum) return [];
    const list: { lesson: LessonRef; moduleTitle: string; modIdx: number; lesIdx: number }[] = [];
    course.curriculum.forEach((mod, mi) => {
      mod.lessons.forEach((les, li) => {
        list.push({ lesson: les, moduleTitle: mod.title, modIdx: mi, lesIdx: li });
      });
    });
    return list;
  }, [course]);

  const progressPercentage = useMemo(() => {
    if (allLessons.length === 0) return 0;
    return Math.round((completedLessonIds.size / allLessons.length) * 100);
  }, [completedLessonIds, allLessons]);

  const handleEnroll = () => {
    if (!course) return;
    if (!isUserAuthenticated()) {
      window.location.href = `/login?redirect=/courses/${course.slug}`;
      return;
    }
    enrollInCourse(course);
    setIsEnrolled(true);
  };

  const currentModule = course?.curriculum?.[activeModuleIndex];
  const currentLesson = currentModule?.lessons?.[activeLessonIndex];

  const handleToggleLessonComplete = (lessonId: string) => {
    if (!course) return;
    const nextCompleted = new Set(completedLessonIds);
    const isNowComplete = !nextCompleted.has(lessonId);

    if (isNowComplete) {
      nextCompleted.add(lessonId);
    } else {
      nextCompleted.delete(lessonId);
    }
    setCompletedLessonIds(nextCompleted);

    const stats = getUserStats();
    const updatedProgressMap = {
      ...stats.lessonProgress,
      [`${course.id}_${lessonId}`]: isNowComplete ? 1 : 0,
      [course.slug]: Math.round((nextCompleted.size / (allLessons.length || 1)) * 100),
    };

    saveUserStats({
      lessonProgress: updatedProgressMap,
      xp: isNowComplete ? stats.xp + 25 : Math.max(0, stats.xp - 25),
      completedLessons: isNowComplete ? stats.completedLessons + 1 : Math.max(0, stats.completedLessons - 1),
    });
  };

  const handleNextLesson = () => {
    if (!course?.curriculum) return;
    const currentMod = course.curriculum[activeModuleIndex];
    if (activeLessonIndex < currentMod.lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    } else if (activeModuleIndex < course.curriculum.length - 1) {
      setActiveModuleIndex(activeModuleIndex + 1);
      setActiveLessonIndex(0);
    }
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col bg-[#faf5fa]">
        <Navbar />
        <main className="container-app flex flex-1 flex-col items-center justify-center p-12 text-center">
          <BookOpen size={40} className="text-[#520051]" />
          <h2 className="mt-4 text-xl font-bold text-[#520051]">Loading Course...</h2>
          <p className="mt-1 text-xs text-slate-500">Retrieving curriculum and enrollment data.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#faf5fa]">
      <Navbar />

      {/* Top Banner / Course Header */}
      <section className="bg-gradient-to-r from-[#520051] via-[#920090] to-[#D400D1] text-white py-10 px-6 shadow-md">
        <div className="container-app">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-200 hover:text-white mb-4"
          >
            <ArrowLeft size={14} /> Back to Course Catalog
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-xs">
                  {course.category}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
                  {course.level}
                </span>
                {isEnrolled && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-200 border border-emerald-300/40">
                    <CheckCircle2 size={13} /> Enrolled Learner
                  </span>
                )}
              </div>

              <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl lg:text-4xl leading-tight">
                {course.title}
              </h1>

              <p className="mt-3 text-sm text-purple-100 leading-relaxed">
                {course.shortDescription || course.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-purple-100">
                <div className="flex items-center gap-1.5 font-medium">
                  <BookOpen size={16} className="text-yellow-300" />
                  <span>{course.durationHours || 8} Hours of Content</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Star size={16} className="text-amber-300 fill-amber-300" />
                  <span>{course.rating || 5.0} Rating</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Users size={16} className="text-purple-200" />
                  <span>{(course.learners || 0).toLocaleString()} Enrolled Students</span>
                </div>
              </div>
            </div>

            {/* Quick Enrollment Card */}
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-slate-800 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-semibold text-slate-400">Course Access</span>
                  <p className="text-2xl font-extrabold text-[#520051]">
                    {course.isFree || course.price === 0 ? "Free Access" : `$${course.price}`}
                  </p>
                </div>
                <span className="rounded-2xl bg-[#faf5fa] p-3 text-[#520051]">
                  <Award size={28} />
                </span>
              </div>

              <div className="mt-4 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>Full Lifetime Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-[#920090]" />
                  <span>Verified Completion Certificate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-500" />
                  <span>Interactive Exercises & Quizzes</span>
                </div>
              </div>

              {isEnrolled ? (
                <div className="mt-6 rounded-2xl bg-emerald-50 p-4 border border-emerald-200 text-center">
                  <p className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-600" /> You are enrolled in this course!
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-700">
                    Scroll down to access full video lessons and interactive content.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleEnroll}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#520051] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#920090] transition"
                >
                  <Zap size={18} /> Enroll Now & Start Learning
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container-app flex-1 px-6 py-10">
        {isEnrolled ? (
          /* ENROLLED LEARNER CONTENT PLAYER */
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Player Main Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Header */}
              <div className="rounded-2xl border border-[#eee5ee] bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#920090] uppercase tracking-wider">
                      Your Course Progress
                    </span>
                    <h3 className="text-lg font-extrabold text-[#520051]">
                      {progressPercentage}% Completed
                    </h3>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-xl bg-[#faf5fa] px-3.5 py-2 text-xs font-bold text-[#520051] border border-[#eee5ee]">
                    <Sparkles size={14} className="text-amber-500" /> +{completedLessonIds.size * 25} XP Earned
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-gradient-to-r from-[#520051] to-[#D400D1] transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                {progressPercentage === 100 && (
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-amber-500/10 p-3.5 border border-amber-500/30 text-xs font-bold text-amber-900">
                    <span className="flex items-center gap-2">
                      <Award size={18} className="text-amber-600" /> Course Completed! Claim your certificate.
                    </span>
                    <Link
                      href="/certificates"
                      className="rounded-lg bg-[#520051] px-3 py-1.5 text-xs text-white hover:bg-[#920090]"
                    >
                      View Certificate
                    </Link>
                  </div>
                )}
              </div>

              {/* Lesson Content Viewer */}
              {currentLesson ? (
                <div className="rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-semibold text-slate-400">
                        {currentModule?.title}
                      </span>
                      <h2 className="text-xl font-bold text-[#520051] mt-0.5">
                        {currentLesson.title}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleLessonComplete(currentLesson.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                        completedLessonIds.has(currentLesson.id)
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-[#520051] text-white hover:bg-[#920090]"
                      }`}
                    >
                      <CheckCircle2 size={16} />
                      {completedLessonIds.has(currentLesson.id) ? "Completed ✓" : "Mark as Complete"}
                    </button>
                  </div>

                  {/* Player Body depending on lesson type */}
                  <div className="mt-6">
                    {currentLesson.type === "video" && (
                      <div>
                        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-white shadow-inner">
                          <PlayCircle size={64} className="text-pink-400 animate-pulse hover:scale-110 transition cursor-pointer" />
                          <p className="mt-4 text-sm font-bold">Interactive Video Player</p>
                          <p className="text-xs text-slate-400">Lesson Duration: {currentLesson.durationMin} minutes</p>
                        </div>

                        <div className="mt-6 rounded-2xl bg-[#faf5fa] p-5 border border-[#eee5ee]">
                          <h4 className="text-xs font-bold text-[#520051] uppercase tracking-wider">Lesson Notes & Key Takeaways</h4>
                          <p className="mt-2 text-xs leading-relaxed text-slate-600">
                            In this video lesson, you will master the foundational mechanics of {currentLesson.title}. Follow along with the instructor, code along in your environment, and test your understanding using the quiz.
                          </p>
                        </div>
                      </div>
                    )}

                    {currentLesson.type === "reading" && (
                      <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                        <div className="rounded-2xl bg-purple-50/50 p-5 border border-purple-100">
                          <h4 className="text-sm font-bold text-[#520051]">Article Guide: {currentLesson.title}</h4>
                          <p className="mt-2">
                            Welcome to this reading module. Read through the architectural overview and code examples carefully before marking the lesson as finished.
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-900 p-4 font-mono text-emerald-400 text-[11px] overflow-x-auto">
                          <code>{`// Core Implementation Example\nfunction initializeLearningSystem() {\n  console.log("UNIGAP Course Engine Loaded Successfully");\n  return { status: "ACTIVE", progress: 100 };\n}`}</code>
                        </div>
                      </div>
                    )}

                    {currentLesson.type === "quiz" && (
                      <div className="space-y-4">
                        <div className="rounded-2xl bg-[#faf5fa] p-6 border border-[#eee5ee]">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#920090]">
                            <HelpCircle size={16} /> Knowledge Check Assessment
                          </div>
                          <h3 className="mt-2 text-sm font-bold text-[#520051]">
                            What is the primary architectural concept introduced in &quot;{currentLesson.title}&quot;?
                          </h3>

                          <div className="mt-4 space-y-2">
                            {[
                              "Modular component composition and state encapsulation",
                              "Direct DOM manipulation without virtual diffing",
                              "Synchronous blocking multi-threading",
                              "Unstructured inline global state mutation",
                            ].map((option, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setQuizAnswer(idx)}
                                className={`w-full text-left rounded-xl p-3.5 text-xs font-medium transition border ${
                                  quizAnswer === idx
                                    ? "border-[#520051] bg-[#f7ddf7] font-bold text-[#520051]"
                                    : "border-slate-200 bg-white hover:border-[#920090]/40"
                                }`}
                              >
                                {String.fromCharCode(65 + idx)}. {option}
                              </button>
                            ))}
                          </div>

                          <div className="mt-5 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => setQuizSubmitted(true)}
                              disabled={quizAnswer === null}
                              className="rounded-xl bg-[#520051] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#920090] disabled:opacity-50"
                            >
                              Submit Answer
                            </button>

                            {quizSubmitted && (
                              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 size={16} /> Correct! +25 XP Awarded
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation controls */}
                  <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                    <button
                      type="button"
                      onClick={() => {
                        if (activeLessonIndex > 0) {
                          setActiveLessonIndex(activeLessonIndex - 1);
                        } else if (activeModuleIndex > 0) {
                          setActiveModuleIndex(activeModuleIndex - 1);
                          setActiveLessonIndex(0);
                        }
                      }}
                      disabled={activeModuleIndex === 0 && activeLessonIndex === 0}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 disabled:opacity-40"
                    >
                      ← Previous Lesson
                    </button>

                    <button
                      type="button"
                      onClick={handleNextLesson}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#520051] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#920090]"
                    >
                      Next Lesson <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-[#eee5ee] bg-white p-12 text-center shadow-xs">
                  <p className="text-sm text-slate-500">Select a lesson from the curriculum sidebar to begin.</p>
                </div>
              )}
            </div>

            {/* Curriculum Sidebar */}
            <div className="space-y-4">
              <div className="rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-[#520051] uppercase tracking-wider border-b border-slate-100 pb-3">
                  Course Modules ({course.curriculum?.length || 0})
                </h3>

                <div className="mt-4 space-y-4">
                  {course.curriculum?.map((mod, mi) => (
                    <div key={mod.id || mi} className="rounded-2xl border border-slate-100 bg-[#faf5fa] overflow-hidden">
                      <div className="p-3 bg-[#f5eef5] text-xs font-bold text-[#520051] flex items-center justify-between">
                        <span>Module {mi + 1}: {mod.title}</span>
                        <span className="text-[10px] text-slate-500">{mod.lessons?.length || 0} lessons</span>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {mod.lessons?.map((les, li) => {
                          const isActive = mi === activeModuleIndex && li === activeLessonIndex;
                          const isDone = completedLessonIds.has(les.id);
                          return (
                            <button
                              key={les.id || li}
                              type="button"
                              onClick={() => {
                                setActiveModuleIndex(mi);
                                setActiveLessonIndex(li);
                              }}
                              className={`w-full flex items-center justify-between p-3 text-left transition text-xs ${
                                isActive ? "bg-[#f0d8f0] font-bold text-[#520051]" : "hover:bg-white"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {isDone ? (
                                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                                ) : les.type === "video" ? (
                                  <PlayCircle size={14} className="text-[#920090] shrink-0" />
                                ) : les.type === "quiz" ? (
                                  <HelpCircle size={14} className="text-amber-600 shrink-0" />
                                ) : (
                                  <FileText size={14} className="text-blue-600 shrink-0" />
                                )}
                                <span className="truncate">{les.title}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 shrink-0 ml-2">{les.durationMin}m</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* UNENROLLED COURSE PREVIEW */
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {/* Learning Outcomes */}
              <div className="rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-xs">
                <h2 className="text-lg font-bold text-[#520051]">What You Will Learn</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {course.outcomes?.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Syllabus Preview */}
              <div className="rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-xs">
                <h2 className="text-lg font-bold text-[#520051]">Course Syllabus</h2>
                <p className="text-xs text-slate-500 mt-0.5">Enroll in this course to unlock all modules and video lessons.</p>

                <div className="mt-5 space-y-3">
                  {course.curriculum?.map((mod, mi) => (
                    <div key={mod.id || mi} className="rounded-2xl border border-slate-200 bg-[#faf5fa] p-4">
                      <h3 className="text-xs font-bold text-[#520051]">
                        Module {mi + 1}: {mod.title}
                      </h3>
                      <div className="mt-2.5 space-y-1.5">
                        {mod.lessons?.map((les, li) => (
                          <div key={les.id || li} className="flex items-center justify-between text-xs text-slate-600 py-1">
                            <span className="flex items-center gap-2">
                              <Lock size={13} className="text-slate-400" /> {les.title}
                            </span>
                            <span className="text-[10px] text-slate-400">{les.durationMin} min</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar CTA */}
            <div>
              <div className="rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-xs text-center sticky top-6">
                <h3 className="text-base font-bold text-[#520051]">Unlock Full Course Access</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Enroll today to access all video lessons, code exercises, and claim your completion certificate.
                </p>

                <button
                  type="button"
                  onClick={handleEnroll}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#520051] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#920090] transition"
                >
                  <Zap size={18} /> Enroll Now
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
