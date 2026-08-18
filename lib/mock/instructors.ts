import { Instructor } from "@/lib/types";

export const initialInstructors: Instructor[] = [];

export const instructors = initialInstructors;

export function getStoredInstructors(): Instructor[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("unigap_admin_instructors");
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomInstructor(newInstructor: Instructor): Instructor {
  if (typeof window === "undefined") return newInstructor;
  const current = getStoredInstructors();
  const existingIndex = current.findIndex((i) => i.id === newInstructor.id || i.name.toLowerCase() === newInstructor.name.toLowerCase());
  let updated: Instructor[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = { ...updated[existingIndex], ...newInstructor };
  } else {
    updated = [newInstructor, ...current];
  }
  try {
    localStorage.setItem("unigap_admin_instructors", JSON.stringify(updated));
    window.dispatchEvent(new Event("unigap_instructors_updated"));
  } catch {
    // fallback
  }
  return newInstructor;
}

export function deleteStoredInstructor(id: string): void {
  if (typeof window === "undefined") return;
  const current = getStoredInstructors();
  const updated = current.filter((i) => i.id !== id);
  try {
    localStorage.setItem("unigap_admin_instructors", JSON.stringify(updated));
    window.dispatchEvent(new Event("unigap_instructors_updated"));
  } catch {
    // fallback
  }
}
