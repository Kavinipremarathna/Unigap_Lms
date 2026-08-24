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
import { Badge } from "@/components/ui/badge";
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
      <div className="flex min-h-screen flex-col bg-bg text-ink transition-colors">
        <Navbar />
        <main className="container-app flex flex-1 flex-col items-center justify-center p-12 text-center">
          <BookOpen size={40} className="text-primary" />
          <h2 className="mt-4 font-serif text-xl font-medium text-ink">Loading Course...</h2>
          <p className="mt-1 text-xs font-mono text-ink-muted">Retrieving curriculum and enrollment data.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink transition-colors">
      <Navbar />

      {/* Top Banner / Course Header */}
      <section className="border-b border-border bg-surface py-10 px-6">
        <div className="container-app">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline mb-4"
          >
            <ArrowLeft size={14} /> Back to Course Catalog
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 font-mono">
                <span className="rounded-full bg-surface-2 border border-border px-3 py-0.5 text-xs font-medium text-ink-muted">
                  {course.category}
                </span>
                <span className="rounded-full bg-surface-2 border border-border px-3 py-0.5 text-xs font-medium text-ink-muted">
                  {course.level}
                </span>
                {isEnrolled && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-0.5 text-xs font-medium text-accent border border-accent/30">
                    <CheckCircle2 size={13} /> Enrolled Learner
                  </span>
                )}
              </div>

              <h1 className="mt-4 font-serif text-2xl font-medium sm:text-3xl lg:text-4xl text-ink leading-tight">
                {course.title}
              </h1>

              <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                {course.shortDescription || course.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-xs font-mono text-ink-muted">
                <div className="flex items-center gap-1.5">
                  <BookOpen size={16} className="text-primary" />
                  <span>{course.durationHours || 8} Hours of Content</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={16} className="text-primary fill-primary" />
                  <span>{course.rating || 5.0} Rating</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={16} className="text-ink-muted" />
                  <span>{(course.learners || 0).toLocaleString()} Enrolled Students</span>
                </div>
              </div>
            </div>

            {/* Quick Enrollment Card */}
            <div className="w-full max-w-sm rounded-[4px] border border-border bg-surface-2 p-6 text-ink shadow-xl">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-xs font-mono text-ink-muted">Course Access</span>
                  <p className="font-mono text-2xl font-bold text-primary">
                    {course.isFree || course.price === 0 ? "Free Access" : `$${course.price}`}
                  </p>
                </div>
                <span className="rounded-[4px] border border-primary/30 bg-primary/10 p-3 text-primary">
                  <Award size={28} />
                </span>
              </div>

              <div className="mt-4 space-y-2.5 text-xs text-ink-muted">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-accent" />
                  <span>Full Lifetime Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-primary" />
                  <span>Verified Completion Certificate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" />
                  <span>Interactive Exercises & Quizzes</span>
                </div>
              </div>

              {isEnrolled ? (
                <div className="mt-6 rounded-[4px] bg-accent/10 p-4 border border-accent/30 text-center">
                  <p className="text-xs font-mono font-bold text-accent flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={16} className="text-accent" /> You are enrolled in this course!
                  </p>
                  <p className="mt-1 text-[11px] text-ink-muted">
                    Access full video lessons and interactive content below.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleEnroll}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-[4px] bg-primary px-6 py-3.5 text-sm font-semibold text-primary-fg hover:opacity-90 transition shadow-sm"
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
              <div className="rounded-[4px] border border-border bg-surface p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                      Your Course Progress
                    </span>
                    <h3 className="font-serif text-lg font-medium text-ink">
                      {progressPercentage}% Completed
                    </h3>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-[4px] bg-surface-2 px-3.5 py-1.5 text-xs font-mono font-semibold text-primary border border-border">
                    <Sparkles size={14} className="text-primary" /> +{completedLessonIds.size * 25} XP Earned
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                {progressPercentage === 100 && (
                  <div className="mt-4 flex items-center justify-between rounded-[4px] bg-primary/15 p-3.5 border border-primary/30 text-xs font-mono text-ink">
                    <span className="flex items-center gap-2">
                      <Award size={18} className="text-primary" /> Course Completed! Claim your certificate.
                    </span>
                    <Link
                      href="/certificates"
                      className="rounded-[4px] bg-primary px-3 py-1.5 text-xs font-semibold text-primary-fg hover:opacity-90"
                    >
                      View Certificate
                    </Link>
                  </div>
                )}
              </div>

              {/* Lesson Content Viewer */}
              {currentLesson ? (
                <div className="rounded-[4px] border border-border bg-surface p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <span className="text-xs font-mono text-ink-muted">
                        {currentModule?.title}
                      </span>
                      <h2 className="font-serif text-xl font-medium text-ink mt-0.5">
                        {currentLesson.title}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleLessonComplete(currentLesson.id)}
                      className={`inline-flex items-center gap-2 rounded-[4px] px-4 py-2 text-xs font-semibold transition ${
                        completedLessonIds.has(currentLesson.id)
                          ? "bg-accent/20 text-accent border border-accent/40"
                          : "bg-primary text-primary-fg hover:opacity-90"
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
                        <div className="relative aspect-video w-full overflow-hidden rounded-[4px] bg-bg border border-border flex flex-col items-center justify-center text-ink">
                          <PlayCircle size={64} className="text-primary hover:scale-110 transition cursor-pointer" />
                          <p className="mt-4 font-serif text-base font-medium">Interactive Video Player</p>
                          <p className="text-xs font-mono text-ink-muted">Lesson Duration: {currentLesson.durationMin} minutes</p>
                        </div>

                        <div className="mt-6 rounded-[4px] bg-surface-2 p-5 border border-border">
                          <h4 className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">Lesson Notes & Key Takeaways</h4>
                          <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                            In this video lesson, you will master the foundational mechanics of {currentLesson.title}. Follow along with the instructor, code along in your environment, and test your understanding using the quiz.
                          </p>
                        </div>
                      </div>
                    )}

                    {currentLesson.type === "reading" && (
                      <div className="space-y-4 text-xs text-ink-muted leading-relaxed">
                        <div className="rounded-[4px] bg-surface-2 p-5 border border-border">
                          <h4 className="font-serif text-base font-medium text-ink">Article Guide: {currentLesson.title}</h4>
                          <p className="mt-2 text-ink-muted">
                            Welcome to this reading module. Read through the architectural overview and code examples carefully before marking the lesson as finished.
                          </p>
                        </div>

                        <div className="rounded-[4px] bg-bg p-4 font-mono text-accent text-[11px] overflow-x-auto border border-border">
                          <code>{`// Core Implementation Example\nfunction initializeLearningSystem() {\n  console.log("UNIGAP Course Engine Loaded Successfully");\n  return { status: "ACTIVE", progress: 100 };\n}`}</code>
                        </div>
                      </div>
                    )}

                    {currentLesson.type === "quiz" && (
                      <div className="space-y-4">
                        <div className="rounded-[4px] bg-surface-2 p-6 border border-border">
                          <div className="flex items-center gap-2 text-xs font-mono text-primary">
                            <HelpCircle size={16} /> Knowledge Check Assessment
                          </div>
                          <h3 className="mt-2 font-serif text-base font-medium text-ink">
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
                                className={`w-full text-left rounded-[4px] p-3.5 text-xs transition border ${
                                  quizAnswer === idx
                                    ? "border-primary bg-primary/15 font-semibold text-primary"
                                    : "border-border bg-surface text-ink-muted hover:border-border-hover"
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
                              className="rounded-[4px] bg-primary px-5 py-2.5 text-xs font-semibold text-primary-fg hover:opacity-90 disabled:opacity-50"
                            >
                              Submit Answer
                            </button>

                            {quizSubmitted && (
                              <span className="text-xs font-mono font-semibold text-accent flex items-center gap-1">
                                <CheckCircle2 size={16} /> Correct! +25 XP Awarded
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation controls */}
                  <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
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
                      className="rounded-[4px] border border-border bg-surface-2 px-4 py-2.5 text-xs font-mono text-ink-muted disabled:opacity-40 hover:bg-surface"
                    >
                      ← Previous Lesson
                    </button>

                    <button
                      type="button"
                      onClick={handleNextLesson}
                      className="inline-flex items-center gap-1.5 rounded-[4px] bg-primary px-5 py-2.5 text-xs font-semibold text-primary-fg hover:opacity-90"
                    >
                      Next Lesson <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-[4px] border border-border bg-surface p-12 text-center">
                  <p className="text-xs font-mono text-ink-muted">Select a lesson from the curriculum sidebar to begin.</p>
                </div>
              )}
            </div>

            {/* Curriculum Sidebar */}
            <div className="space-y-4">
              <div className="rounded-[4px] border border-border bg-surface p-6 shadow-sm">
                <h3 className="text-xs font-mono font-semibold text-primary uppercase tracking-wider border-b border-border pb-3">
                  Course Modules ({course.curriculum?.length || 0})
                </h3>

                <div className="mt-4 space-y-4">
                  {course.curriculum?.map((mod, mi) => (
                    <div key={mod.id || mi} className="rounded-[4px] border border-border bg-surface-2 overflow-hidden">
                      <div className="p-3 bg-surface-2 text-xs font-serif font-medium text-ink flex items-center justify-between border-b border-border">
                        <span>Module {mi + 1}: {mod.title}</span>
                        <span className="text-[10px] font-mono text-ink-muted">{mod.lessons?.length || 0} lessons</span>
                      </div>

                      <div className="divide-y divide-border">
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
                                isActive ? "bg-primary/15 font-semibold text-primary" : "hover:bg-surface text-ink-muted"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {isDone ? (
                                  <CheckCircle2 size={14} className="text-accent shrink-0" />
                                ) : les.type === "video" ? (
                                  <PlayCircle size={14} className="text-primary shrink-0" />
                                ) : les.type === "quiz" ? (
                                  <HelpCircle size={14} className="text-primary shrink-0" />
                                ) : (
                                  <FileText size={14} className="text-accent shrink-0" />
                                )}
                                <span className="truncate">{les.title}</span>
                              </div>
                              <span className="text-[10px] font-mono text-ink-muted shrink-0 ml-2">{les.durationMin}m</span>
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
          /* UNENROLLED COURSE PREVIEW — VISUALLY REFLECTED LOCKED CONTENT */
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {/* Learning Outcomes */}
              <div className="rounded-[4px] border border-border bg-surface p-6 shadow-sm">
                <h2 className="font-serif text-xl font-medium text-ink">What You Will Learn</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {course.outcomes?.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-ink-muted">
                      <Check size={16} className="text-accent shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Syllabus Preview with Visually Reflected Locked Overlay */}
              <div className="rounded-[4px] border border-border bg-surface p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h2 className="font-serif text-xl font-medium text-ink">Course Syllabus</h2>
                    <p className="text-xs font-mono text-ink-muted mt-0.5">Enroll to unlock all video lessons and interactive content.</p>
                  </div>
                  <Badge variant="brass">
                    <Lock size={12} /> Pay to Unlock
                  </Badge>
                </div>

                <div className="mt-5 space-y-3">
                  {course.curriculum?.map((mod, mi) => (
                    <div key={mod.id || mi} className="rounded-[4px] border border-border bg-surface-2 p-4">
                      <h3 className="font-serif text-sm font-medium text-ink">
                        Module {mi + 1}: {mod.title}
                      </h3>
                      <div className="mt-2.5 space-y-1.5">
                        {mod.lessons?.map((les, li) => (
                          <div key={les.id || li} className="flex items-center justify-between text-xs text-ink-muted py-1.5 border-b border-border/50 last:border-0">
                            <span className="flex items-center gap-2">
                              <Lock size={13} className="text-ink-muted" /> {les.title}
                            </span>
                            <span className="font-mono text-[10px] text-ink-muted">{les.durationMin} min</span>
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
              <div className="rounded-[4px] border border-border bg-surface p-6 shadow-sm text-center sticky top-6">
                <h3 className="font-serif text-lg font-medium text-ink">Unlock Full Course Access</h3>
                <p className="mt-2 text-xs text-ink-muted">
                  Enroll today to access all video lessons, code exercises, and claim your completion certificate.
                </p>

                <button
                  type="button"
                  onClick={handleEnroll}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-[4px] bg-primary px-6 py-3.5 text-sm font-semibold text-primary-fg hover:opacity-90 transition shadow-sm"
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


