"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import {
  TrendingUp,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Flame,
  Loader2,
  Zap,
} from "lucide-react";

export default function OptimizationPage() {
  const { showToast } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadRecommendations = async () => {
    try {
      const data = await apiFetch<any[]>("/optimization/recommendations");
      setRecommendations(data || []);
    } catch (err: any) {
      showToast(err.message || "Failed to load recommendations", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await apiFetch(`/optimization/recommendations/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      showToast(`Recommendation marked as ${newStatus}`, "success");
      setRecommendations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Continuous Improvement Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Optimization Hub</h1>
          <p className="text-sm text-slate-400 mt-1">
            Data-backed AI recommendations to boost short-form video retention, click-through rates, and algorithmic reach.
          </p>
        </div>

        {/* Recommendations List */}
        {loading ? (
          <div className="py-20 flex justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : recommendations.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-slate-900/40 border border-slate-800 p-8">
            <Zap className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">All Caught Up!</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-4">
              Your published content conforms to current algorithmic growth best practices. Run an AI Audit to detect new optimization vectors.
            </p>
            <Link
              href="/ai-audit"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run AI Audit</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-all"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        rec.impact_level === "high"
                          ? "bg-rose-950 text-rose-300 border border-rose-800"
                          : "bg-indigo-950 text-indigo-300 border border-indigo-800"
                      }`}
                    >
                      {rec.impact_level || "high"} Impact
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {rec.recommendation_type || "Hook Optimization"}
                    </span>
                    <span
                      className={`text-[10px] font-semibold capitalize px-2 py-0.5 rounded ${
                        rec.status === "applied"
                          ? "text-emerald-400"
                          : rec.status === "dismissed"
                          ? "text-slate-500 line-through"
                          : "text-amber-400"
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{rec.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {rec.description}
                  </p>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  {rec.status !== "applied" && (
                    <button
                      onClick={() => handleStatusUpdate(rec.id, "applied")}
                      disabled={updatingId === rec.id}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all hover:scale-105 disabled:opacity-60"
                    >
                      {updatingId === rec.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>Apply Recommendation</span>
                    </button>
                  )}

                  {rec.status !== "dismissed" && (
                    <button
                      onClick={() => handleStatusUpdate(rec.id, "dismissed")}
                      disabled={updatingId === rec.id}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="Dismiss Recommendation"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
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
