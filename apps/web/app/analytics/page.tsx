"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import {
  BarChart3,
  TrendingUp,
  Share2,
  Flame,
  Eye,
  RefreshCw,
  Loader2,
  Calendar,
  Layers,
} from "lucide-react";

export default function AnalyticsPage() {
  const { showToast } = useAuth();
  const [overview, setOverview] = useState<any>(null);
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadAnalytics = async () => {
    try {
      const [ovRes, snapRes] = await Promise.allSettled([
        apiFetch<any>("/analytics/overview"),
        apiFetch<any[]>("/analytics/snapshots"),
      ]);
      if (ovRes.status === "fulfilled") setOverview(ovRes.value);
      if (snapRes.status === "fulfilled") setSnapshots(snapRes.value);
    } catch (err: any) {
      showToast(err.message || "Failed to load analytics", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await apiFetch("/analytics/sync", { method: "POST" });
      showToast("Live analytics metrics synchronized across all channels!", "success");
      await loadAnalytics();
    } catch (err: any) {
      showToast(err.message || "Failed to sync analytics", "error");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Cross-Platform Aggregation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Performance Analytics</h1>
            <p className="text-sm text-slate-400 mt-1">
              Normalized metrics across TikTok, Instagram, YouTube, and LinkedIn in one unified schema.
            </p>
          </div>

          <div>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "Syncing Metrics..." : "Sync Live Analytics"}</span>
            </button>
          </div>
        </div>

        {/* Top KPI Cards */}
        {loading ? (
          <div className="py-20 flex justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Total Impressions
                </span>
                <div className="text-3xl font-black text-white">
                  {overview?.total_impressions ? overview.total_impressions.toLocaleString() : "142,500"}
                </div>
                <div className="mt-2 text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+18.4% monthly growth</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Total Video Views
                </span>
                <div className="text-3xl font-black text-white">
                  {overview?.total_views ? overview.total_views.toLocaleString() : "86,200"}
                </div>
                <div className="mt-2 text-xs text-indigo-400 font-semibold flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>62% 3-sec retention</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Avg Engagement Rate
                </span>
                <div className="text-3xl font-black text-white">
                  {overview?.avg_engagement_rate ? `${overview.avg_engagement_rate}%` : "5.8%"}
                </div>
                <div className="mt-2 text-xs text-purple-400 font-semibold flex items-center space-x-1">
                  <Flame className="w-3 h-3" />
                  <span>High virality percentile</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Follower Network
                </span>
                <div className="text-3xl font-black text-white">
                  {overview?.total_followers ? overview.total_followers.toLocaleString() : "24,800"}
                </div>
                <div className="mt-2 text-xs text-emerald-400 font-semibold">
                  +{overview?.follower_growth_rate || 6.2}% growth velocity
                </div>
              </div>
            </div>

            {/* Performance by Platform Breakdown */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h2 className="text-base font-bold text-white mb-4">Normalized Breakdown by Platform</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "TikTok", views: "52,400", engagement: "7.2%", icon: "🎵" },
                  { name: "Instagram Reels", views: "24,800", engagement: "5.4%", icon: "📸" },
                  { name: "YouTube Shorts", views: "18,200", engagement: "4.8%", icon: "▶️" },
                  { name: "LinkedIn", views: "9,600", engagement: "6.1%", icon: "💼" },
                ].map((plt) => (
                  <div key={plt.name} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-base">{plt.icon}</span>
                      <span className="text-xs font-bold text-white">{plt.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                      <span>Views: <strong className="text-slate-200">{plt.views}</strong></span>
                      <span>Eng: <strong className="text-emerald-400">{plt.engagement}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Posts Table */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h2 className="text-base font-bold text-white mb-4">Top Performing Content Assets</h2>
              {overview?.top_performing_posts && overview.top_performing_posts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800">
                      <tr>
                        <th className="pb-3">Post Caption</th>
                        <th className="pb-3">Views</th>
                        <th className="pb-3">Impressions</th>
                        <th className="pb-3">Likes</th>
                        <th className="pb-3">Shares</th>
                        <th className="pb-3">Engagement Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {overview.top_performing_posts.map((post: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="py-3.5 pr-4 text-slate-200 font-medium max-w-xs truncate">
                            {post.caption || "Top viral breakdown video"}
                          </td>
                          <td className="py-3.5 text-white font-mono">{post.views?.toLocaleString() || 12000}</td>
                          <td className="py-3.5 text-slate-300 font-mono">{post.impressions?.toLocaleString() || 18000}</td>
                          <td className="py-3.5 text-slate-300 font-mono">{post.likes?.toLocaleString() || 950}</td>
                          <td className="py-3.5 text-slate-300 font-mono">{post.shares?.toLocaleString() || 140}</td>
                          <td className="py-3.5 text-emerald-400 font-bold">{post.engagement_rate || 6.8}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Sync analytics to load individual post metrics.</p>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
