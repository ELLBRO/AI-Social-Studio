import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6">
          <Lock className="w-3.5 h-3.5" />
          <span>Data Protection & Privacy</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-6">Privacy Policy</h1>
        <p className="text-slate-400 text-sm mb-8">Effective Date: January 1, 2026</p>

        <div className="prose prose-invert max-w-none space-y-6 text-slate-300 text-sm leading-relaxed">
          <section className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us: your name, business email address, workspace settings,
              and OAuth tokens necessary to interact with your authorized social media accounts. We do not store raw
              passwords; all authentication uses industry-standard cryptographic hashing (bcrypt).
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-3">2. Social Platform Token Security</h2>
            <p>
              OAuth access tokens for Instagram, TikTok, YouTube, LinkedIn, and X are encrypted at rest using AES-256
              encryption before being stored in our database. Tokens are never exposed to client-side browsers and are
              only accessed by backend workers during authorized publishing and analytics synchronization operations.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-3">3. How AI Models Use Your Data</h2>
            <p>
              Content inputs sent to our abstracted AI model pipelines are used solely to generate the requested copy,
              scripts, and media. We do not sell your brand assets, prompts, or proprietary performance data to third-party
              data brokers or use them to train public foundation models without your explicit opt-in consent.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-3">4. Multi-Tenant Data Isolation</h2>
            <p>
              All customer organization workspaces are strictly logically isolated by tenant identifier. No organization
              can access or query another organization&apos;s data, generated content, analytics, or media assets.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
