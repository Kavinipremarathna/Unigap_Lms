"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type AdminRole = "super_admin" | "admin" | "learner";

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar: string;
  department: string;
  phone: string;
  location: string;
  bio: string;
  joinedDate: string;
}

export interface AdminActivity {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  role: AdminRole;
}

export function isRouteAllowedForRole(pathname: string, role: AdminRole | string): boolean {
  const normRole = (role || "").toLowerCase().replace("-", "_");

  // 1. SUPER_ADMIN: Full access to every admin page & feature without restriction
  if (normRole === "super_admin" || normRole === "superadmin") {
    return true;
  }

  // 2. ADMIN: Access ONLY to course management, dashboard, and admin profile
  if (normRole === "admin") {
    if (
      pathname === "/admin" ||
      pathname === "/admin/" ||
      pathname.startsWith("/admin/courses") ||
      pathname.startsWith("/admin/profile")
    ) {
      return true;
    }
    // All non-course admin routes are DENIED for ADMIN
    return false;
  }

  // 3. USER / STUDENT: Denied all /admin routes
  return false;
}

interface AdminAuthContextType {
  admin: AdminProfile;
  role: AdminRole;
  setRole: (role: AdminRole) => void;
  updateProfile: (data: Partial<AdminProfile>) => void;
  activities: AdminActivity[];
  addActivity: (action: string, target: string) => void;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isUser: boolean;
  canEditUsers: boolean;
  canManageBilling: boolean;
  canManageSystem: boolean;
  canManageContent: boolean;
  canManageCourses: boolean;
}

const defaultAdminProfile: AdminProfile = {
  id: "adm-001",
  name: "Alexander Reed",
  email: "alexander.reed@unigap.edu",
  role: "super_admin",
  avatar: "AR",
  department: "Academic Operations & Curriculum",
  phone: "+1 (555) 349-8812",
  location: "San Francisco, CA",
  bio: "Lead LMS Administrator overseeing global course curriculum, instructor certifications, platform operations, and enterprise learning tracks.",
  joinedDate: "January 2025",
};

const initialActivities: AdminActivity[] = [
  {
    id: "act-1",
    action: "Updated Course Curriculum",
    target: "Fullstack Next.js & React Masterclass",
    timestamp: "10 minutes ago",
    role: "admin",
  },
  {
    id: "act-2",
    action: "Published Announcement Banner",
    target: "Landing Page: Fall 2026 Cohort Registration",
    timestamp: "1 hour ago",
    role: "admin",
  },
  {
    id: "act-3",
    action: "Created Achievement Badge",
    target: "Speed Demon: 5 lessons in 24 hours",
    timestamp: "3 hours ago",
    role: "admin",
  },
  {
    id: "act-4",
    action: "Configured Payment Gateway",
    target: "Stripe & PayPal Live Integration",
    timestamp: "1 day ago",
    role: "super_admin",
  },
  {
    id: "act-5",
    action: "System Security Audit",
    target: "Rotated API credentials & updated rate limits",
    timestamp: "2 days ago",
    role: "super_admin",
  },
];

const fallbackContextValue: AdminAuthContextType = {
  admin: defaultAdminProfile,
  role: "super_admin",
  setRole: () => {},
  updateProfile: () => {},
  activities: initialActivities,
  addActivity: () => {},
  isSuperAdmin: true,
  isAdmin: false,
  isUser: false,
  canEditUsers: true,
  canManageBilling: true,
  canManageSystem: true,
  canManageContent: true,
  canManageCourses: true,
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  // Read saved role lazily on initial render so role state NEVER resets on page navigation
  const [admin, setAdmin] = useState<AdminProfile>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedRole = localStorage.getItem("unigap_admin_role") as AdminRole | null;
        const savedProfile = localStorage.getItem("unigap_admin_profile");
        const profile = savedProfile ? JSON.parse(savedProfile) : defaultAdminProfile;
        if (savedRole && (savedRole === "super_admin" || savedRole === "admin" || savedRole === "learner")) {
          return { ...profile, role: savedRole };
        }
        return profile;
      } catch {
        // fallback to default
      }
    }
    return defaultAdminProfile;
  });

  const [activities, setActivities] = useState<AdminActivity[]>(initialActivities);

  const handleSetRole = (newRole: AdminRole) => {
    setAdmin((prev) => {
      const updated = { ...prev, role: newRole };
      try {
        localStorage.setItem("unigap_admin_role", newRole);
      } catch {
        // ignore
      }
      return updated;
    });

    addActivity(
      "Switched Active Role",
      `Now acting as ${
        newRole === "super_admin" ? "SUPER_ADMIN" : newRole === "admin" ? "ADMIN" : "USER/STUDENT"
      }`
    );
  };

  const handleUpdateProfile = (data: Partial<AdminProfile>) => {
    setAdmin((prev) => {
      const updated = { ...prev, ...data };
      try {
        localStorage.setItem("unigap_admin_profile", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    addActivity("Updated Admin Profile", "Modified personal profile and preferences");
  };

  const addActivity = (action: string, target: string) => {
    const newAct: AdminActivity = {
      id: `act-${Date.now()}`,
      action,
      target,
      timestamp: "Just now",
      role: admin.role,
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 19)]);
  };

  const isSuperAdmin = admin.role === "super_admin";
  const isAdmin = admin.role === "admin";
  const isUser = admin.role === "learner";

  const canEditUsers = isSuperAdmin;
  const canManageBilling = isSuperAdmin;
  const canManageSystem = isSuperAdmin;
  const canManageContent = isSuperAdmin;
  const canManageCourses = true; // Both Super Admin and Admin

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        role: admin.role,
        setRole: handleSetRole,
        updateProfile: handleUpdateProfile,
        activities,
        addActivity,
        isSuperAdmin,
        isAdmin,
        isUser,
        canEditUsers,
        canManageBilling,
        canManageSystem,
        canManageContent,
        canManageCourses,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    return fallbackContextValue;
  }
  return context;
}
