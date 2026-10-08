"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import {
  Hash,
  Sparkles,
  Copy,
  Check,
  TrendingUp,
  Target,
  Flame,
  Loader2,
} from "lucide-react";

export default function HashtagsPage() {
  const { refreshCredits, showToast } = useAuth();
  const [topic, setTopic] = useState("AI video automation and short-form creator tools");
  const [niche, setNiche] = useState("SaaS & Growth");
  const [platform, setPlatform] = useState("instagram");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch<any>("/content/generate-hashtags", {
        method: "POST",
        body: JSON.stringify({
          topic,
          niche,
          platform,
          count: 25,
        }),
      });
      setResult(data);
      await refreshCredits();
      showToast("Generated tiered hashtag sets! 5 credits deducted.", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to generate hashtags", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyTags = (tags: string[], section: string) => {
    const formatted = tags.map((t) => (t.startsWith("#") ? t : `#${t}`)).join(" ");
    navigator.clipboard.writeText(formatted);
    setCopiedSection(section);
    showToast(`Copied ${tags.length} hashtags to clipboard!`, "success");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Hash className="w-3.5 h-3.5" />
            <span>Discoverability & SEO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Tiered Hashtag Sets</h1>
          <p className="text-sm text-slate-400 mt-1">
            Generate high-reach, niche-targeted, and trending hashtag sets engineered for algorithm indexing.
          </p>
        </div>

        {/* Input Parameters */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Topic / Subject
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
                Niche / Category
              </label>
              <input
                type="text"
                required
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
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
                    <span>Indexing (5c)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Sets (5c)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Hashtags Tiers Output */}
        {result ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-sm font-bold text-white">
                Total Hashtags Generated: {result.all_tags?.length || 24}
              </span>
              <button
                onClick={() => copyTags(result.all_tags, "all")}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
              >
                {copiedSection === "all" ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === "all" ? "Copied All!" : "Copy All Hashtags"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* High Reach */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-indigo-400">
                      <TrendingUp className="w-4 h-4" />
                      <h3 className="text-sm font-bold text-white">High Reach (1M+)</h3>
                    </div>
                    <button
                      onClick={() => copyTags(result.high_reach, "high")}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      {copiedSection === "high" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.high_reach?.map((tag: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300">
                        #{tag.replace(/^#/, "")}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-4">Broader discovery tags for initial exploration.</p>
              </div>

              {/* Niche Specific */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-cyan-400">
                      <Target className="w-4 h-4" />
                      <h3 className="text-sm font-bold text-white">Niche Specific</h3>
                    </div>
                    <button
                      onClick={() => copyTags(result.niche_specific, "niche")}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      {copiedSection === "niche" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.niche_specific?.map((tag: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
                        #{tag.replace(/^#/, "")}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-4">High search intent for target demographic conversion.</p>
              </div>

              {/* Trending */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-amber-400">
                      <Flame className="w-4 h-4" />
                      <h3 className="text-sm font-bold text-white">Trending Momentum</h3>
                    </div>
                    <button
                      onClick={() => copyTags(result.trending, "trending")}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      {copiedSection === "trending" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.trending?.map((tag: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300">
                        #{tag.replace(/^#/, "")}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-4">Algorithmic velocity tags capturing real-time surges.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800 p-8">
            <Hash className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No hashtags generated yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Enter your topic and niche parameters above to generate tiered indexing sets.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
