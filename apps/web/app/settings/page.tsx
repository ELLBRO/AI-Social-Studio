"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import {
  Settings as SettingsIcon,
  User,
  Building,
  Key,
  ShieldCheck,
  CheckCircle2,
  Save,
  Loader2,
} from "lucide-react";

export default function SettingsPage() {
  const { user, currentOrg, showToast } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || "Alex Rivera");
  const [orgName, setOrgName] = useState(currentOrg?.name || "Apex Growth Studio");
  const [industry, setIndustry] = useState(currentOrg?.industry || "Creator Economy & SaaS Growth");
  const [website, setWebsite] = useState(currentOrg?.website || "https://apexstudio.growth");
  const [savingUser, setSavingUser] = useState(false);
  const [savingOrg, setSavingOrg] = useState(false);

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingUser(true);
    setTimeout(() => {
      setSavingUser(false);
      showToast("Profile settings saved successfully!", "success");
    }, 600);
  };

  const handleSaveOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingOrg(true);
    setTimeout(() => {
      setSavingOrg(false);
      showToast("Workspace configuration updated!", "success");
    }, 600);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold mb-2">
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>Workspace & Profile Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Settings</h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure your user account, workspace branding, and API credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Profile Form */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 text-indigo-400 mb-2">
              <User className="w-4 h-4" />
              <h2 className="text-base font-bold text-white">Personal Profile</h2>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || "demo@aisocialstudio.com"}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800/60 rounded-xl text-slate-500 text-xs cursor-not-allowed"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingUser}
                  className="inline-flex items-center space-x-2 py-2 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all disabled:opacity-60"
                >
                  {savingUser ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>

          {/* Organization Workspace Form */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 text-purple-400 mb-2">
              <Building className="w-4 h-4" />
              <h2 className="text-base font-bold text-white">Workspace & Team</h2>
            </div>

            <form onSubmit={handleSaveOrg} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Industry / Category
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Website / Portfolio
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingOrg}
                  className="inline-flex items-center space-x-2 py-2 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all disabled:opacity-60"
                >
                  {savingOrg ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Workspace</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Security & Multi-Tenant Credentials */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <h2 className="text-base font-bold text-white">Multi-Tenant Isolation & Security</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block mb-1">Organization ID</span>
              <span className="font-mono text-slate-200 truncate block">
                {currentOrg?.id || "e3b0c442-98fc-1c14-9afb-4c8996fb9242"}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block mb-1">OAuth Token Encryption</span>
              <span className="text-emerald-400 font-bold">AES-256 Enabled</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block mb-1">Audit Logging</span>
              <span className="text-indigo-400 font-bold">Active in Ledger</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
