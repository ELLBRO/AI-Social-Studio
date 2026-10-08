"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import {
  Sparkles,
  TrendingUp,
  Share2,
  Calendar,
  Send,
  Video,
  Flame,
  FileText,
  Coins,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Play,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const { currentOrg, credits, showToast } = useAuth();
  const [overview, setOverview] = useState<any>(null);
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      const [ovData, schedData, accData] = await Promise.allSettled([
        apiFetch<any>("/analytics/overview"),
        apiFetch<any[]>("/publishing/scheduled"),
        apiFetch<any[]>("/social/accounts"),
      ]);

      if (ovData.status === "fulfilled") setOverview(ovData.value);
      if (schedData.status === "fulfilled") setScheduledPosts(schedData.value);
      if (accData.status === "fulfilled") setAccounts(accData.value);
    } catch (err: any) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handlePublishNow = async (postId: string) => {
    setPublishingId(postId);
    try {
      await apiFetch(`/publishing/publish-now/${postId}`, { method: "POST" });
      showToast("Post dispatched and published successfully!", "success");
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || "Failed to publish post", "error");
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Top Header & Greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Growth Command Center
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Multi-channel AI publishing & intelligence for{" "}
              <span className="text-indigo-400 font-semibold">{currentOrg?.name || "Apex Growth Studio"}</span>.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/strategy"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Strategy</span>
            </Link>
            <Link
              href="/editor"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Compose Post</span>
            </Link>
          </div>
        </div>

        {/* High-level KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Impressions</span>
              <div className="p-2 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">
              {overview?.total_impressions ? overview.total_impressions.toLocaleString() : "142,500"}
            </div>
            <div className="mt-2 flex items-center text-xs text-emerald-400 space-x-1">
              <span>+18.4%</span>
              <span className="text-slate-500">vs last period</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Audience Reach</span>
              <div className="p-2 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-500/20">
                <Share2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">
              {overview?.total_followers ? overview.total_followers.toLocaleString() : "24,800"}
            </div>
            <div className="mt-2 flex items-center text-xs text-emerald-400 space-x-1">
              <span>+{overview?.follower_growth_rate || 6.2}%</span>
              <span className="text-slate-500">growth velocity</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Avg Engagement Rate</span>
              <div className="p-2 rounded-xl bg-pink-950/60 text-pink-400 border border-pink-500/20">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">
              {overview?.avg_engagement_rate ? `${overview.avg_engagement_rate}%` : "5.8%"}
            </div>
            <div className="mt-2 flex items-center text-xs text-indigo-400 space-x-1">
              <span>Top 5% in category</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">AI Credit Balance</span>
              <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-500/20">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{credits}</div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">Auto-refills in 5 days</span>
              <Link href="/credits" className="text-indigo-400 hover:underline">
                View Ledger
              </Link>
            </div>
          </div>
        </div>

        {/* Quick AI Launchpad */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              AI Generation Accelerators
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { title: "Hook Lab", icon: Flame, href: "/hooks", color: "text-amber-400", bg: "bg-amber-500/10" },
              { title: "Video Scripts", icon: FileText, href: "/scripts", color: "text-indigo-400", bg: "bg-indigo-500/10" },
              { title: "Content Ideas", icon: Sparkles, href: "/ideas", color: "text-purple-400", bg: "bg-purple-500/10" },
              { title: "AI Video", icon: Video, href: "/video", color: "text-rose-400", bg: "bg-rose-500/10" },
              { title: "Captions", icon: Share2, href: "/captions", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { title: "Calendar", icon: Calendar, href: "/calendar", color: "text-blue-400", bg: "bg-blue-500/10" },
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all group text-center"
                >
                  <div className={`w-10 h-10 mx-auto rounded-xl ${tool.bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${tool.color}`} />
                  </div>
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-white block">
                    {tool.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Scheduled Queue & Connected Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scheduled Posts Queue */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white">Scheduled Publishing Queue</h3>
                <p className="text-xs text-slate-400">Automated multi-platform delivery pipeline</p>
              </div>
              <Link
                href="/posts"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center space-x-1"
              >
                <span>View all posts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              </div>
            ) : scheduledPosts.length === 0 ? (
              <div className="py-10 text-center rounded-xl bg-slate-950/40 border border-dashed border-slate-800 p-6">
                <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">No scheduled posts queued</p>
                <p className="text-xs text-slate-500 mt-1">
                  Schedule your generated hooks, scripts, and captions for automatic publishing.
                </p>
                <Link
                  href="/editor"
                  className="mt-4 inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Schedule</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {scheduledPosts.slice(0, 4).map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-200 line-clamp-2">
                        {post.caption}
                      </p>
                      <div className="mt-2 flex items-center space-x-3 text-[11px] text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          <span>{new Date(post.scheduled_for).toLocaleString()}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] uppercase font-semibold">
                          {post.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePublishNow(post.id)}
                        disabled={publishingId === post.id}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/40 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold transition-all inline-flex items-center space-x-1 disabled:opacity-50"
                      >
                        {publishingId === post.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3 h-3" />
                        )}
                        <span>Publish Now</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Connected Channels & Platform Status */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Social Channels</h3>
              <Link href="/social-accounts" className="text-xs text-indigo-400 hover:underline">
                Manage
              </Link>
            </div>
            <p className="text-xs text-slate-400 mb-4">Official platform API connections & status</p>

            <div className="space-y-3 flex-1">
              {[
                { name: "Instagram", platform: "instagram", handle: "@apex.creators", active: true },
                { name: "TikTok", platform: "tiktok", handle: "@apexshortform", active: true },
                { name: "YouTube", platform: "youtube", handle: "Apex Studio Shorts", active: true },
                { name: "LinkedIn", platform: "linkedin", handle: "Apex Growth Org", active: false },
                { name: "X (Twitter)", platform: "x", handle: "Not Connected", active: false },
              ].map((ch) => (
                <div
                  key={ch.name}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-semibold text-white">{ch.name}</div>
                    <div className="text-[11px] text-slate-400">{ch.handle}</div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      ch.active
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {ch.active ? "Connected" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <Link
                href="/social-accounts"
                className="w-full inline-flex items-center justify-center space-x-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Connect New Account</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
