"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  Menu,
  Coins,
  Plus,
  Building,
  LogOut,
  User as UserIcon,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

export function AppHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter();
  const { user, currentOrg, credits, refreshCredits, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshCredits = async () => {
    setRefreshing(true);
    await refreshCredits();
    setRefreshing(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Current Organization Pill */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
          <Building className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-200">
            {currentOrg?.name || "Apex Growth Studio"}
          </span>
          <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-800 uppercase font-semibold">
            {currentOrg?.user_role || "Owner"}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Credits Balance Display */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs font-semibold">
          <Coins className="w-4 h-4 text-indigo-400" />
          <span>{credits} Credits</span>
          <button
            onClick={handleRefreshCredits}
            title="Refresh Credits"
            className="p-1 rounded hover:bg-indigo-900/50 text-indigo-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/credits"
            className="text-[10px] text-indigo-400 hover:text-indigo-200 underline ml-1"
          >
            Top up
          </Link>
        </div>

        {/* Quick Create CTA */}
        <Link
          href="/editor"
          className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Create Post</span>
        </Link>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white uppercase">
              {user?.full_name ? user.full_name[0] : "A"}
            </div>
            <span className="hidden md:block text-xs font-medium text-slate-300">
              {user?.full_name || "Alex Rivera"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50 text-xs"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="font-semibold text-white truncate">{user?.full_name || "Alex Rivera"}</p>
                <p className="text-slate-400 truncate">{user?.email || "demo@aisocialstudio.com"}</p>
              </div>
              <Link
                href="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Account & Workspace</span>
              </Link>
              <Link
                href="/billing"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Plans & Usage</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 text-rose-400 hover:bg-slate-800/80 hover:text-rose-300 text-left border-t border-slate-800"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
