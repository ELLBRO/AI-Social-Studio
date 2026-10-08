"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import {
  FileText,
  Sparkles,
  Video,
  PenTool,
  Clock,
  Eye,
  Volume2,
  Copy,
  Check,
  Loader2,
  ArrowRight,
} from "lucide-react";

function ScriptsContent() {
  const searchParams = useSearchParams();
  const { refreshCredits, showToast } = useAuth();

  const [topic, setTopic] = useState("");
  const [hook, setHook] = useState("");
  const [platform, setPlatform] = useState("tiktok");
  const [duration, setDuration] = useState(45);
  const [cta, setCta] = useState("Follow for daily creator growth breakdowns & comment 'GUIDE'");
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const qTopic = searchParams.get("topic");
    const qHook = searchParams.get("hook");
    if (qTopic) setTopic(qTopic);
    else setTopic("3 AI tools that replaced a $5,000/mo social media agency");
    if (qHook) setHook(qHook);
  }, [searchParams]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch<any>("/content/generate-script", {
        method: "POST",
        body: JSON.stringify({
          topic,
          hook: hook || undefined,
          platform,
          duration_seconds: duration,
          call_to_action: cta,
        }),
      });
      setScript(data);
      await refreshCredits();
      showToast("Generated full production script! 10 credits deducted.", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to generate script", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyFullScript = () => {
    if (!script) return;
    const text = `HOOK:\n${script.hook}\n\nBODY SCRIPT:\n${script.body}\n\nCALL TO ACTION:\n${script.call_to_action}\n\nVISUAL CUES:\n${script.visual_cues?.join("\n")}\n\nAUDIO CUES:\n${script.audio_cues?.join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Full script copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
          <FileText className="w-3.5 h-3.5" />
          <span>High-Retention Script Lab</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Video Script Generator</h1>
        <p className="text-sm text-slate-400 mt-1">
          Turn hooks and topics into full short-form scripts with visual directions and audio pacing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Parameters */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h2 className="text-base font-bold text-white mb-4">Script Configuration</h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Core Topic
              </label>
              <textarea
                rows={2}
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Starting Hook (Optional)
              </label>
              <textarea
                rows={2}
                value={hook}
                onChange={(e) => setHook(e.target.value)}
                placeholder="Leave blank to generate optimal hook..."
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="tiktok">TikTok</option>
                  <option value="reels">Instagram Reels</option>
                  <option value="shorts">YouTube Shorts</option>
                  <option value="linkedin">LinkedIn Video</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Duration (Sec)
                </label>
                <input
                  type="number"
                  min={15}
                  max={120}
                  step={5}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Call To Action (CTA)
              </label>
              <input
                type="text"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              />
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
                    <span>Scripting Video (10c)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Script (10c)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Script Output Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          {script ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1.5 text-xs text-indigo-400 font-semibold px-2.5 py-1 rounded-lg bg-indigo-950 border border-indigo-800">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{script.estimated_duration_seconds || duration}s runtime</span>
                  </div>
                  <span className="text-xs uppercase font-bold text-slate-400">{platform}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={copyFullScript}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy All"}</span>
                  </button>
                  <Link
                    href={`/video?prompt=${encodeURIComponent(script.hook)}`}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/20"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Generate AI Video</span>
                  </Link>
                </div>
              </div>

              {/* Hook Section */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  00:00 - 00:03 • 3-Second Hook
                </span>
                <p className="text-sm font-bold text-white">&quot;{script.hook}&quot;</p>
              </div>

              {/* Main Spoken Script */}
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Spoken Script (Teleprompter Ready)
                </span>
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-mono">
                  {script.body}
                </p>
              </div>

              {/* CTA Section */}
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">
                  Call to Action (CTA)
                </span>
                <p className="text-xs font-semibold text-slate-200">{script.call_to_action}</p>
              </div>

              {/* Visual and Audio Directives */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visual Directions & B-Roll</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {script.visual_cues?.map((c: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-cyan-400">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center space-x-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Audio & Sound Effects</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {script.audio_cues?.map((a: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-rose-400">•</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">No Script Generated</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Configure your topic and platform parameters to write a teleprompter-ready viral script with visual directions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ScriptsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8 text-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading Script Generator...</div>}>
        <ScriptsContent />
      </Suspense>
    </DashboardLayout>
  );
}
