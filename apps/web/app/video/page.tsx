"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import {
  Video,
  Sparkles,
  Play,
  Clock,
  Layers,
  Loader2,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

function VideoContent() {
  const searchParams = useSearchParams();
  const { refreshCredits, showToast } = useAuth();

  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [duration, setDuration] = useState(10);
  const [provider, setProvider] = useState("mock");
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [fetchingJobs, setFetchingJobs] = useState(true);

  const loadJobs = async () => {
    try {
      const data = await apiFetch<any[]>("/video");
      setJobs(data || []);
    } catch {
      // fallback
    } finally {
      setFetchingJobs(false);
    }
  };

  useEffect(() => {
    const qPrompt = searchParams.get("prompt");
    if (qPrompt) setPrompt(qPrompt);
    else setPrompt("Dynamic short-form 4K video showing futuristic smartphone displaying social growth analytics graph, glowing neon, cinematic depth of field");
    loadJobs();
  }, [searchParams]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const job = await apiFetch<any>("/video/generate", {
        method: "POST",
        body: JSON.stringify({
          prompt,
          aspect_ratio: aspectRatio,
          duration_seconds: duration,
          provider,
        }),
      });
      setJobs((prev) => [job, ...prev]);
      await refreshCredits();
      showToast("Video generation job initiated! 30 credits deducted.", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to start video generation", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
          <Video className="w-3.5 h-3.5" />
          <span>Asynchronous Diffusion Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Video Studio</h1>
        <p className="text-sm text-slate-400 mt-1">
          Generate cinematic short-form video clips from text prompts and script hooks behind provider-independent abstractions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Prompt Configuration */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white">Video Parameters</h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Visual Scene Prompt
              </label>
              <textarea
                rows={5}
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe lighting, camera movement, subject, style..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "9:16 Vertical", value: "9:16", desc: "TikTok/Reels" },
                  { label: "16:9 Wide", value: "16:9", desc: "YouTube" },
                  { label: "1:1 Square", value: "1:1", desc: "Feed" },
                ].map((ar) => (
                  <button
                    type="button"
                    key={ar.value}
                    onClick={() => setAspectRatio(ar.value)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      aspectRatio === ar.value
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="text-xs">{ar.label}</div>
                    <div className="text-[10px] text-slate-500">{ar.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value={5}>5 Seconds</option>
                  <option value={10}>10 Seconds</option>
                  <option value={15}>15 Seconds</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Engine
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="mock">Studio Diffusion (Fast)</option>
                  <option value="runway">Runway Gen-3 Alpha</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Queuing Generation (30c)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Video (30 Credits)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Video Generation Queue & Jobs */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Video Generation Jobs ({jobs.length})</h3>
                <p className="text-xs text-slate-400">Asynchronous rendering background worker queue</p>
              </div>
              <button
                onClick={loadJobs}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Queue</span>
              </button>
            </div>

            {fetchingJobs ? (
              <div className="py-12 flex justify-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="py-16 text-center rounded-2xl bg-slate-950/40 border border-slate-800 p-8">
                <Video className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No video jobs queued</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Submit a video prompt to queue your first asynchronous AI video generation job.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {job.aspect_ratio || "9:16"}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            job.status === "completed"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : "bg-amber-950 text-amber-300 border border-amber-800"
                          }`}
                        >
                          {job.status}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Provider: {job.provider}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-200 line-clamp-2">
                        &quot;{job.prompt}&quot;
                      </p>

                      {job.status !== "completed" && (
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                          <div
                            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${job.progress || 65}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {job.video_url ? (
                        <a
                          href={job.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Preview Video</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Processing video...</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideoPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8 text-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading Video Studio...</div>}>
        <VideoContent />
      </Suspense>
    </DashboardLayout>
  );
}
