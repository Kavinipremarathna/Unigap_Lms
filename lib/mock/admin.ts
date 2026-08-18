export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "learner" | "instructor" | "admin";
  status: "active" | "suspended" | "pending";
  avatar: string;
  enrolledCoursesCount: number;
  completedCoursesCount: number;
  joinedDate: string;
  lastActive: string;
  xp: number;
  streak: number;
  plan: "Free" | "Pro Monthly" | "Pro Annual";
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  planName: string;
  status: "completed" | "refunded" | "failed" | "pending";
  date: string;
  paymentMethod: string;
}

export interface IssuedCertificate {
  id: string;
  certificateHash: string;
  recipientName: string;
  recipientEmail: string;
  courseTitle: string;
  issueDate: string;
  grade: string;
  status: "valid" | "revoked";
}

export interface SystemSetting {
  siteName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  aiModel: string;
  aiCreativity: number;
  dailyNudgeLimit: number;
  allowPublicRegistrations: boolean;
  currencySymbol: string;
}

export const mockAdminUsers: AdminUser[] = [];
export const mockTransactions: PaymentTransaction[] = [];
export const mockCertificates: IssuedCertificate[] = [];

export const mockSettings: SystemSetting = {
  siteName: "UNIGAP Learning Management System",
  supportEmail: "support@unigap.edu",
  maintenanceMode: false,
  aiModel: "Gemini 1.5 Pro & Flash Companion",
  aiCreativity: 0.7,
  dailyNudgeLimit: 3,
  allowPublicRegistrations: true,
  currencySymbol: "$",
};

export function getStoredUsers(): AdminUser[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("unigap_admin_users");
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredUser(user: AdminUser): AdminUser {
  if (typeof window === "undefined") return user;
  const current = getStoredUsers();
  const index = current.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
  let updated: AdminUser[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...updated[index], ...user };
  } else {
    updated = [user, ...current];
  }
  try {
    localStorage.setItem("unigap_admin_users", JSON.stringify(updated));
    window.dispatchEvent(new Event("unigap_users_updated"));
  } catch {
    // fallback
  }
  return user;
}

export function deleteStoredUser(id: string): void {
  if (typeof window === "undefined") return;
  const current = getStoredUsers();
  const updated = current.filter((u) => u.id !== id);
  try {
    localStorage.setItem("unigap_admin_users", JSON.stringify(updated));
    window.dispatchEvent(new Event("unigap_users_updated"));
  } catch {
    // fallback
  }
}

export function getStoredTransactions(): PaymentTransaction[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("unigap_admin_transactions");
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getStoredCertificates(): IssuedCertificate[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("unigap_admin_certificates");
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
