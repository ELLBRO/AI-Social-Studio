"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import {
  Send,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Loader2,
  RefreshCw,
} from "lucide-react";

export default function PostsPage() {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState<"scheduled" | "published">("scheduled");
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [publishedPosts, setPublishedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const [schedRes, pubRes] = await Promise.allSettled([
        apiFetch<any[]>("/publishing/scheduled"),
        apiFetch<any[]>("/publishing/published"),
      ]);
      if (schedRes.status === "fulfilled") setScheduledPosts(schedRes.value || []);
      if (pubRes.status === "fulfilled") setPublishedPosts(pubRes.value || []);
    } catch (err: any) {
      showToast(err.message || "Failed to load posts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handlePublishNow = async (id: string) => {
    setPublishingId(id);
    try {
      await apiFetch(`/publishing/publish-now/${id}`, { method: "POST" });
      showToast("Post published successfully!", "success");
      await loadPosts();
    } catch (err: any) {
      showToast(err.message || "Failed to publish post", "error");
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
              <Send className="w-3.5 h-3.5" />
              <span>Idempotent Dispatch Queue</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Posts Management</h1>
            <p className="text-sm text-slate-400 mt-1">
              Review scheduled publishing queues, active runs, and historical published records.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/editor"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>New Post</span>
            </Link>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("scheduled")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "scheduled"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Scheduled Queue ({scheduledPosts.length})
          </button>
          <button
            onClick={() => setActiveTab("published")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "published"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Published Archive ({publishedPosts.length})
          </button>
        </div>

        {/* Posts Content */}
        {loading ? (
          <div className="py-20 flex justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : activeTab === "scheduled" ? (
          scheduledPosts.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800 p-8">
              <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Scheduled Posts</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-4">
                You have no upcoming posts queued for publication.
              </p>
              <Link
                href="/editor"
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-xs font-semibold text-white"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Schedule</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledPosts.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {p.status}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{new Date(p.scheduled_for).toLocaleString()}</span>
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-medium">
                      {p.caption}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <button
                      onClick={() => handlePublishNow(p.id)}
                      disabled={publishingId === p.id}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all hover:scale-105 disabled:opacity-60"
                    >
                      {publishingId === p.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Publish Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : publishedPosts.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800 p-8">
            <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Published Posts Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Posts published automatically or manually will appear here along with delivery metrics.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {publishedPosts.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Live
                    </span>
                    <span className="text-xs text-slate-400">
                      Published {new Date(p.published_at).toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      ID: {p.platform_post_id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    Published across target platform channel successfully.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {p.post_url && (
                    <a
                      href={p.post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold inline-flex items-center space-x-1 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View on Platform</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
