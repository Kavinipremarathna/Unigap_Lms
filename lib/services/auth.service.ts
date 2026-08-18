"use client";

export interface AuthUser {
  email: string;
  name: string;
  avatar?: string;
}

export function isUserAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const isLoggedIn = localStorage.getItem("unigap_auth_logged_in") === "true";
    const hasAdminProfile = !!localStorage.getItem("unigap_admin_profile");
    const hasUserStats = !!localStorage.getItem("unigap_user_stats");
    return isLoggedIn || hasAdminProfile || hasUserStats;
  } catch {
    return false;
  }
}

export function setAuthenticatedUser(email: string, name?: string): AuthUser {
  const user: AuthUser = {
    email,
    name: name || email.split("@")[0] || "Learner",
  };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("unigap_auth_logged_in", "true");
      localStorage.setItem("unigap_auth_user", JSON.stringify(user));
      window.dispatchEvent(new Event("unigap_auth_changed"));
    } catch {
      // fallback
    }
  }
  return user;
}

export function logoutUser(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("unigap_auth_logged_in");
      localStorage.removeItem("unigap_auth_user");
      window.dispatchEvent(new Event("unigap_auth_changed"));
    } catch {
      // fallback
    }
  }
}

export function getAuthenticatedUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("unigap_auth_user");
    if (stored) return JSON.parse(stored);
  } catch {
    // fallback
  }
  return null;
}
