"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Check, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter Creator",
      code: "starter",
      description: "Ideal for solo founders and creators kicking off their organic social presence.",
      monthlyPrice: 29,
      annualPrice: 24,
      credits: 500,
      accounts: 3,
      features: [
        "500 AI generation credits / mo",
        "3 connected social accounts",
        "AI Content Strategy & Pillars",
        "Viral Hooks & Script Lab",
        "Standard Video Generation",
        "Visual Content Calendar",
        "Automated Publishing",
        "Basic Engagement Analytics",
      ],
      popular: false,
    },
    {
      name: "Growth Pro",
      code: "pro",
      description: "For high-volume creators and fast-growing businesses demanding scale.",
      monthlyPrice: 79,
      annualPrice: 65,
      credits: 2000,
      accounts: 10,
      features: [
        "2,000 AI generation credits / mo",
        "10 connected social accounts",
        "AI Content Strategy & Pillars",
        "Viral Hooks & Script Lab",
        "HD Asynchronous Video Generation",
        "Drag & Drop Content Calendar",
        "Idempotent Multi-Platform Publishing",
        "Cross-Platform Normalized Analytics",
        "AI Performance & Retention Audits",
        "Automated Optimization Engine",
        "Priority Background Worker Queues",
      ],
      popular: true,
    },
    {
      name: "Agency & Enterprise",
      code: "enterprise",
      description: "Built for agencies managing multiple client brands and multi-tier teams.",
      monthlyPrice: 249,
      annualPrice: 199,
      credits: 10000,
      accounts: 50,
      features: [
        "10,000 AI generation credits / mo",
        "50 connected social accounts",
        "Everything in Growth Pro",
        "Ultra-Fast Video Rendering",
        "White-Label Analytics Exports",
        "Multi-Tenant Team Workspaces & Roles",
        "Custom AI Prompt Engineering",
        "Dedicated Success Strategist",
        "99.9% Uptime SLA",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>7-Day Free Trial On All Plans</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white">Simple, transparent pricing.</h1>
          <p className="mt-4 text-slate-300 text-lg">
            Every plan includes 7 days free access. Upgrade or cancel anytime directly from your dashboard.
          </p>

          {/* Billing Switcher */}
          <div className="mt-8 inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                !isAnnual ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                isAnnual ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.code}
              className={`rounded-2xl p-8 flex flex-col justify-between border transition-all ${
                plan.popular
                  ? "bg-slate-900/80 border-indigo-500/50 shadow-2xl shadow-indigo-500/10 ring-1 ring-indigo-500/30 relative"
                  : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="mt-2 text-sm text-slate-400 min-h-[40px]">{plan.description}</p>

                <div className="mt-6 mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold text-white">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="ml-2 text-sm text-slate-400">/ month</span>
                  </div>
                  {isAnnual && (
                    <div className="text-xs text-indigo-400 mt-1 font-medium">Billed annually</div>
                  )}
                </div>

                <div className="border-t border-slate-800/80 pt-6">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
                    What's included
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/60">
                <Link
                  href={`/signup?plan=${plan.code}`}
                  className={`w-full inline-flex items-center justify-center space-x-2 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                    plan.popular
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                      : "bg-slate-800 hover:bg-slate-700 text-white"
                  }`}
                >
                  <span>Start 7-Day Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="mt-3 text-center text-xs text-slate-500 flex items-center justify-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Cancel anytime within 7 days</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
