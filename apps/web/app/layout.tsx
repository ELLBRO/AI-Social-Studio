import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/layout/Toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "AI Social Studio — AI Social Media Growth Platform",
  description:
    "The all-in-one AI platform for content strategy, viral hooks, video generation, calendar scheduling, and performance optimization.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen selection:bg-indigo-500 selection:text-white">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>

        <SpeedInsights />
      </body>
    </html>
  );
}