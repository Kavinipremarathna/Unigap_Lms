import {
  mockAdminUsers,
  mockTransactions,
  mockCertificates,
  mockSettings,
  AdminUser,
  PaymentTransaction,
  IssuedCertificate,
  SystemSetting,
} from "@/lib/mock/admin";

export async function getAdminUsers(): Promise<AdminUser[]> {
  return Promise.resolve([...mockAdminUsers]);
}

export async function getAdminUserById(id: string): Promise<AdminUser | undefined> {
  return Promise.resolve(mockAdminUsers.find((u) => u.id === id));
}

export async function getAdminTransactions(): Promise<PaymentTransaction[]> {
  return Promise.resolve([...mockTransactions]);
}

export async function getAdminCertificates(): Promise<IssuedCertificate[]> {
  return Promise.resolve([...mockCertificates]);
}

export async function getSystemSettings(): Promise<SystemSetting> {
  return Promise.resolve({ ...mockSettings });
}

export async function getAdminFinancialSummary() {
  const completed = mockTransactions.filter((t) => t.status === "completed");
  const totalRevenue = completed.reduce((sum, t) => sum + t.amount, 0);
  const mrr = totalRevenue * 0.45; // Simulated MRR
  const activeSubscribers = 840;
  const refundRate = 1.2;

  return {
    totalRevenue,
    mrr,
    activeSubscribers,
    refundRate,
  };
}
