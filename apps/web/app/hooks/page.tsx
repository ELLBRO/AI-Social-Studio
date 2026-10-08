"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import {
  Flame,
  Sparkles,
  Copy,
  Check,
  FileText,
  Loader2,
  TrendingUp,
  ArrowRight,
  Zap,
} from "lucide-react";

function HookLabContent() {
  const searchParams = useSearchParams();
  const { refreshCredits, showToast } = useAuth();

  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("Founders, creators, short-form video viewers");
  const [tone, setTone] = useState("High-conviction, controversial, pattern-interrupt");
  const [hooks, setHooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const qTopic = searchParams.get("topic");
    if (qTopic) {
      setTopic(qTopic);
    } else {
      setTopic("Stop posting 60-second videos until you fix this 3-second mistake");
    }
  }, [searchParams]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch<any[]>("/content/generate-hooks", {
        method: "POST",
        body: JSON.stringify({
          topic,
          target_audience: audience,
          tone,
          num_hooks: 5,
        }),
      });
      setHooks(data);
      await refreshCredits();
      showToast("Generated 5 viral hooks! 5 credits deducted.", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to generate hooks", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyHook = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("Hook copied to clipboard!", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
          <Flame className="w-3.5 h-3.5" />
          <span>Algorithmic Retention Lab</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Viral Hook Lab</h1>
        <p className="text-sm text-slate-400 mt-1">
          Stop scrolling thumbs in the first 3 seconds with proven psychological pattern interrupts.
        </p>
      </div>

      {/* Generator Form */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Video Topic / Core Angle
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Hook Style / Tone
            </label>
            <input
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center space-x-2 py-2 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating (5c)...</span>
                </>
              ) : (
                <>
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                  <span>Generate Hooks (5c)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Hooks Result List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">Generated Hooks ({hooks.length})</h2>

        {hooks.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800 p-8">
            <Flame className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No hooks generated yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Enter your video topic above and generate 5 psychological hooks rated by virality potential.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {hooks.map((h, idx) => {
              const hookKey = h.id || `hook-${idx}`;
              return (
                <div
                  key={hookKey}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                        {h.hook_type || "Curiosity Gap"}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60">
                        <TrendingUp className="w-3 h-3" />
                        <span>{h.virality_score || 9.2} / 10 Virality Score</span>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-white leading-relaxed">
                      &quot;{h.hook_text}&quot;
                    </p>
                    <p className="text-xs text-slate-400 italic">
                      Why it works: {h.reasoning || "Leverages loss aversion and pattern interrupt."}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => copyHook(h.hook_text, hookKey)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center space-x-1.5 transition-colors"
                    >
                      {copiedId === hookKey ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === hookKey ? "Copied" : "Copy"}</span>
                    </button>
                    <Link
                      href={`/scripts?hook=${encodeURIComponent(h.hook_text)}&topic=${encodeURIComponent(topic)}`}
                      className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Script Video</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HooksPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8 text-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading Hook Lab...</div>}>
        <HookLabContent />
      </Suspense>
    </DashboardLayout>
  );
}
