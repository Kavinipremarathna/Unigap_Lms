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
    setAllCourses(getStoredCourses());
    const handleUpdate = () => {
      setAllCourses(getStoredCourses());
    };
    window.addEventListener("unigap_courses_updated", handleUpdate);
    return () => window.removeEventListener("unigap_courses_updated", handleUpdate);
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
      {/* Header section */}
      {isDashboard ? (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#520051] via-[#920090] to-[#D400D1] p-6 text-white shadow-lg sm:p-8">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <Compass size={14} className="text-pink-200" /> Course Catalog
              </span>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                Explore Courses
              </h1>
              <p className="mt-2 text-sm text-purple-100 sm:text-base">
                Discover industry-aligned curriculum, master real-world skills, and earn verified certificates.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md sm:min-w-[120px]">
                <div className="flex items-center gap-2 text-purple-200">
                  <BookOpen size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">Courses</span>
                </div>
                <p className="mt-1 text-xl font-bold sm:text-2xl">{allCourses.length}</p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md sm:min-w-[120px]">
                <div className="flex items-center gap-2 text-purple-200">
                  <Layers size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">Tracks</span>
                </div>
                <p className="mt-1 text-xl font-bold sm:text-2xl">{categories.length}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles size={14} /> Comprehensive Catalog
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Explore Courses
          </h1>
          <p className="mt-2 text-base text-ink-muted">
            {allCourses.length} courses across web development, data science, cloud architecture, design, and more.
          </p>
        </div>
      )}

      {/* Search & Control Bar */}
      <div className={cn("mt-8 space-y-4", isDashboard && "mt-6")}>
        <div className="relative flex items-center rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm transition-all focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
          <Search size={20} className="text-ink-muted shrink-0" />
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
              className="rounded-full p-1 text-ink-muted hover:bg-surface-2 hover:text-ink"
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
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
              category === null
                ? "bg-[#520051] text-white shadow-sm"
                : "bg-surface-2 text-ink-muted hover:bg-border/60 hover:text-ink"
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
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition flex items-center gap-1.5",
                  isSelected
                    ? "bg-[#520051] text-white shadow-sm"
                    : "bg-surface-2 text-ink-muted hover:bg-border/60 hover:text-ink"
                )}
              >
                <span>{c}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px]",
                    isSelected ? "bg-white/20 text-white" : "bg-border text-ink-muted"
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
            <p className="text-sm font-bold text-ink">
              {category ? `${category} Courses` : "All Courses"}
            </p>
            <Badge variant="default" className="text-xs">
              {filtered.length} {filtered.length === 1 ? "course" : "courses"}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-muted">
              Showing <strong className="text-ink">{filtered.length}</strong> of {allCourses.length}
            </span>
          </div>
        </div>

        {/* Secondary Filters & Sorter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-ink-muted">Level:</span>
            {levels.map((l) => {
              const isSelected = level === l;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(isSelected ? null : l)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                    isSelected
                      ? "border-primary bg-primary-50 text-primary shadow-xs"
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
                className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border px-2.5 py-1.5 text-xs font-medium text-ink-muted transition hover:border-error/50 hover:text-error"
              >
                <X size={13} /> Reset filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-muted">
              Showing <strong className="text-ink">{filtered.length}</strong> of {allCourses.length}
            </span>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-ink-muted hidden sm:block" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Sort courses"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
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
        <div className="mt-12 flex flex-col items-center rounded-3xl border border-dashed border-border bg-surface p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-[#520051]">
            <BookOpen size={28} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-[#520051]">
            {allCourses.length === 0 ? "No published courses yet" : "No courses match your search criteria"}
          </h3>
          <p className="mt-1 max-w-md text-xs text-slate-500">
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
