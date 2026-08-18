"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Send,
  CheckCircle2,
  Trash2,
  Lock,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminAuth } from "@/lib/context/admin-auth-context";

interface Broadcast {
  id: string;
  title: string;
  audience: string;
  channel: string;
  sentCount: number;
  openRate: string;
  sentDate: string;
}

export default function AdminNotificationsPage() {
  const { isSuperAdmin } = useAdminAuth();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("All Learners");
  const [channel, setChannel] = useState("In-App & Email");
  const [sentNotice, setSentNotice] = useState(false);

  // Load saved broadcast history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("unigap_admin_broadcasts");
      if (stored) {
        setBroadcasts(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveBroadcasts = (newItems: Broadcast[]) => {
    setBroadcasts(newItems);
    try {
      localStorage.setItem("unigap_admin_broadcasts", JSON.stringify(newItems));
    } catch {
      // ignore
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const newBroadcast: Broadcast = {
      id: `bc-${Date.now()}`,
      title: title.trim(),
      audience,
      channel,
      sentCount: 1,
      openRate: "100.0%",
      sentDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updated = [newBroadcast, ...broadcasts];
    saveBroadcasts(updated);

    setTitle("");
    setBody("");
    setSentNotice(true);
    setTimeout(() => setSentNotice(false), 3000);
  };

  const handleDeleteBroadcast = (id: string) => {
    if (!isSuperAdmin) {
      alert("Permission Denied: Only a Super Admin can delete broadcast records.");
      return;
    }

    const target = broadcasts.find((b) => b.id === id);
    if (!target) return;

    if (window.confirm(`Are you sure you want to delete the broadcast record "${target.title}"?`)) {
      const updated = broadcasts.filter((b) => b.id !== id);
      saveBroadcasts(updated);
    }
  };

  const handleClearAllBroadcasts = () => {
    if (!isSuperAdmin) {
      alert("Permission Denied: Only a Super Admin can clear broadcast history.");
      return;
    }

    if (broadcasts.length === 0) return;
    if (window.confirm("Are you sure you want to clear ALL broadcast history logs? This action cannot be undone.")) {
      saveBroadcasts([]);
    }
  };

  return (
    <AdminShell>
      <main className="container-app px-6 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#920090]">Communication Hub</p>
            <h1 className="mt-1 text-3xl font-bold text-[#520051]">Notification Broadcasting</h1>
            <p className="mt-1 text-sm text-slate-500">
              Broadcast platform announcements, system alerts, and nudges across email and app channels.
            </p>
          </div>
        </div>

        {sentNotice && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 border border-emerald-200 text-emerald-800 text-xs font-bold animate-fade-in">
            <CheckCircle2 size={18} className="text-emerald-600" />
            Broadcast notification dispatched successfully to {audience}!
          </div>
        )}

        {/* Compose Broadcaster Box */}
        <div className="mt-8 rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-xs">
          <h2 className="text-lg font-bold text-[#520051]">Compose New Broadcast</h2>

          <form onSubmit={handleSend} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#520051]">Target Audience</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-[#920090]"
                >
                  <option value="All Learners">All Registered Learners</option>
                  <option value="Pro Subscribers">Pro Plan Subscribers</option>
                  <option value="Instructors">Platform Instructors</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#520051]">Delivery Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-[#920090]"
                >
                  <option value="In-App & Email">In-App Notification & Email</option>
                  <option value="In-App Only">In-App Banner Only</option>
                  <option value="Email Blast">Email Blast Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[#520051]">Announcement Headline</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 🎉 Platform System Maintenance Update"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-[#920090]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[#520051]">Message Content</label>
              <textarea
                required
                rows={3}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your announcement details..."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-[#920090]"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#520051] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#920090] transition active:scale-95"
              >
                <Send size={15} /> Broadcast Now
              </button>
            </div>
          </form>
        </div>

        {/* Broadcast History Header */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#520051]">Broadcast History</h2>

          {isSuperAdmin && broadcasts.length > 0 && (
            <button
              type="button"
              onClick={handleClearAllBroadcasts}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition"
            >
              <Trash2 size={14} /> Clear All History
            </button>
          )}
        </div>

        {/* Broadcast History Table */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-[#eee5ee] bg-white shadow-xs">
          {broadcasts.length > 0 ? (
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-[#faf5fa] text-[11px] font-bold uppercase tracking-wider text-[#520051]">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Audience</th>
                  <th className="px-6 py-4">Channel</th>
                  <th className="px-6 py-4">Recipients</th>
                  <th className="px-6 py-4">Open Rate</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {broadcasts.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">{b.title}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-[#920090]">{b.audience}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{b.channel}</td>
                    <td className="px-6 py-4 text-xs font-semibold">{b.sentCount}</td>
                    <td className="px-6 py-4 text-xs font-bold text-emerald-600">{b.openRate}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">{b.sentDate}</td>
                    <td className="px-6 py-4 text-right">
                      {isSuperAdmin ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteBroadcast(b.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                          title="Delete broadcast record (Super Admin Only)"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md"
                          title="Only Super Admins can delete broadcast history"
                        >
                          <Lock size={12} /> View Only
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#faf5fa] text-[#520051]">
                <Bell size={24} />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#520051]">No Broadcast History</h3>
              <p className="mt-1 text-xs text-slate-500">
                Use the composer above to broadcast system announcements to users.
              </p>
            </div>
          )}
        </div>
      </main>
    </AdminShell>
  );
}
