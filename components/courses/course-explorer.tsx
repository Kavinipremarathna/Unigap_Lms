"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  BookOpen,
  Sparkles,
  Layers,
  GraduationCap,
  X,
  Compass,
} from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubpageHeroHeader } from "@/components/ui/subpage-hero-header";
import { cn } from "@/lib/utils";

import { getStoredCourses, categories as defaultCategories } from "@/lib/mock/courses";
import { Level, Course } from "@/lib/types";

const levels: Level[] = ["Beginner", "Intermediate", "Advanced"];
type Sort = "popular" | "rating" | "newest" | "price-low";

interface CourseExplorerProps {
  variant?: "dashboard" | "public";
}

export function CourseExplorer({ variant = "public" }: CourseExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [sort, setSort] = useState<Sort>("popular");
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  useEffect(() => {
    const loadCoursesFromDb = async () => {
      try {
        const res = await fetch("/api/admin/courses");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.courses)) {
            const mapped: Course[] = data.courses.map((c: any) => ({
              id: c.id,
              slug: c.slug,
              title: c.title,
              shortDescription: c.shortDescription || c.description,
              description: c.description,
              category: c.category,
              level: (c.level as Level) || "Beginner",
              durationHours: c.durationHours || 10,
              rating: typeof c.rating === "number" ? c.rating : 5.0,
              reviewCount: 12,
              learners: c.studentsCount || 0,
              price: Number(c.price) || 0,
              isFree: c.isFree,
              instructorId: c.instructorId,
              instructorName: c.instructorName,
              gradient: ["#520051", "#920090"],
              outcomes: [],
              requirements: [],
              status: c.status,
              isPublished: c.isPublished,
              thumbnailUrl: c.thumbnailUrl || null,
            }));
            setAllCourses(mapped);
            return;
          }
        }
      } catch (err) {
        console.error("Fetch courses in CourseExplorer error:", err);
      }
      setAllCourses(getStoredCourses());
    };

    loadCoursesFromDb();
    window.addEventListener("unigap_courses_updated", loadCoursesFromDb);
    return () => window.removeEventListener("unigap_courses_updated", loadCoursesFromDb);
  }, []);

  const categories = useMemo(() => {
    const list = Array.from(new Set([...defaultCategories, ...allCourses.map((c) => c.category)]));
    return list;
  }, [allCourses]);

  const filtered = useMemo(() => {
    let list = allCourses.filter((c) => {
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.shortDescription?.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      const matchesCategory = !category || c.category === category;
      const matchesLevel = !level || c.level === level;
      return matchesQuery && matchesCategory && matchesLevel;
    });

    switch (sort) {
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "newest":
        list = [...list].reverse();
        break;
      default:
        list = [...list].sort((a, b) => b.learners - a.learners);
    }
    return list;
  }, [allCourses, query, category, level, sort]);

  const hasActiveFilters = Boolean(query || category || level || sort !== "popular");

  const resetFilters = () => {
    setQuery("");
    setCategory(null);
    setLevel(null);
    setSort("popular");
  };

  const isDashboard = variant === "dashboard";

  return (
    <div className={isDashboard ? "container-app py-8" : "container-app py-10"}>
      {/* Unified Header Section */}
      <SubpageHeroHeader
        icon={Compass}
        badgeText="Course Catalog"
        title="Explore Courses"
        description="Discover industry-aligned curriculum, master real-world skills, and earn verified certificates across UNIGAP."
        rightContent={
          <div className="flex items-center gap-3">
            <div className="rounded-[4px] border border-border bg-surface p-3.5 sm:min-w-[120px]">
              <div className="flex items-center gap-2 text-ink-muted">
                <BookOpen size={16} />
                <span className="text-xs font-mono uppercase tracking-wider">Courses</span>
              </div>
              <p className="mt-1 font-mono text-xl font-bold text-primary sm:text-2xl">{allCourses.length}</p>
            </div>

            <div className="rounded-[4px] border border-border bg-surface p-3.5 sm:min-w-[120px]">
              <div className="flex items-center gap-2 text-ink-muted">
                <Layers size={16} />
                <span className="text-xs font-mono uppercase tracking-wider">Tracks</span>
              </div>
              <p className="mt-1 font-mono text-xl font-bold text-accent sm:text-2xl">{categories.length}</p>
            </div>
          </div>
        }
      />


      {/* Search & Control Bar */}
      <div className={cn("mt-8 space-y-4", isDashboard && "mt-6")}>
        <div className="relative flex items-center rounded-[4px] border border-border bg-surface px-4 py-3 shadow-sm transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
          <Search size={18} className="text-ink-muted shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by course title, topic, or keyword..."
            className="w-full bg-transparent px-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
            aria-label="Search courses"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-[4px] p-1 text-ink-muted hover:bg-surface-2 hover:text-ink"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={cn(
              "rounded-[4px] px-3.5 py-1.5 text-xs font-mono font-medium transition",
              category === null
                ? "bg-primary text-primary-fg font-semibold"
                : "bg-surface border border-border text-ink-muted hover:bg-surface-2 hover:text-ink"
            )}
          >
            All Categories ({allCourses.length})
          </button>
          {categories.map((c) => {
            const count = allCourses.filter((course) => course.category === c).length;
            const isSelected = category === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(isSelected ? null : c)}
                className={cn(
                  "rounded-[4px] px-3.5 py-1.5 text-xs font-mono font-medium transition flex items-center gap-1.5",
                  isSelected
                    ? "bg-primary text-primary-fg font-semibold"
                    : "bg-surface border border-border text-ink-muted hover:bg-surface-2 hover:text-ink"
                )}
              >
                <span>{c}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px]",
                    isSelected ? "bg-primary-fg/20 text-primary-fg" : "bg-surface-2 text-ink-muted"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Header */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <p className="font-serif text-base font-medium text-ink">
              {category ? `${category} Courses` : "All Courses"}
            </p>
            <Badge variant="default" className="text-xs">
              {filtered.length} {filtered.length === 1 ? "course" : "courses"}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-ink-muted">
              Showing <strong className="text-ink">{filtered.length}</strong> of {allCourses.length}
            </span>
          </div>
        </div>

        {/* Secondary Filters & Sorter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-ink-muted">Level:</span>
            {levels.map((l) => {
              const isSelected = level === l;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(isSelected ? null : l)}
                  className={cn(
                    "rounded-[4px] border px-3 py-1.5 text-xs font-mono font-medium transition",
                    isSelected
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-surface text-ink-muted hover:bg-surface-2 hover:text-ink"
                  )}
                >
                  {l}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded-[4px] border border-dashed border-border px-2.5 py-1.5 text-xs font-mono text-ink-muted transition hover:border-red-500/50 hover:text-red-500"
              >
                <X size={13} /> Reset filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-ink-muted hidden sm:block" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-[4px] border border-border bg-surface px-3 py-1.5 text-xs font-mono text-ink focus:border-primary focus:outline-none"
                aria-label="Sort courses"
              >
                <option value="popular" className="bg-surface text-ink">Most Popular</option>
                <option value="rating" className="bg-surface text-ink">Highest Rated</option>
                <option value="newest" className="bg-surface text-ink">Newest</option>
                <option value="price-low" className="bg-surface text-ink">Price: Low to High</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center rounded-[4px] border border-dashed border-border bg-surface p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-primary">
            <BookOpen size={28} />
          </div>
          <h3 className="mt-4 font-serif text-lg font-medium text-ink">
            {allCourses.length === 0 ? "No published courses yet" : "No courses match your search criteria"}
          </h3>
          <p className="mt-1 max-w-md text-xs text-ink-muted">
            {allCourses.length === 0
              ? "The course catalog is currently empty. Published courses created by administrators will appear here automatically."
              : "We couldn't find any courses matching your search or filters. Try clearing your search or filters."}
          </p>
          {allCourses.length > 0 && (
            <Button onClick={resetFilters} variant="secondary" size="sm" className="mt-5">
              Reset All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}


