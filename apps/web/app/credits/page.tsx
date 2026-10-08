"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import {
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Plus,
  Loader2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export default function CreditsPage() {
  const { refreshCredits, showToast } = useAuth();
  const [account, setAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toppingUp, setToppingUp] = useState(false);

  const loadCredits = async () => {
    try {
      const [accRes, txRes] = await Promise.allSettled([
        apiFetch<any>("/credits/account"),
        apiFetch<any[]>("/credits/transactions"),
      ]);
      if (accRes.status === "fulfilled") setAccount(accRes.value);
      if (txRes.status === "fulfilled") setTransactions(txRes.value || []);
    } catch (err: any) {
      showToast(err.message || "Failed to load credits ledger", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCredits();
  }, []);

  const handleTopUp = async (amount: number) => {
    setToppingUp(true);
    try {
      await apiFetch("/credits/top-up", {
        method: "POST",
        body: JSON.stringify({ amount }),
      });
      showToast(`Added ${amount} credits to your workspace ledger!`, "success");
      await refreshCredits();
      await loadCredits();
    } catch (err: any) {
      showToast(err.message || "Failed to top up credits", "error");
    } finally {
      setToppingUp(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Coins className="w-3.5 h-3.5" />
              <span>Double-Entry Usage Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Credits Ledger</h1>
            <p className="text-sm text-slate-400 mt-1">
              Immutable transaction history for all AI generations, video renders, and strategy audits.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleTopUp(500)}
              disabled={toppingUp}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 disabled:opacity-60"
            >
              {toppingUp ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>Top Up 500 Credits</span>
            </button>
          </div>
        </div>

        {/* Ledger Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Current Balance
            </span>
            <div className="text-4xl font-black text-white">
              {account?.balance !== undefined ? account.balance : 750}
            </div>
            <p className="text-xs text-slate-500 mt-2">Available for immediate AI execution</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Lifetime Granted
            </span>
            <div className="text-4xl font-black text-emerald-400">
              {account?.lifetime_granted || 800}
            </div>
            <p className="text-xs text-slate-500 mt-2">Trial allotments and purchased bundles</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Lifetime Consumed
            </span>
            <div className="text-4xl font-black text-purple-400">
              {account?.lifetime_used || 50}
            </div>
            <p className="text-xs text-slate-500 mt-2">Audited ledger deductions</p>
          </div>
        </div>

        {/* Cost Matrix Reference */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            Operation Credit Consumption Matrix
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-slate-400 block">AI Strategy Blueprint</span>
              <strong className="text-indigo-400">15 Credits</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-slate-400 block">Video Script (with Cues)</span>
              <strong className="text-indigo-400">10 Credits</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-slate-400 block">Viral Hooks (5 Pack)</span>
              <strong className="text-indigo-400">5 Credits</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-slate-400 block">AI Video Diffusion Job</span>
              <strong className="text-rose-400">30 Credits</strong>
            </div>
          </div>
        </div>

        {/* Audit Transaction History Table */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h2 className="text-base font-bold text-white mb-4">Transaction History</h2>
          {loading ? (
            <div className="py-12 flex justify-center text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-xs text-slate-400">No transactions recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Description</th>
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {transactions.map((tx) => {
                    const isPositive = tx.amount > 0;
                    return (
                      <tr key={tx.id} className="hover:bg-slate-800/30">
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isPositive
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                : "bg-purple-950 text-purple-300 border border-purple-800"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-200 font-medium">{tx.description}</td>
                        <td className="py-3.5 text-slate-400 font-mono text-[11px]">{tx.reference_type || "manual"}</td>
                        <td
                          className={`py-3.5 font-mono font-bold ${
                            isPositive ? "text-emerald-400" : "text-slate-300"
                          }`}
                        >
                          {isPositive ? `+${tx.amount}` : tx.amount}
                        </td>
                        <td className="py-3.5 text-slate-500 font-mono text-[11px]">
                          {new Date(tx.created_at).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
