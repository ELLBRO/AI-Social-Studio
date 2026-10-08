"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import {
  Image,
  UploadCloud,
  Trash2,
  Copy,
  Check,
  Video,
  File,
  Loader2,
  ExternalLink,
} from "lucide-react";

export default function MediaPage() {
  const { showToast } = useAuth();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadMedia = async () => {
    try {
      const data = await apiFetch<any[]>("/media");
      setAssets(data || []);
    } catch (err: any) {
      showToast(err.message || "Failed to load media assets", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const orgId = typeof window !== "undefined" ? localStorage.getItem("current_org_id") : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (orgId) headers["X-Organization-Id"] = orgId;

      const res = await fetch(`${apiUrl}/media/upload`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!res.ok) {
        throw new Error("File upload failed");
      }

      showToast(`Uploaded ${file.name} successfully!`, "success");
      loadMedia();
    } catch (err: any) {
      showToast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/media/${id}`, { method: "DELETE" });
      setAssets((prev) => prev.filter((a) => a.id !== id));
      showToast("Media asset deleted", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to delete media", "error");
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast("Media URL copied!", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
              <Image className="w-3.5 h-3.5" />
              <span>Asset Storage & CDN</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Media Library</h1>
            <p className="text-sm text-slate-400 mt-1">
              Store and organize images, videos, thumbnails, and generated visual assets.
            </p>
          </div>

          <div>
            <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-105">
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading Asset...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Asset</span>
                </>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="py-20 flex justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : assets.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-slate-900/40 border border-slate-800 p-8">
            <UploadCloud className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">Your Media Library is Empty</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-4">
              Upload video footage, graphics, or run an AI Video generation to store assets here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all group"
              >
                <div className="space-y-3">
                  <div className="h-36 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center overflow-hidden relative">
                    {asset.asset_type === "video" || asset.mime_type?.includes("video") ? (
                      <div className="flex flex-col items-center justify-center text-rose-400">
                        <Video className="w-10 h-10 mb-1" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Video Asset</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-indigo-400">
                        <Image className="w-10 h-10 mb-1" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Image Asset</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-white truncate" title={asset.filename}>
                      {asset.filename}
                    </h3>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="uppercase">{asset.asset_type || (asset.mime_type?.includes("video") ? "video" : "image")}</span>
                      <span>{(((asset.file_size || asset.file_size_bytes || 0)) / 1024).toFixed(0)} KB</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => copyUrl(asset.url || asset.storage_url || "", asset.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs inline-flex items-center space-x-1"
                    title="Copy URL"
                  >
                    {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === asset.id ? "Copied" : "URL"}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
