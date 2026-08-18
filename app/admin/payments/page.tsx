"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Search,
  DollarSign,
  TrendingUp,
  Download,
  CheckCircle2,
  RefreshCw,
  XCircle,
  Eye,
  X,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getStoredTransactions, PaymentTransaction } from "@/lib/mock/admin";

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);

  const loadTransactions = () => {
    setTransactions(getStoredTransactions());
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.userName.toLowerCase().includes(search.toLowerCase()) ||
      tx.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      tx.transactionId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || tx.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const activeSubscriptions = transactions.filter((t) => t.status === "completed").length;

  return (
    <AdminShell>
      <main className="container-app px-6 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#920090]">Financial Administration</p>
            <h1 className="mt-1 text-3xl font-bold text-[#520051]">Payments & Transactions</h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor subscription revenue, payment gateway transactions, and customer invoicing logs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert("Exporting transactions log CSV...")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50"
          >
            <Download size={16} /> Export Financial CSV
          </button>
        </div>

        {/* Financial Overview Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#eee5ee] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7ddf7] text-[#920090]">
                <DollarSign size={20} />
              </div>
            </div>
            <p className="mt-4 text-2xl font-extrabold text-[#520051]">${totalRevenue.toFixed(2)}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Total Net Revenue</p>
          </div>

          <div className="rounded-2xl border border-[#eee5ee] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#920090]">
                <CreditCard size={20} />
              </div>
            </div>
            <p className="mt-4 text-2xl font-extrabold text-[#520051]">${totalRevenue.toFixed(2)}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Monthly Recurring (MRR)</p>
          </div>

          <div className="rounded-2xl border border-[#eee5ee] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <p className="mt-4 text-2xl font-extrabold text-[#520051]">{activeSubscriptions}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Active Paid Subscriptions</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-8 rounded-2xl border border-[#eee5ee] bg-white p-4 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transaction ID, customer name or email..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-11 pr-4 text-xs outline-none focus:border-[#920090]"
              />
            </div>

            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
              {(["all", "completed", "refunded", "failed"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                    selectedStatus === status
                      ? "bg-white text-[#520051] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions Table / Empty State */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#eee5ee] bg-white shadow-xs">
          {filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-[#faf5fa] text-[11px] font-bold uppercase tracking-wider text-[#520051]">
                  <tr>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-[#920090]">
                        {tx.transactionId}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{tx.userName}</p>
                        <p className="text-xs text-slate-400">{tx.userEmail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-semibold text-[#520051]">
                          {tx.planName}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        ${tx.amount.toFixed(2)} {tx.currency}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">{tx.date}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedTransaction(tx)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          <Eye size={13} /> View Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#faf5fa] text-[#520051]">
                <CreditCard size={24} />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#520051]">No Payments Recorded Yet</h3>
              <p className="mt-1 text-xs text-slate-500">
                Transactions will appear automatically when users complete checkouts.
              </p>
            </div>
          )}
        </div>

        {/* Invoice Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-[#520051]">Transaction Receipt</h2>
                <button
                  type="button"
                  onClick={() => setSelectedTransaction(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Reference</span>
                  <span className="font-mono font-semibold text-[#920090]">
                    {selectedTransaction.transactionId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer</span>
                  <span className="font-semibold text-slate-800">{selectedTransaction.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email</span>
                  <span className="text-slate-800">{selectedTransaction.userEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subscription Tier</span>
                  <span className="font-semibold text-[#520051]">{selectedTransaction.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Method</span>
                  <span className="text-slate-800">{selectedTransaction.paymentMethod}</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-slate-200 pt-3 text-sm font-bold">
                  <span>Total Billed</span>
                  <span className="text-[#520051]">
                    ${selectedTransaction.amount.toFixed(2)} {selectedTransaction.currency}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedTransaction(null)}
                  className="w-full rounded-xl bg-[#520051] py-2.5 text-xs font-semibold text-white hover:bg-[#920090]"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminShell>
  );
}

function StatusBadge({ status }: { status: PaymentTransaction["status"] }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 size={12} /> Completed
      </span>
    );
  }
  if (status === "refunded") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <RefreshCw size={12} /> Refunded
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
      <XCircle size={12} /> {status}
    </span>
  );
}
