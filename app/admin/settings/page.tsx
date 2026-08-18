"use client";

import { useState } from "react";
import {
  Settings,
  Bot,
  Shield,
  Key,
  Globe,
  Sliders,
  CheckCircle2,
  Save,
  AlertTriangle,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { mockSettings, SystemSetting } from "@/lib/mock/admin";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting>(mockSettings);
  const [activeTab, setActiveTab] = useState<"general" | "ai" | "security">("ai");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AdminShell>
      <main className="container-app px-6 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#920090]">System Configuration</p>
            <h1 className="mt-1 text-3xl font-bold text-[#520051]">Platform & AI Settings</h1>
            <p className="mt-1 text-sm text-slate-500">
              Configure global preferences, AI companion behavior, system prompts, and security policies.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-[#520051] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#920090]"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>

        {savedSuccess && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 border border-emerald-200 text-emerald-800 text-sm font-semibold">
            <CheckCircle2 size={18} className="text-emerald-600" />
            System settings updated successfully!
          </div>
        )}

        {/* Tab Selection */}
        <div className="mt-8 flex border-b border-[#eee5ee]">
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold transition ${
              activeTab === "ai"
                ? "border-[#920090] text-[#920090]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Bot size={18} /> AI Companion Rules
          </button>
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold transition ${
              activeTab === "general"
                ? "border-[#920090] text-[#920090]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Globe size={18} /> General Platform
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold transition ${
              activeTab === "security"
                ? "border-[#920090] text-[#920090]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Shield size={18} /> Security & APIs
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6">
          {/* AI Companion Tab */}
          {activeTab === "ai" && (
            <div className="space-y-6 rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-[#520051]">AI Learning Assistant Configuration</h3>
                <p className="text-xs text-slate-500">Tune the intelligence, creativity, and daily nudging limits for learners.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#520051]">Active AI Model</label>
                  <select
                    value={settings.aiModel}
                    onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#920090]"
                  >
                    <option value="Gemini 1.5 Pro & Flash Companion">Gemini 1.5 Pro & Flash Companion (Recommended)</option>
                    <option value="Gemini 1.0 Ultra">Gemini 1.0 Ultra</option>
                    <option value="GPT-4o Mini Adapter">GPT-4o Mini Adapter</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#520051]">
                    Daily Nudge Notifications Limit
                  </label>
                  <select
                    value={settings.dailyNudgeLimit}
                    onChange={(e) => setSettings({ ...settings, dailyNudgeLimit: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#920090]"
                  >
                    <option value={1}>1 Nudge / Day</option>
                    <option value={3}>3 Nudges / Day (Recommended)</option>
                    <option value={5}>5 Nudges / Day</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#520051]">
                  <span>Response Creativity (Temperature)</span>
                  <span className="font-mono text-[#920090]">{settings.aiCreativity}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={settings.aiCreativity}
                  onChange={(e) => setSettings({ ...settings, aiCreativity: Number(e.target.value) })}
                  className="w-full accent-[#920090]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#520051]">Global System Prompt</label>
                <textarea
                  rows={4}
                  defaultValue="You are UNIGAP AI, an encouraging and expert learning companion. Guide students through courses, clarify complex topics, and foster daily study habits."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-[#920090]"
                />
              </div>
            </div>
          )}

          {/* General Tab */}
          {activeTab === "general" && (
            <div className="space-y-6 rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-[#520051]">General Platform Branding</h3>
                <p className="text-xs text-slate-500">Site title, support contact, and registration policies.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#520051]">Platform Title</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#920090]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#520051]">Support Email Address</label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#920090]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                <div>
                  <p className="font-bold text-slate-800 text-sm">Allow Public Registrations</p>
                  <p className="text-xs text-slate-400">If disabled, new user sign-ups will require admin invitation.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowPublicRegistrations}
                  onChange={(e) => setSettings({ ...settings, allowPublicRegistrations: e.target.checked })}
                  className="h-5 w-5 rounded accent-[#920090]"
                />
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6 rounded-3xl border border-[#eee5ee] bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-[#520051]">Security & Maintenance Mode</h3>
                <p className="text-xs text-slate-500">Emergency controls and API key management.</p>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div>
                  <p className="font-bold text-amber-900 text-sm">Enable System Maintenance Mode</p>
                  <p className="text-xs text-amber-700">Puts the platform in read-only mode for non-admin users.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="h-5 w-5 rounded accent-amber-600"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-[#520051]">Stripe Payment Secret Key</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="sk_test_placeholder_key"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-mono outline-none focus:border-[#920090]"
                  />
                  <Key size={14} className="absolute right-3 top-3 text-slate-400" />
                </div>
              </div>
            </div>
          )}
        </form>
      </main>
    </AdminShell>
  );
}
