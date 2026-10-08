"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import {
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  PenTool,
  Loader2,
  Share2,
} from "lucide-react";

export default function CaptionsPage() {
  const { refreshCredits, showToast } = useAuth();
  const [topic, setTopic] = useState("Why 90% of SaaS founders fail at organic video marketing in 2026");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("Educational, relatable, high authority");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState<any[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch<any[]>("/content/generate-captions", {
        method: "POST",
        body: JSON.stringify({
          topic,
          platform,
          tone,
          include_hashtags: includeHashtags,
        }),
      });
      setCaptions(data);
      await refreshCredits();
      showToast("Generated 3 platform-tailored caption variations! 5 credits deducted.", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to generate captions", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyCaption = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    showToast("Caption copied to clipboard!", "success");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Multi-Platform Copy Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Captions & Copywriting</h1>
          <p className="text-sm text-slate-400 mt-1">
            Generate platform-native captions formatted with spacing, hook lines, CTAs, and hashtags.
          </p>
        </div>

        {/* Input Parameters */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Content Context / Summary
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
                Target Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="instagram">Instagram (Reels / Feed)</option>
                <option value="tiktok">TikTok (Short Copy)</option>
                <option value="linkedin">LinkedIn (Long Thought-Leadership)</option>
                <option value="youtube">YouTube (SEO Description)</option>
                <option value="x">X / Twitter (Thread / Post)</option>
              </select>
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
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Captions (5c)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Captions List */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">Generated Captions ({captions.length})</h2>

          {captions.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800 p-8">
              <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No captions generated</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Select your platform and topic to generate 3 high-converting caption styles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {captions.map((cap, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Option #{idx + 1}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {cap.character_count || cap.caption_text.length} chars
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-medium bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                      {cap.caption_text}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => copyCaption(cap.caption_text, idx)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center space-x-1.5 transition-colors"
                    >
                      {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIdx === idx ? "Copied" : "Copy"}</span>
                    </button>
                    <Link
                      href={`/editor?caption=${encodeURIComponent(cap.caption_text)}`}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Use in Post</span>
                    </Link>
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
