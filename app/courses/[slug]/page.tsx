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
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<{
    correctCount: number;
    totalCount: number;
    earnedMarks: number;
    totalMarks: number;
    passed: boolean;
  } | null>(null);

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

  const loadCourseData = async () => {
    if (!slug) return;
    try {
      const res = await fetch("/api/admin/courses");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.courses)) {
          const found = data.courses.find(
            (c: any) => c.slug === slug || c.id === slug || c.slug?.toLowerCase() === slug?.toLowerCase()
          );

          if (found) {
            const mapped: Course = {
              id: found.id,
              slug: found.slug,
              title: found.title,
              shortDescription: found.shortDescription || found.description,
              description: found.description,
              category: found.category,
              level: found.level || "Beginner",
              durationHours: found.durationHours || 10,
              rating: typeof found.rating === "number" ? found.rating : 5.0,
              reviewCount: 12,
              learners: found.studentsCount || 0,
              price: Number(found.price) || 0,
              isFree: found.isFree,
              thumbnailUrl: found.thumbnailUrl || null,
              instructorId: found.instructorId,
              instructorName: found.instructorName,
              gradient: ["#520051", "#920090"],
              outcomes: found.outcomes?.length
                ? found.outcomes
                : [
                    "Master core principles and practical skills",
                    "Hands-on exercises and real-world project workflows",
                    "Industry best practices and certification readiness",
                  ],
              requirements: found.requirements?.length
                ? found.requirements
                : [
                    "Basic understanding of the subject area",
                    "A computer with internet access",
                  ],
              // Use the real curriculum from the database — this is what the admin saved
              curriculum: Array.isArray(found.curriculum) && found.curriculum.length > 0
                ? found.curriculum.map((m: any) => ({
                    id: m.id,
                    title: m.title,
                    lessons: (m.lessons || []).map((l: any) => ({
                      id: l.id,
                      title: l.title,
                      durationMin: l.durationMin ?? 10,
                      type: l.type ?? "video",
                      videoUrl: l.videoUrl ?? undefined,
                      readingBody: l.readingBody ?? undefined,
                      attachmentUrl: l.attachmentUrl ?? undefined,
                      quizQuestion: l.quizQuestion ?? undefined,
                      quizOptions: l.quizOptions ?? undefined,
                      quizCorrectIndex: l.quizCorrectIndex ?? undefined,
                      quizQuestions: l.quizQuestions ?? undefined,
                      completed: false,
                      locked: l.locked ?? false,
                    })),
                  }))
                : [],
            };

            setCourse(mapped);
            const stats = getUserStats();
            let enrolled =
              stats.enrolledCourseIds.includes(mapped.id) ||
              stats.enrolledCourseIds.includes(mapped.slug);

            if (!enrolled && isUserAuthenticated()) {
              enrollInCourse(mapped);
              enrolled = true;
            }
            setIsEnrolled(enrolled);
            return;
          }
        }
      }
    } catch (err) {
      console.error("CourseDetailPage fetch error:", err);
    }

    // Fallback to local
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

  const handleSelectLesson = (mi: number, li: number) => {
    setActiveModuleIndex(mi);
    setActiveLessonIndex(li);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleSubmitQuiz = (questions: any[]) => {
    let correctCount = 0;
    let earnedMarks = 0;
    let totalMarks = 0;

    questions.forEach((q, idx) => {
      const qPoints = Number(q.points) || 10;
      totalMarks += qPoints;
      const studentAns = quizAnswers[idx];
      const isCorrect = studentAns !== undefined && studentAns === q.correctIndex;
      if (isCorrect) {
        correctCount += 1;
        earnedMarks += qPoints;
      }
    });

    const passed = correctCount > 0 && correctCount >= Math.ceil(questions.length * 0.5);
    setQuizScore({
      correctCount,
      totalCount: questions.length,
      earnedMarks,
      totalMarks,
      passed,
    });
    setQuizSubmitted(true);

    if (passed && currentLesson) {
      handleToggleLessonComplete(currentLesson.id);
    }
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
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
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
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
                  <div className="mt-6 space-y-6">
                    {/* If there is a video URL or type is video, render the video player */}
                    {(currentLesson.type === "video" || currentLesson.videoUrl) && (
                      <div>
                        {currentLesson.videoUrl ? (
                          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-950 border border-border shadow-md">
                            {currentLesson.videoUrl.includes("youtube.com") || currentLesson.videoUrl.includes("vimeo.com") ? (
                              <iframe
                                src={currentLesson.videoUrl.replace("watch?v=", "embed/")}
                                title={currentLesson.title}
                                className="h-full w-full"
                                allowFullScreen
                              />
                            ) : (
                              <video
                                key={currentLesson.videoUrl}
                                src={currentLesson.videoUrl}
                                controls
                                autoPlay={false}
                                playsInline
                                preload="metadata"
                                className="h-full w-full object-contain bg-black"
                              />
                            )}
                          </div>
                        ) : (
                          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900 border border-border flex flex-col items-center justify-center text-white p-6 shadow-md">
                            <PlayCircle size={64} className="text-[#920090] hover:scale-110 transition cursor-pointer" />
                            <p className="mt-4 font-serif text-base font-medium">Interactive Video Lesson Player</p>
                            <p className="text-xs font-mono text-slate-300">Duration: {currentLesson.durationMin} minutes</p>
                          </div>
                        )}

                        <div className="mt-6 rounded-xl bg-surface-2 p-5 border border-border">
                          <h4 className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">Lesson Notes & Key Takeaways</h4>
                          <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                            {currentLesson.readingBody || `In this lesson, you will master the foundational mechanics of ${currentLesson.title}. Follow along with the instructor, complete the interactive content, and review the materials.`}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Article Reading content */}
                    {currentLesson.type === "reading" && !currentLesson.videoUrl && (
                      <div className="space-y-4 text-xs text-ink-muted leading-relaxed">
                        <div className="rounded-xl bg-surface-2 p-5 border border-border">
                          <h4 className="font-serif text-base font-medium text-ink">Article Guide: {currentLesson.title}</h4>
                          <p className="mt-2 text-ink-muted whitespace-pre-line leading-relaxed">
                            {currentLesson.readingBody || "Welcome to this reading module. Read through the architectural overview and code examples carefully before marking the lesson as finished."}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Attached Note & Downloadable Resource for ANY lesson */}
                    {currentLesson.attachmentUrl && (
                      <div className="rounded-xl bg-purple-50/80 dark:bg-purple-950/30 p-4 border border-purple-200 dark:border-purple-900/50 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#520051] text-white shadow-sm">
                            <FileText size={22} />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#920090] font-mono">Downloadable Resource</span>
                            <h5 className="font-bold text-sm text-[#520051] dark:text-purple-300">
                              {currentLesson.attachmentUrl.split("/").pop() || "Course Resource File"}
                            </h5>
                            <p className="text-[11px] font-mono text-slate-500 truncate max-w-sm">{currentLesson.attachmentUrl}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`/api/download?url=${encodeURIComponent(currentLesson.attachmentUrl)}`}
                            download={currentLesson.attachmentUrl.split("/").pop() || "resource.pdf"}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#520051] px-4 py-2 text-xs font-bold text-white hover:bg-[#920090] transition shadow-sm"
                          >
                            Download Attachment ⤓
                          </a>
                        </div>
                      </div>
                    )}

                    {currentLesson.type === "quiz" && (() => {
                      const questions =
                        currentLesson.quizQuestions && currentLesson.quizQuestions.length > 0
                          ? currentLesson.quizQuestions
                          : currentLesson.quizQuestion
                          ? [
                              {
                                id: 1,
                                question: currentLesson.quizQuestion,
                                options: currentLesson.quizOptions && currentLesson.quizOptions.length > 0 ? currentLesson.quizOptions : ["Option A", "Option B", "Option C", "Option D"],
                                correctIndex: currentLesson.quizCorrectIndex ?? 0,
                                points: 10,
                              },
                            ]
                          : [];

                      const allAnswered = questions.length > 0 && questions.every((_, idx) => quizAnswers[idx] !== undefined);
                      const totalPossibleMarks = questions.reduce((sum, q) => sum + (Number(q.points) || 10), 0);

                      return (
                        <div className="space-y-6">
                          <div className="rounded-2xl bg-surface-2 p-6 border border-border space-y-6 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                              <div className="flex items-center gap-2 text-xs font-mono text-primary font-bold">
                                <HelpCircle size={18} />
                                <span className="uppercase tracking-wider">Knowledge Check Assessment</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-mono font-bold text-primary">
                                  {questions.length} Question{questions.length > 1 ? "s" : ""}
                                </span>
                                <span className="rounded-full bg-purple-100 dark:bg-purple-950 px-3 py-1 text-xs font-mono font-bold text-[#520051] dark:text-purple-300">
                                  {totalPossibleMarks} Total Marks
                                </span>
                              </div>
                            </div>

                            {/* Score Summary Banner if submitted */}
                            {quizSubmitted && quizScore && (
                              <div
                                className={`rounded-xl p-5 border flex flex-wrap items-center justify-between gap-4 ${
                                  quizScore.passed
                                    ? "border-emerald-500/80 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                                    : "border-red-500/80 bg-red-50/80 dark:bg-red-950/40 text-red-900 dark:text-red-200"
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl">
                                      {quizScore.passed ? "🎉" : "📝"}
                                    </span>
                                    <h4 className="font-serif text-base font-bold">
                                      {quizScore.passed ? "Assessment Passed!" : "Assessment Needs Review"}
                                    </h4>
                                  </div>
                                  <p className="text-xs">
                                    Score: <strong className="text-sm font-bold">{quizScore.correctCount} / {quizScore.totalCount}</strong> questions correct (
                                    {Math.round((quizScore.earnedMarks / (quizScore.totalMarks || 1)) * 100)}%) —{" "}
                                    <strong className="text-sm font-bold">{quizScore.earnedMarks} / {quizScore.totalMarks} Marks</strong> awarded!
                                  </p>
                                  <p className="text-[11px] text-ink-muted">
                                    {quizScore.passed
                                      ? "You answered the required questions correctly according to instructor marking."
                                      : "Only questions matching the instructor-marked answer receive points. Review answers below and retake if needed."}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={handleRetakeQuiz}
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-current bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold shadow-xs hover:opacity-90 transition cursor-pointer"
                                >
                                  Retake Quiz ↺
                                </button>
                              </div>
                            )}

                            {/* Questions list */}
                            <div className="space-y-6">
                              {questions.map((q, qIdx) => {
                                const studentChoice = quizAnswers[qIdx];
                                const isCorrect = studentChoice !== undefined && studentChoice === q.correctIndex;
                                const qPoints = Number(q.points) || 10;

                                return (
                                  <div
                                    key={q.id || qIdx}
                                    className={`rounded-xl border p-5 space-y-4 transition ${
                                      quizSubmitted
                                        ? isCorrect
                                          ? "border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20"
                                          : "border-red-300 bg-red-50/40 dark:bg-red-950/20"
                                        : "border-border bg-surface"
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-start gap-2.5">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/15 text-xs font-bold text-primary mt-0.5">
                                          {qIdx + 1}
                                        </span>
                                        <h4 className="font-serif text-sm font-medium text-ink leading-relaxed">
                                          {q.question || `Question ${qIdx + 1}`}
                                        </h4>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-[11px] font-mono font-bold text-ink-muted bg-surface-2 px-2.5 py-0.5 rounded-md border border-border">
                                          {qPoints} pts
                                        </span>
                                        {quizSubmitted && (
                                          isCorrect ? (
                                            <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white flex items-center gap-1">
                                              <CheckCircle2 size={12} /> +{qPoints} pts
                                            </span>
                                          ) : (
                                            <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold text-white flex items-center gap-1">
                                              0 / {qPoints} pts
                                            </span>
                                          )
                                        )}
                                      </div>
                                    </div>

                                    {/* Options */}
                                    <div className="space-y-2">
                                      {q.options.map((option: string, optIdx: number) => {
                                        const isSelected = studentChoice === optIdx;
                                        const isTargetAnswer = q.correctIndex === optIdx;
                                        const letter = String.fromCharCode(65 + optIdx);

                                        let optionClasses = "border-border bg-surface-2 text-ink-muted hover:border-primary/60 hover:bg-surface";
                                        let badge = null;

                                        if (quizSubmitted) {
                                          if (isSelected && isTargetAnswer) {
                                            optionClasses = "border-emerald-600 bg-emerald-100/70 dark:bg-emerald-950/60 font-semibold text-emerald-900 dark:text-emerald-200 shadow-xs";
                                            badge = (
                                              <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shrink-0">
                                                ✓ Correct Answer (+{qPoints} marks)
                                              </span>
                                            );
                                          } else if (isSelected && !isTargetAnswer) {
                                            optionClasses = "border-red-500 bg-red-100/70 dark:bg-red-950/60 font-semibold text-red-900 dark:text-red-200 shadow-xs";
                                            badge = (
                                              <span className="rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white shrink-0">
                                                ✗ Your Selection (Incorrect)
                                              </span>
                                            );
                                          } else if (isTargetAnswer) {
                                            optionClasses = "border-emerald-500/70 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-semibold";
                                            badge = (
                                              <span className="rounded-md bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-white shrink-0">
                                                ✓ Instructor's Answer
                                              </span>
                                            );
                                          }
                                        } else if (isSelected) {
                                          optionClasses = "border-primary bg-primary/15 font-semibold text-primary shadow-xs";
                                        }

                                        return (
                                          <button
                                            key={optIdx}
                                            type="button"
                                            disabled={quizSubmitted}
                                            onClick={() => {
                                              if (!quizSubmitted) {
                                                setQuizAnswers((prev) => ({
                                                  ...prev,
                                                  [qIdx]: optIdx,
                                                }));
                                              }
                                            }}
                                            className={`w-full text-left rounded-xl p-3 text-xs transition border flex items-center justify-between gap-3 ${optionClasses}`}
                                          >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                              <span
                                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${
                                                  isSelected
                                                    ? "bg-primary text-white"
                                                    : "bg-surface text-ink-muted border border-border"
                                                }`}
                                              >
                                                {letter}
                                              </span>
                                              <span className="truncate">{option}</span>
                                            </div>
                                            {badge}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Submit Button */}
                            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
                              <span className="text-xs font-mono text-ink-muted">
                                {!quizSubmitted
                                  ? `${Object.keys(quizAnswers).length} of ${questions.length} question${questions.length > 1 ? "s" : ""} answered`
                                  : `Completed ${quizScore?.correctCount || 0}/${questions.length} correct`}
                              </span>

                              {!quizSubmitted ? (
                                <button
                                  type="button"
                                  onClick={() => handleSubmitQuiz(questions)}
                                  disabled={!allAnswered}
                                  className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-fg hover:opacity-90 disabled:opacity-50 transition shadow-sm cursor-pointer"
                                >
                                  Submit Quiz Assessment
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleRetakeQuiz}
                                  className="rounded-xl border border-border bg-surface px-5 py-2 text-xs font-semibold text-ink-muted hover:text-ink transition cursor-pointer"
                                >
                                  Try Again ↺
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
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
                              onClick={() => handleSelectLesson(mi, li)}
                              className={`w-full flex items-center justify-between p-3 text-left transition text-xs ${
                                isActive ? "bg-primary/15 font-semibold text-primary" : "hover:bg-surface text-ink-muted"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {isDone ? (
                                  <CheckCircle2 size={14} className="text-accent shrink-0" />
                                ) : les.videoUrl || les.type === "video" ? (
                                  <PlayCircle size={14} className="text-primary shrink-0" />
                                ) : les.type === "quiz" ? (
                                  <HelpCircle size={14} className="text-primary shrink-0" />
                                ) : (
                                  <FileText size={14} className="text-accent shrink-0" />
                                )}
                                <span className="truncate">{les.title}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                {les.attachmentUrl && (
                                  <span className="text-[11px]" title="Resource attachment available">📎</span>
                                )}
                                {les.videoUrl && (
                                  <span className="text-[11px]" title="Video lesson available">🎥</span>
                                )}
                                <span className="text-[10px] font-mono text-ink-muted">{les.durationMin}m</span>
                              </div>
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


