"use client";

import React from "react";
import { useAuth } from "@/context/auth-context";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function Toaster() {
  const { toasts, removeToast } = useAuth();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all transform animate-in slide-in-from-bottom-5 ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
              : toast.type === "error"
              ? "bg-rose-950/90 border-rose-500/40 text-rose-200"
              : "bg-slate-900/90 border-slate-700 text-slate-200"
          }`}
        >
          <div className="mr-3 mt-0.5 flex-shrink-0">
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-400" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-indigo-400" />}
          </div>
          <div className="text-sm font-medium leading-relaxed flex-1">{toast.message}</div>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-3 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
