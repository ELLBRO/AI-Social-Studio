import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Shield } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
          <Shield className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-6">Terms of Service</h1>
        <p className="text-slate-400 text-sm mb-8">Effective Date: January 1, 2026</p>

        <div className="prose prose-invert max-w-none space-y-6 text-slate-300 text-sm leading-relaxed">
          <section className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By signing up for or using AI Social Studio (&quot;Service&quot;), operated by Apex Growth Systems Inc.,
              you agree to be bound by these Terms of Service. If you do not agree to these terms, do not access
              or use the Service.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-3">2. Description of Service & Free Trial</h2>
            <p>
              AI Social Studio provides artificial intelligence content creation, scheduling, analytics, and social
              media publishing automation. All new accounts receive a 7-day free trial granting access to core
              platform features and trial credit allotments. At the end of the trial period, continuous service
              requires an active paid subscription plan.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-3">3. Official Social Media APIs & Compliance</h2>
            <p>
              AI Social Studio integrates exclusively with official developer APIs (Instagram Graph API, TikTok
              Commercial Content API, YouTube Data API, LinkedIn API, and X API v2). Users agree not to attempt to
              bypass platform rate limits, scrape unofficial endpoints, or generate misleading or abusive content
              violating third-party terms.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-3">4. AI Content Ownership & Liability</h2>
            <p>
              You own all intellectual property rights in the content generated and published through your account.
              You are responsible for reviewing, editing, and fact-checking all AI-generated copy, scripts, and media
              before publication to social platforms.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-3">5. Subscriptions, Credits, and Cancellations</h2>
            <p>
              Subscriptions renew automatically on a monthly or annual basis depending on your selected billing cadence.
              Credits represent usage tokens for AI processing and video generation. You may cancel your subscription
              at any time through the Billing settings.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
