"use client";

import { useState } from "react";
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Percent,
  Calendar,
  Gift,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { pricingPlans } from "@/lib/mock/misc";

export default function AdminPricingPage() {
  const [plans, setPlans] = useState(pricingPlans);
  const [coupons, setCoupons] = useState([
    { code: "WELCOME50", discount: "50% OFF", uses: 142, status: "Active", expires: "2026-12-31" },
    { code: "UNIGAP2026", discount: "20% OFF", uses: 89, status: "Active", expires: "2026-09-30" },
    { code: "PROSUMMER", discount: "30% OFF", uses: 45, status: "Expired", expires: "2026-07-01" },
  ]);

  return (
    <AdminShell>
      <main className="container-app px-6 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#920090]">Monetization Management</p>
            <h1 className="mt-1 text-3xl font-bold text-[#520051]">Pricing & Discount Coupons</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage subscription tiers, feature allocations, and promotional discount codes.
            </p>
          </div>

          <button
            onClick={() => {
              const code = prompt("Enter new coupon code (e.g. SPECIAL30):");
              if (code) {
                setCoupons((prev) => [
                  ...prev,
                  { code: code.toUpperCase(), discount: "25% OFF", uses: 0, status: "Active", expires: "2026-12-31" },
                ]);
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#520051] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#920090]"
          >
            <Plus size={16} /> Create Discount Coupon
          </button>
        </div>

        {/* Subscription Plans Section */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-[#520051]">Platform Subscription Tiers</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="relative flex flex-col justify-between rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#520051]">{plan.name}</h3>
                    {"highlighted" in plan && plan.highlighted && (
                      <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[11px] font-bold text-[#920090]">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{plan.description}</p>
                  <p className="mt-4 text-3xl font-black text-[#520051]">
                    ${plan.price}
                    <span className="text-xs font-normal text-slate-400">/{plan.period}</span>
                  </p>

                  <ul className="mt-6 space-y-2 text-xs text-slate-600">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => alert(`Editing tier parameters for ${plan.name}`)}
                    className="w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Edit Tier Settings
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coupon Codes Table */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-[#520051]">Active Promotional Coupons</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-[#eee5ee] bg-white shadow-sm">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-[#faf5fa] text-xs font-bold uppercase tracking-wider text-[#520051]">
                <tr>
                  <th className="px-6 py-4">Promo Code</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Redemptions</th>
                  <th className="px-6 py-4">Expires</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono font-bold text-[#920090]">{c.code}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{c.discount}</td>
                    <td className="px-6 py-4 text-xs font-semibold">{c.uses} times</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{c.expires}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          c.status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setCoupons((prev) => prev.filter((_, idx) => idx !== i))}
                        className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                        title="Delete coupon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
