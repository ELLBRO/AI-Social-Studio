"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import {
  CreditCard,
  Check,
  Sparkles,
  ShieldCheck,
  Loader2,
  ExternalLink,
  Coins,
} from "lucide-react";

export default function BillingPage() {
  const { currentOrg, showToast } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOutPlanId, setCheckingOutPlanId] = useState<string | null>(null);

  const loadBillingData = async () => {
    try {
      const [plansRes, subRes] = await Promise.allSettled([
        apiFetch<any[]>("/billing/plans"),
        apiFetch<any>("/billing/subscription"),
      ]);
      if (plansRes.status === "fulfilled") setPlans(plansRes.value || []);
      if (subRes.status === "fulfilled") setSubscription(subRes.value);
    } catch (err: any) {
      showToast(err.message || "Failed to load billing plans", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillingData();
  }, []);

  const handleCheckout = async (planId: string) => {
    setCheckingOutPlanId(planId);
    try {
      const res = await apiFetch<any>("/billing/checkout", {
        method: "POST",
        body: JSON.stringify({ plan_id: planId }),
      });
      showToast("Redirecting to Stripe secure checkout...", "info");
      if (res.checkout_url) {
        window.location.href = res.checkout_url;
      }
    } catch (err: any) {
      showToast(err.message || "Checkout session failed", "error");
    } finally {
      setCheckingOutPlanId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Stripe Powered Subscriptions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Subscription & Billing</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your organization tier, AI credit allowances, and payment methods.
          </p>
        </div>

        {/* Current Active Plan Status Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900/90 to-purple-950/40 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Current Plan
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
                {subscription?.status || "Trial Active"}
              </span>
            </div>
            <h2 className="text-xl font-black text-white">
              {subscription?.plan?.name || "Growth Pro Trial"}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              7-Day Free Trial ends in 5 days. Full access with 2,000 monthly credits.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => showToast("Opening Stripe Customer Portal...", "info")}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              Billing Portal
            </button>
          </div>
        </div>

        {/* Available Plans Grid */}
        <div>
          <h2 className="text-base font-bold text-white mb-4">Available Subscription Plans</h2>
          {loading ? (
            <div className="py-20 flex justify-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isCurrent = subscription?.plan?.id === plan.id || plan.code === "pro";
                return (
                  <div
                    key={plan.id}
                    className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                      isCurrent
                        ? "bg-slate-900/90 border-indigo-500 shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-500/50"
                        : "bg-slate-900/40 border-slate-800"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                        {plan.code === "pro" && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold uppercase">
                            Most Popular
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline space-x-1 my-4">
                        <span className="text-3xl font-black text-white">${plan.price_monthly}</span>
                        <span className="text-xs text-slate-400">/ month</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 mb-6 flex items-center space-x-2 text-xs text-indigo-300 font-semibold">
                        <Coins className="w-4 h-4 text-indigo-400" />
                        <span>{plan.credits_per_month?.toLocaleString()} AI credits per month</span>
                      </div>

                      <ul className="space-y-2.5 text-xs text-slate-300">
                        {plan.features?.map((feat: string, fIdx: number) => (
                          <li key={fIdx} className="flex items-start space-x-2">
                            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800">
                      <button
                        onClick={() => handleCheckout(plan.id)}
                        disabled={checkingOutPlanId === plan.id}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                          isCurrent
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                        }`}
                      >
                        {checkingOutPlanId === plan.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        ) : isCurrent ? (
                          "Maintain Subscription"
                        ) : (
                          `Switch to ${plan.name}`
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
