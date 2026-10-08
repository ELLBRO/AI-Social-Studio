"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Send,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

export default function CalendarPage() {
  const { showToast } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState("October 2026");

  const loadCalendar = async () => {
    try {
      const [calRes, schedRes] = await Promise.allSettled([
        apiFetch<any[]>("/calendar/items"),
        apiFetch<any[]>("/publishing/scheduled"),
      ]);
      if (calRes.status === "fulfilled") setItems(calRes.value || []);
      if (schedRes.status === "fulfilled") setScheduledPosts(schedRes.value || []);
    } catch (err: any) {
      showToast(err.message || "Failed to load calendar", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendar();
  }, []);

  // Generate 7 days of the current week for a clear visual week calendar view
  const days = [
    { day: "Mon", date: "Oct 5", dayNum: 5 },
    { day: "Tue", date: "Oct 6", dayNum: 6 },
    { day: "Wed", date: "Oct 7", dayNum: 7 },
    { day: "Thu", date: "Oct 8", dayNum: 8, isToday: true },
    { day: "Fri", date: "Oct 9", dayNum: 9 },
    { day: "Sat", date: "Oct 10", dayNum: 10 },
    { day: "Sun", date: "Oct 11", dayNum: 11 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Multi-Platform Timeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Content Calendar</h1>
            <p className="text-sm text-slate-400 mt-1">
              Timezone-aware cross-channel editorial schedule and automated publishing pipeline.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/editor"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Post</span>
            </Link>
          </div>
        </div>

        {/* Calendar Month Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-base font-bold text-white">{currentMonth}</span>
            <div className="flex items-center space-x-1">
              <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Timezone: <span className="text-slate-200 font-bold">UTC</span>
          </div>
        </div>

        {/* 7-Day Interactive Visual Grid */}
        {loading ? (
          <div className="py-20 flex justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {days.map((d) => (
              <div
                key={d.day}
                className={`min-h-[280px] p-4 rounded-2xl border flex flex-col justify-between ${
                  d.isToday
                    ? "bg-slate-900/90 border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                    : "bg-slate-900/40 border-slate-800/80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/60">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {d.day}
                    </span>
                    <span
                      className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                        d.isToday ? "bg-indigo-600 text-white" : "text-slate-300"
                      }`}
                    >
                      {d.date}
                    </span>
                  </div>

                  {/* Scheduled Items for this day */}
                  <div className="space-y-2">
                    {scheduledPosts.map((post, pIdx) => (
                      <div
                        key={post.id || pIdx}
                        className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-left space-y-1 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-indigo-400 font-bold flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>15:00 UTC</span>
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 uppercase text-[9px] font-bold">
                            {post.status || "sched"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-medium line-clamp-2">
                          {post.caption}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/editor"
                  className="mt-3 w-full py-1.5 rounded-lg border border-dashed border-slate-800 hover:border-slate-700 text-[11px] text-slate-500 hover:text-slate-300 flex items-center justify-center space-x-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Slot</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
