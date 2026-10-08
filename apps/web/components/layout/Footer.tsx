import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/60 bg-slate-950/80 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">AI Social Studio</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The end-to-end AI social media growth engine engineered for American creators, founders, and modern brands.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#features" className="hover:text-white transition">AI Strategy Studio</Link></li>
              <li><Link href="/#features" className="hover:text-white transition">Viral Hooks Lab</Link></li>
              <li><Link href="/#features" className="hover:text-white transition">AI Video Generator</Link></li>
              <li><Link href="/#features" className="hover:text-white transition">Autonomous Scheduler</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pricing" className="hover:text-white transition">Pricing Plans</Link></li>
              <li><a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="hover:text-white transition">REST API Docs</a></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Trust & Compliance</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              We exclusively interface via official Meta, TikTok, YouTube, LinkedIn, and X developer APIs. Multi-tenant isolation and AES token encryption guaranteed.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>© {new Date().getFullYear()} AI Social Studio Inc. All rights reserved.</div>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/terms" className="hover:text-slate-300">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-300">Privacy</Link>
            <span>US East Infrastructure</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
