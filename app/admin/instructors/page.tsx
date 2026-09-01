"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserCheck,
  Plus,
  Search,
  BookOpen,
  Users,
  Star,
  Trash2,
  Edit,
  GraduationCap,
  X,
  Check,
  Sparkles,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  getStoredInstructors,
  saveCustomInstructor,
  deleteStoredInstructor,
} from "@/lib/mock/instructors";
import { Instructor } from "@/lib/types";
import { useAdminAuth } from "@/lib/context/admin-auth-context";

export default function AdminInstructorsPage() {
  const { addActivity } = useAdminAuth();
  const [instructorsList, setInstructorsList] = useState<Instructor[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [avatarColor, setAvatarColor] = useState("from-purple-500 to-indigo-500");

  const loadInstructors = async () => {
    try {
      const res = await fetch("/api/admin/instructors");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.instructors)) {
          const mapped: Instructor[] = data.instructors.map((i: any) => ({
            id: i.id,
            name: i.name,
            title: i.title || "Subject Specialist",
            bio: i.bio || "Lead Educator & Subject Specialist at UNIGAP",
            avatarColor: i.avatar || "from-purple-500 to-indigo-500",
            rating: typeof i.rating === "number" ? i.rating : 5.0,
            courses: i.coursesCount || 0,
            learners: i.studentsCount || 0,
          }));
          setInstructorsList(mapped);
          setLoading(false);
          return;
        }
      }
    } catch {
      // fallback to local stored
    }
    setInstructorsList(getStoredInstructors());
    setLoading(false);
  };

  useEffect(() => {
    loadInstructors();
    window.addEventListener("unigap_instructors_updated", loadInstructors);
    return () => window.removeEventListener("unigap_instructors_updated", loadInstructors);
  }, []);

  const filtered = instructorsList.filter(
    (ins) =>
      ins.name.toLowerCase().includes(search.toLowerCase()) ||
      ins.title.toLowerCase().includes(search.toLowerCase()) ||
      (ins.bio && ins.bio.toLowerCase().includes(search.toLowerCase()))
  );

  const openAddModal = () => {
    setEditingInstructor(null);
    setName("");
    setTitle("");
    setBio("");
    setAvatarColor("from-purple-500 to-indigo-500");
    setIsModalOpen(true);
  };

  const openEditModal = (ins: Instructor) => {
    setEditingInstructor(ins);
    setName(ins.name);
    setTitle(ins.title);
    setBio(ins.bio || "");
    setAvatarColor(ins.avatarColor || "from-purple-500 to-indigo-500");
    setIsModalOpen(true);
  };

  const handleSaveInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter instructor name.");
      return;
    }

    if (editingInstructor) {
      // EDIT INSTRUCTOR (PATCH)
      try {
        const res = await fetch("/api/admin/instructors", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingInstructor.id,
            name: name.trim(),
            title: title.trim() || "Course Instructor & Subject Specialist",
            bio: bio.trim() || "Lead Educator at UNIGAP",
            avatar: avatarColor,
          }),
        });

        if (res.ok) {
          const updatedIns: Instructor = {
            ...editingInstructor,
            name: name.trim(),
            title: title.trim() || "Course Instructor & Subject Specialist",
            bio: bio.trim() || "Lead Educator at UNIGAP",
            avatarColor: avatarColor,
          };
          saveCustomInstructor(updatedIns);
          await loadInstructors();
          addActivity("Updated Instructor", `Edited instructor: ${name}`);
          alert(`Instructor "${name}" updated in PostgreSQL database!`);
          setIsModalOpen(false);
          setEditingInstructor(null);
          return;
        }
      } catch (err) {
        console.error("Update instructor error:", err);
      }

      // Fallback local edit
      const fallbackEdit: Instructor = {
        ...editingInstructor,
        name: name.trim(),
        title: title.trim() || "Course Instructor & Subject Specialist",
        bio: bio.trim() || "Lead Educator at UNIGAP",
        avatarColor: avatarColor,
      };
      saveCustomInstructor(fallbackEdit);
      loadInstructors();
      alert(`Instructor "${name}" updated!`);
      setIsModalOpen(false);
      setEditingInstructor(null);
      return;
    }

    // CREATE NEW INSTRUCTOR (POST)
    const newInsData = {
      name: name.trim(),
      email: `${name.toLowerCase().replace(/[^a-z0-9]/g, ".")}@unigap.edu`,
      title: title.trim() || "Course Instructor & Subject Specialist",
      bio: bio.trim() || "Lead Educator at UNIGAP",
      avatar: avatarColor,
    };

    try {
      const res = await fetch("/api/admin/instructors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInsData),
      });

      if (res.ok) {
        const result = await res.json();
        const createdIns: Instructor = {
          id: result.instructor.id,
          name: result.instructor.name,
          title: result.instructor.title,
          bio: result.instructor.bio,
          avatarColor: avatarColor,
          rating: 5.0,
          courses: 0,
          learners: 0,
        };
        saveCustomInstructor(createdIns);
        await loadInstructors();
        addActivity("Created Instructor", `Added instructor: ${name}`);
        alert(`Instructor "${name}" saved to PostgreSQL database!`);

        // Reset & close
        setName("");
        setTitle("");
        setBio("");
        setIsModalOpen(false);
        return;
      }
    } catch (err) {
      console.error("Save instructor error:", err);
    }

    // Fallback local save
    const fallbackIns: Instructor = {
      id: `ins-${Date.now()}`,
      name: name.trim(),
      title: title.trim() || "Course Instructor & Subject Specialist",
      bio: bio.trim() || "Lead Educator at UNIGAP",
      avatarColor: avatarColor,
      rating: 5.0,
      courses: 0,
      learners: 0,
    };
    saveCustomInstructor(fallbackIns);
    loadInstructors();
    addActivity("Created Instructor", `Added instructor: ${name}`);
    alert(`Instructor "${name}" added!`);

    setName("");
    setTitle("");
    setBio("");
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, insName: string) => {
    if (confirm(`Are you sure you want to remove instructor "${insName}"?`)) {
      try {
        await fetch(`/api/admin/instructors?id=${id}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Delete instructor error:", err);
      }

      deleteStoredInstructor(id);
      await loadInstructors();
      addActivity("Deleted Instructor", `Removed instructor: ${insName}`);
    }
  };

  return (
    <AdminShell>
      <main className="px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#520051] to-[#d400d1] text-white shadow-md">
                <UserCheck size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[#520051]">
                  Instructor Management
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Register, manage, and assign platform instructors to active curriculum.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#520051] to-[#920090] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95 cursor-pointer"
          >
            <Plus size={18} /> Add New Instructor
          </button>
        </div>

        {/* Search & Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#eee5ee] bg-white p-4 shadow-xs">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search instructors by name, title, or bio..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10"
            />
          </div>

          <span className="text-xs font-semibold text-slate-500">
            Total Instructors: <strong className="text-[#520051]">{instructorsList.length}</strong>
          </span>
        </div>

        {/* Instructors Grid / Empty State */}
        {filtered.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((ins) => (
              <div
                key={ins.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#eee5ee] bg-white p-5 shadow-xs transition hover:border-[#920090]/30 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${ins.avatarColor || "from-purple-500 to-indigo-500"} text-base font-extrabold text-white shadow-xs`}
                      >
                        {ins.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#520051] group-hover:text-[#920090]">
                          {ins.name}
                        </h3>
                        <p className="mt-0.5 text-xs font-semibold text-[#920090]">{ins.title}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(ins)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-purple-50 hover:text-[#920090] transition cursor-pointer"
                        title="Edit instructor"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(ins.id, ins.name)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition cursor-pointer"
                        title="Remove instructor"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Instructor Bio Snippet */}
                  <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    &quot;{ins.bio || "Lead Educator & Subject Specialist at UNIGAP"}&quot;
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-[#faf5fa] p-3 text-center text-xs">
                    <div>
                      <span className="block font-extrabold text-[#520051]">
                        {ins.courses || 0}
                      </span>
                      <span className="text-[10px] text-slate-500">Courses</span>
                    </div>
                    <div>
                      <span className="block font-extrabold text-[#520051]">
                        {(ins.learners || 0).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500">Students</span>
                    </div>
                    <div>
                      <span className="block font-extrabold text-[#520051]">
                        {ins.rating ? `★ ${ins.rating}` : "5.0"}
                      </span>
                      <span className="text-[10px] text-slate-500">Rating</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f3e5f3] flex items-center justify-between text-xs font-semibold text-[#920090]">
                  <span className="inline-flex items-center gap-1">
                    <Check size={14} className="text-emerald-500" /> Active Instructor
                  </span>
                  <Link href="/admin/courses/create" className="hover:underline">
                    Assign Course →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-[#eee5ee] bg-white p-16 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#faf5fa] text-[#520051]">
              <UserCheck size={24} />
            </div>
            <h3 className="mt-4 text-base font-bold text-[#520051]">No Instructors Registered Yet</h3>
            <p className="mt-1 text-xs text-slate-500">
              Click &quot;Add New Instructor&quot; above to register instructors and assign them to published courses.
            </p>
          </div>
        )}

        {/* Modal for Adding / Editing Instructor */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-[#520051]">
                  <Sparkles size={20} className="text-[#920090]" />
                  <h3 className="text-lg font-extrabold">
                    {editingInstructor ? "Edit Instructor" : "Add New Instructor"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveInstructor} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#520051]">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Jenkins"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#520051]">Title & Role</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Fullstack Educator"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#520051]">Instructor Bio / Background</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Brief bio describing teaching experience, research, and technical specialization..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-[#920090] focus:ring-4 focus:ring-[#920090]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#520051]">Avatar Gradient Theme</label>
                  <select
                    value={avatarColor}
                    onChange={(e) => setAvatarColor(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-[#920090]"
                  >
                    <option value="from-purple-500 to-indigo-500">Purple Gradient</option>
                    <option value="from-pink-500 to-[#920090]">Pink & Royal Purple</option>
                    <option value="from-emerald-500 to-teal-600">Emerald Green</option>
                    <option value="from-amber-500 to-orange-600">Amber Gold</option>
                    <option value="from-blue-600 to-indigo-700">Royal Blue</option>
                  </select>
                </div>

                <div className="pt-4 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#520051] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-[#920090] transition cursor-pointer"
                  >
                    {editingInstructor ? "Save Changes" : "Create Instructor"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </AdminShell>
  );
}
