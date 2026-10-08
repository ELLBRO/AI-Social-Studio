"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import {
  Bot,
  Sparkles,
  Flame,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Loader2,
  ArrowRight,
  Target,
} from "lucide-react";

export default function AIAuditPage() {
  const { refreshCredits, showToast } = useAuth();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<any>("/optimization/analyze", { method: "POST" });
      setAnalysis(data);
      await refreshCredits();
      showToast("AI Performance Audit completed! 10 credits deducted.", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to run AI audit", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
              <Bot className="w-3.5 h-3.5" />
              <span>Algorithmic Intelligence Audit</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Performance Audit</h1>
            <p className="text-sm text-slate-400 mt-1">
              Analyze retention curves, hook decay rates, and content fatigue patterns across published posts.
            </p>
          </div>

          <div>
            <button
              onClick={handleRunAnalysis}
              disabled={loading}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Auditing Performance (10c)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Live AI Audit (10 Credits)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audit Results */}
        {analysis ? (
          <div className="space-y-6">
            {/* Executive Summary */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h2 className="text-base font-bold text-white mb-2 flex items-center space-x-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>Auditor Executive Summary</span>
              </h2>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {analysis.summary}
              </p>
            </div>

            {/* Winning Hooks vs Weak Patterns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Winning Patterns */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Winning Patterns & Top Hooks</span>
                </div>
                <ul className="space-y-3">
                  {analysis.top_hooks?.map((hook: string, idx: number) => (
                    <li key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200">
                      &quot;{hook}&quot;
                    </li>
                  ))}
                  {analysis.top_formats?.map((fmt: string, idx: number) => (
                    <li key={`fmt-${idx}`} className="flex items-center space-x-2 text-xs text-indigo-300">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      <span>Format Winner: {fmt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weak Patterns to Cut */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-4">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Drop-Off & Weak Patterns</span>
                </div>
                <ul className="space-y-3">
                  {analysis.weak_patterns?.map((pattern: string, idx: number) => (
                    <li key={idx} className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs text-slate-300">
                      {pattern}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Audience Insights & Strategic Next Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3">
                  Audience Psychology & Retention
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {analysis.audience_insights?.map((insight: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-purple-400 font-bold">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
                  Key Algorithmic Takeaways
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {analysis.key_takeaways?.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Turn Audit Into Concrete Actions</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  View concrete AI recommendations with 1-click status transitions in the Optimization Hub.
                </p>
              </div>
              <Link
                href="/optimization"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md"
              >
                <span>Optimization Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-24 text-center rounded-2xl bg-slate-900/40 border border-slate-800 p-8">
            <Bot className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Active Audit Loaded</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-6">
              Click &quot;Run Live AI Audit&quot; to synthesize your recent video retention, hooks, and engagement data.
            </p>
            <button
              onClick={handleRunAnalysis}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25"
            >
              <Sparkles className="w-4 h-4" />
              <span>Initiate Audit (10 Credits)</span>
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
