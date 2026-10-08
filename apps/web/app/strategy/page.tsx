"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import {
  Sparkles,
  Target,
  CheckCircle2,
  Layers,
  Calendar,
  Zap,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

export default function StrategyPage() {
  const { refreshCredits, showToast } = useAuth();
  const [brandName, setBrandName] = useState("Apex Growth Studio");
  const [niche, setNiche] = useState("Creator Economy & SaaS Growth");
  const [targetAudience, setTargetAudience] = useState("Founders, Solo Creators, B2B Marketers");
  const [tone, setTone] = useState("Direct, high-conviction, tactical, data-driven");
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch<any>("/content/generate-strategy", {
        method: "POST",
        body: JSON.stringify({
          brand_name: brandName,
          niche,
          target_audience: targetAudience,
          primary_goals: ["Audience Growth", "Lead Generation", "Brand Authority"],
          platforms: ["tiktok", "instagram", "youtube", "linkedin"],
          tone,
        }),
      });
      setStrategy(data);
      await refreshCredits();
      showToast("AI Content Strategy synthesized! 15 credits deducted.", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to generate strategy", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!strategy) return;
    const text = `BRAND POSITIONING:\n${strategy.brand_positioning}\n\nCONTENT PILLARS:\n${strategy.content_pillars?.join("\n")}\n\nPOSTING CADENCE:\n${strategy.posting_cadence}\n\nGROWTH TACTICS:\n${strategy.growth_tactics?.join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Strategy copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Architecture Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Content Strategy Blueprint</h1>
          <p className="text-sm text-slate-400 mt-1">
            Synthesize market positioning, high-converting pillars, and algorithmic publishing schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Strategy Form */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h2 className="text-base font-bold text-white mb-4">Brand Parameters</h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Brand / Creator Name
                </label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Niche & Focus Area
                </label>
                <input
                  type="text"
                  required
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Audience
                </label>
                <input
                  type="text"
                  required
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Tone of Voice
                </label>
                <input
                  type="text"
                  required
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
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
                      <span>Synthesizing Strategy (15 Credits)...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Full Strategy (15 Credits)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Strategy Output Blueprint */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            {strategy ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white">Synthesized Growth Strategy</h3>
                    <p className="text-xs text-slate-400">Generated with provider-independent LLM pipeline</p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy Blueprint"}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                    <Target className="w-4 h-4" />
                    <span>Brand Positioning Statement</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">
                    {strategy.brand_positioning}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="flex items-center space-x-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-3">
                      <Layers className="w-4 h-4" />
                      <span>Core Content Pillars</span>
                    </div>
                    <ul className="space-y-2">
                      {strategy.content_pillars?.map((pillar: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span>{pillar}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="flex items-center space-x-2 text-xs font-bold text-pink-400 uppercase tracking-wider mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>Posting Cadence & Formats</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium mb-3">{strategy.posting_cadence}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {strategy.recommended_formats?.map((fmt: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-pink-950 text-pink-300 border border-pink-800 text-[10px] font-semibold">
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
                    <Zap className="w-4 h-4" />
                    <span>Growth & Conversion Tactics</span>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {strategy.growth_tactics?.map((tactic: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{tactic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">No Strategy Generated Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Fill in your brand parameters on the left to synthesize an end-to-end multi-platform growth blueprint.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
