"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  Lightbulb,
  Flame,
  FileText,
  MessageSquare,
  Hash,
  PenTool,
  Image,
  Video,
  Share2,
  Send,
  BarChart3,
  TrendingUp,
  Cpu,
  Coins,
  CreditCard,
  Settings,
  ChevronRight,
  Bot,
} from "lucide-react";
import clsx from "clsx";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Content Calendar", href: "/calendar", icon: Calendar },
      { name: "Scheduled & Published", href: "/posts", icon: Send },
    ],
  },
  {
    title: "AI Studio",
    items: [
      { name: "Content Strategy", href: "/strategy", icon: Sparkles },
      { name: "Content Ideas", href: "/ideas", icon: Lightbulb },
      { name: "Hook Lab", href: "/hooks", icon: Flame, badge: "Viral" },
      { name: "Video Scripts", href: "/scripts", icon: FileText },
      { name: "Captions & Copy", href: "/captions", icon: MessageSquare },
      { name: "Hashtags", href: "/hashtags", icon: Hash },
      { name: "Content Editor", href: "/editor", icon: PenTool },
    ],
  },
  {
    title: "Media & Video",
    items: [
      { name: "Media Assets", href: "/media", icon: Image },
      { name: "AI Video Studio", href: "/video", icon: Video, badge: "Async" },
    ],
  },
  {
    title: "Growth & Insights",
    items: [
      { name: "Connected Channels", href: "/social-accounts", icon: Share2 },
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
      { name: "AI Performance Audit", href: "/ai-audit", icon: Bot },
      { name: "Optimization", href: "/optimization", icon: TrendingUp },
    ],
  },
  {
    title: "Account & Workspace",
    items: [
      { name: "Credits Ledger", href: "/credits", icon: Coins },
      { name: "Billing & Plans", href: "/billing", icon: CreditCard },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:w-64",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-extrabold text-white tracking-tight">AI Social</span>
            <span className="text-xs ml-1 font-bold text-indigo-400 uppercase tracking-widest">Studio</span>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              {section.title}
            </div>
            {section.items.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={clsx(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group",
                    active
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  )}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon
                      className={clsx(
                        "w-4 h-4 flex-shrink-0 transition-colors",
                        active ? "text-white" : "text-slate-400 group-hover:text-slate-300"
                      )}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={clsx(
                        "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase",
                        active
                          ? "bg-indigo-700 text-indigo-100"
                          : "bg-indigo-950 text-indigo-300 border border-indigo-800"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Trial Status Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-white">Growth Pro Trial</span>
            <span className="text-[10px] text-emerald-400 font-bold">Active</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-1.5 rounded-full w-2/3" />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
            <span>5 days remaining</span>
            <Link href="/billing" className="text-indigo-400 hover:underline">
              Upgrade
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
