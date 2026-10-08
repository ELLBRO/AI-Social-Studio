import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Sparkles,
  Zap,
  Calendar,
  BarChart3,
  Video,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Cpu,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        {/* Glow gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Next-Gen AI Social Engine for US Creators & Brands</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Grow your audience on <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Autopilot</span> with precision AI.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Generate viral hooks, high-retention video scripts, multi-platform captions, and automated calendar schedules. All powered by provider-independent intelligence.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>Start 7-Day Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              Explore Live Demo
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-6 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Platform APIs Only</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No Credit Card Required for Trial</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="max-w-6xl mx-auto px-4 mt-16">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-2 sm:p-4 shadow-2xl backdrop-blur-xl">
            <div className="rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950">
              <div className="h-10 bg-slate-900/90 border-b border-slate-800 flex items-center px-4 space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-400 ml-4 font-mono">dashboard.aisocialstudio.com</span>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <div className="text-xs text-indigo-400 font-semibold mb-1 uppercase tracking-wider">AI Hook Lab</div>
                  <div className="text-lg font-bold text-white mb-2">9.4 Virality Score</div>
                  <p className="text-sm text-slate-300">"If you are still posting without this 3-second rule, stop right now."</p>
                </div>
                <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <div className="text-xs text-purple-400 font-semibold mb-1 uppercase tracking-wider">Cross-Platform Sync</div>
                  <div className="text-lg font-bold text-white mb-2">3 Accounts Connected</div>
                  <p className="text-sm text-slate-300">TikTok (+124k), Instagram (+48k), YouTube Shorts (+35k)</p>
                </div>
                <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <div className="text-xs text-emerald-400 font-semibold mb-1 uppercase tracking-wider">Optimization Engine</div>
                  <div className="text-lg font-bold text-white mb-2">+42% Retention Gain</div>
                  <p className="text-sm text-slate-300">Curiosity gap pattern interrupts applied across short-form videos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-slate-800/80 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Modular Growth Infrastructure</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Everything needed to dominate organic social.</h3>
            <p className="mt-4 text-slate-400">Engineered with provider-independent architecture so your strategy never breaks when AI models change.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">AI Content Strategy & Pillars</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Establish data-backed positioning, 4 actionable content pillars, brand themes, and optimal posting cadence tailored for the US market.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Viral Hooks & Script Studio</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Generate retention-engineered opening hooks with algorithmic virality scores, plus full visual storyboard scenes with dialogue and on-screen overlays.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center mb-6">
                <Video className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Asynchronous AI Video Studio</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Turn ideas directly into ready-to-publish short-form videos with provider-independent video pipelines (9:16 Shorts/Reels/TikTok ready).
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Multi-Channel Calendar & Queue</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Visual day, week, and month calendars with drag-and-drop rescheduling and timezone-aware server timestamps.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Normalized Cross-Platform Analytics</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Unify reach, impressions, follower growth, and engagement rate across Instagram, TikTok, YouTube, LinkedIn, and X without data silos.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">AI Optimization & Actionable Feedback</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                AI continuously analyzes past posts to detect retention drop-offs, recommending concrete improvements to hooks, CTAs, and posting windows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-indigo-950/40 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-white">Ready to automate your social media growth?</h2>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto">
            Get started with 150 free credits and a 7-day free trial on our Pro plan. No credit card required.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
