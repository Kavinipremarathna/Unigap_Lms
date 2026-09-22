"use client";

export interface AuthUser {
  id?: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

const NESTJS_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export function isUserAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const isLoggedIn = localStorage.getItem("unigap_auth_logged_in") === "true";
    const authUser = localStorage.getItem("unigap_auth_user");
    if (!isLoggedIn || !authUser) return false;
    const u = JSON.parse(authUser);
    const roleStr = String(u.role || "").toUpperCase();
    if (roleStr === "SUPER_ADMIN" || roleStr === "ADMIN" || u.email?.includes("admin@unigap")) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const hasAdminProfile = !!localStorage.getItem("unigap_admin_profile");
    const adminRole = localStorage.getItem("unigap_admin_role");
    return hasAdminProfile || adminRole === "super_admin" || adminRole === "admin";
  } catch {
    return false;
  }
}

export async function loginWithNestJS(email: string, pass: string): Promise<{ token: string; user: AuthUser }> {
  let response: Response;
  try {
    response = await fetch(`${NESTJS_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password: pass }),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`NestJS login endpoint status: ${response.status}`);
    }
  } catch {
    // Fallback to Next.js internal API route if NestJS server is not reachable or returns error
    response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password: pass }),
    });
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed. Please check your credentials.");
  }

  const user: AuthUser = {
    id: data.user?.id,
    email: data.user?.email || email,
    name: data.user?.name || email.split("@")[0],
    role: data.user?.role,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("unigap_auth_logged_in", "true");
      localStorage.setItem("unigap_auth_token", data.token || "");
      localStorage.setItem("unigap_auth_user", JSON.stringify(user));
      window.dispatchEvent(new Event("unigap_auth_changed"));
    } catch {
      // fallback
    }
  }

  return { token: data.token || "", user };
}

export async function registerWithNestJS(name: string, email: string, pass: string): Promise<{ token: string; user: AuthUser }> {
  let response: Response;
  try {
    response = await fetch(`${NESTJS_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), password: pass }),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`NestJS register endpoint status: ${response.status}`);
    }
  } catch {
    // Fallback to Next.js internal API route if NestJS server is not reachable or returns error
    response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), password: pass }),
    });
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed. Please try again.");
  }

  const user: AuthUser = {
    id: data.user?.id,
    email: data.user?.email || email,
    name: data.user?.name || name,
    role: data.user?.role,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("unigap_auth_logged_in", "true");
      localStorage.setItem("unigap_auth_token", data.token || "");
      localStorage.setItem("unigap_auth_user", JSON.stringify(user));
      window.dispatchEvent(new Event("unigap_auth_changed"));
    } catch {
      // fallback
    }
  }

  return { token: data.token || "", user };
}

export async function updateUserProfileInDB(
  currentEmail: string,
  name: string,
  newEmail: string
): Promise<AuthUser> {
  let response: Response;
  try {
    response = await fetch("/api/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentEmail, name, email: newEmail }),
    });
  } catch {
    throw new Error("Unable to connect to database server.");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to save profile changes to database.");
  }

  const updatedUser: AuthUser = {
    id: data.user?.id,
    email: data.user?.email || newEmail,
    name: data.user?.name || name,
    role: data.user?.role,
  };

  if (typeof window !== "undefined") {
    try {
      if (data.token) {
        localStorage.setItem("unigap_auth_token", data.token);
      }
      localStorage.setItem("unigap_auth_user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("unigap_auth_changed"));
    } catch {
      // fallback
    }
  }


  return updatedUser;
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
      localStorage.removeItem("unigap_auth_token");
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
    if (stored) {
      const u = JSON.parse(stored);
      const roleStr = String(u.role || "").toUpperCase();
      if (roleStr === "SUPER_ADMIN" || roleStr === "ADMIN" || u.email?.includes("admin@unigap")) {
        return null;
      }
      return u;
    }
  } catch {
    // fallback
  }
  return null;
}
