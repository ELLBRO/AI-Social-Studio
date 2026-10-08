"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import {
  Lightbulb,
  Sparkles,
  Flame,
  FileText,
  Loader2,
  TrendingUp,
  Tag,
  ArrowRight,
} from "lucide-react";

export default function IdeasPage() {
  const { refreshCredits, showToast } = useAuth();
  const [niche, setNiche] = useState("AI SaaS & Creator Economy");
  const [audience, setAudience] = useState("Indie hackers, video creators, agency owners");
  const [pillar, setPillar] = useState("Workflow Automation");
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSaved, setFetchingSaved] = useState(true);

  const loadSavedIdeas = async () => {
    try {
      const data = await apiFetch<any[]>("/content/ideas");
      if (data && data.length > 0) {
        setIdeas(data);
      }
    } catch {
      // fallback
    } finally {
      setFetchingSaved(false);
    }
  };

  useEffect(() => {
    loadSavedIdeas();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newIdeas = await apiFetch<any[]>("/content/generate-ideas", {
        method: "POST",
        body: JSON.stringify({
          niche,
          target_audience: audience,
          pillar,
          num_ideas: 5,
        }),
      });
      setIdeas((prev) => [...newIdeas, ...prev]);
      await refreshCredits();
      showToast("Generated 5 high-converting content ideas! 10 credits deducted.", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to generate ideas", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>AI Brainstorming Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Content Ideas Bank</h1>
          <p className="text-sm text-slate-400 mt-1">
            Generate viral angles, curiosity gaps, and retention concepts tailored to your audience.
          </p>
        </div>

        {/* Generator Form */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Niche / Topic
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
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Audience
              </label>
              <input
                type="text"
                required
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Content Pillar
              </label>
              <input
                type="text"
                value={pillar}
                onChange={(e) => setPillar(e.target.value)}
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
                    <span>Generating (10c)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Ideas (10c)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Ideas Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Saved & Generated Concepts ({ideas.length})</h2>
          </div>

          {fetchingSaved ? (
            <div className="py-12 flex justify-center text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            </div>
          ) : ideas.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800 p-8">
              <Lightbulb className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No content ideas found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Generate your first batch of viral angles above to fill your idea bank.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ideas.map((idea, idx) => (
                <div
                  key={idea.id || idx}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                        {idea.angle || "Viral Angle"}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-emerald-400 font-bold">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{idea.estimated_engagement ? `${idea.estimated_engagement}%` : "8.7%"}</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2 leading-snug">{idea.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">{idea.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {idea.tags?.map((t: string, i: number) => (
                        <span key={i} className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/hooks?topic=${encodeURIComponent(idea.title)}`}
                        className="inline-flex items-center space-x-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300"
                      >
                        <Flame className="w-3 h-3" />
                        <span>Generate Hooks</span>
                      </Link>
                      <Link
                        href={`/scripts?topic=${encodeURIComponent(idea.title)}`}
                        className="inline-flex items-center space-x-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
                      >
                        <span>Script Post</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
