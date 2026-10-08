"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import {
  PenTool,
  Calendar,
  Send,
  Sparkles,
  Share2,
  Image,
  Clock,
  Loader2,
  CheckCircle2,
  Flame,
} from "lucide-react";

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useAuth();

  const [caption, setCaption] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [mediaAssets, setMediaAssets] = useState<any[]>([]);
  const [selectedMediaId, setSelectedMediaId] = useState<string>("");
  const [scheduleDate, setScheduleDate] = useState<string>("");
  const [scheduleTime, setScheduleTime] = useState<string>("15:00");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const qCaption = searchParams.get("caption");
    if (qCaption) setCaption(qCaption);

    // Default scheduled time: tomorrow at 3pm
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduleDate(tomorrow.toISOString().split("T")[0]);

    // Load connected accounts and media assets
    const loadResources = async () => {
      setLoading(true);
      try {
        const [accs, media] = await Promise.allSettled([
          apiFetch<any[]>("/social/accounts"),
          apiFetch<any[]>("/media"),
        ]);
        if (accs.status === "fulfilled" && accs.value.length > 0) {
          setAccounts(accs.value);
          setSelectedAccountId(accs.value[0].id);
        }
        if (media.status === "fulfilled" && media.value.length > 0) {
          setMediaAssets(media.value);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadResources();
  }, [searchParams]);

  const handleSchedule = async (publishImmediately: boolean = false) => {
    if (!caption.trim()) {
      showToast("Caption cannot be empty", "error");
      return;
    }
    if (!selectedAccountId) {
      showToast("Please select a target social account", "error");
      return;
    }

    setSubmitting(true);
    try {
      const scheduledDateTime = publishImmediately
        ? new Date().toISOString()
        : new Date(`${scheduleDate}T${scheduleTime}:00Z`).toISOString();

      const scheduledPost = await apiFetch<any>("/publishing/schedule", {
        method: "POST",
        body: JSON.stringify({
          social_account_id: selectedAccountId,
          media_asset_id: selectedMediaId || undefined,
          caption,
          scheduled_for: scheduledDateTime,
        }),
      });

      if (publishImmediately) {
        await apiFetch(`/publishing/publish-now/${scheduledPost.id}`, { method: "POST" });
        showToast("Post published directly to channel!", "success");
      } else {
        showToast("Post successfully scheduled into calendar!", "success");
      }
      router.push("/posts");
    } catch (err: any) {
      showToast(err.message || "Failed to process post", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
          <PenTool className="w-3.5 h-3.5" />
          <span>Publishing Studio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Content Editor & Scheduler</h1>
        <p className="text-sm text-slate-400 mt-1">
          Compose multi-channel posts, attach media, select verified channels, and dispatch idempotently.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Target Social Account
              </label>
              {loading ? (
                <div className="p-3 text-slate-500 text-xs flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                  <span>Loading connected channels...</span>
                </div>
              ) : accounts.length === 0 ? (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300">
                  No social accounts connected yet. Please connect an account in{" "}
                  <a href="/social-accounts" className="underline font-bold">Connected Channels</a>.
                </div>
              ) : (
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.platform.toUpperCase()} — {acc.account_name} ({acc.username || "connected"})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Post Caption & Copy
                </label>
                <span className="text-xs text-slate-400 font-mono">
                  {caption.length} characters
                </span>
              </div>
              <textarea
                rows={8}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your post caption, hook, and call to action..."
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
              />
            </div>

            {/* Media Attachment Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Attach Media Asset (Optional)
              </label>
              <select
                value={selectedMediaId}
                onChange={(e) => setSelectedMediaId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="">No media attached (Text only)</option>
                {mediaAssets.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.filename} ({m.asset_type} - {(m.file_size_bytes / 1024).toFixed(0)} KB)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Schedule & Dispatch Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Publishing Configuration</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Schedule Date
              </label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Time (UTC)
              </label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-4 space-y-3">
              <button
                type="button"
                onClick={() => handleSchedule(false)}
                disabled={submitting}
                className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Calendar className="w-4 h-4" />
                )}
                <span>Schedule Into Calendar</span>
              </button>

              <button
                type="button"
                onClick={() => handleSchedule(true)}
                disabled={submitting}
                className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-emerald-400" />
                )}
                <span>Publish Immediately</span>
              </button>
            </div>
          </div>

          {/* Quick AI Links */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs space-y-2">
            <span className="font-semibold text-indigo-300 block">Need inspiration?</span>
            <div className="flex flex-col space-y-1 text-slate-400">
              <a href="/hooks" className="hover:text-indigo-300 flex items-center space-x-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>Test hooks in Viral Hook Lab</span>
              </a>
              <a href="/captions" className="hover:text-indigo-300 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Generate multi-variant captions</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8 text-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading Editor...</div>}>
        <EditorContent />
      </Suspense>
    </DashboardLayout>
  );
}
