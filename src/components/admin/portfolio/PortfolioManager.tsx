"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Label, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { PORTFOLIO_CATEGORIES } from "@/lib/validation";

interface PortfolioImage {
  id: string;
  url: string;
  beforeUrl?: string | null;
  category: string;
  caption?: string | null;
  featured: boolean;
}

export function PortfolioManager() {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState<string>(PORTFOLIO_CATEGORIES[0]);
  const fileRef = useRef<HTMLInputElement>(null);
  const beforeFileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/portfolio");
    const data = await res.json();
    setImages(data.images || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    if (beforeFileRef.current?.files?.[0]) {
      form.append("beforeFile", beforeFileRef.current.files[0]);
    }
    form.append("category", category);

    await fetch("/api/admin/portfolio", { method: "POST", body: form });
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (beforeFileRef.current) beforeFileRef.current.value = "";
    load();
  }

  async function updateImage(id: string, data: Partial<PortfolioImage>) {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, ...data } : img)));
    await fetch(`/api/admin/portfolio/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function remove(id: string) {
    if (!confirm("Delete this photo? This cannot be undone.")) return;
    await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-chrome-gradient">
        Portfolio
      </h1>

      <GlassCard className="mt-6 p-6">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
          Upload Photo
        </h2>
        <form onSubmit={upload} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="upload-file">Photo</Label>
            <input
              ref={fileRef}
              id="upload-file"
              type="file"
              accept="image/*"
              required
              className="block w-full text-sm text-white/60 file:mr-3 file:rounded-full file:border-0 file:bg-chrome/15 file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:text-chrome"
            />
          </div>
          <div>
            <Label htmlFor="upload-before">Before Photo (optional)</Label>
            <input
              ref={beforeFileRef}
              id="upload-before"
              type="file"
              accept="image/*"
              className="block w-full text-sm text-white/60 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:text-white/70"
            />
          </div>
          <div>
            <Label htmlFor="upload-category">Category</Label>
            <Select id="upload-category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {PORTFOLIO_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace("_", " ")}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? "Uploading…" : "Upload"}
            </Button>
          </div>
        </form>
      </GlassCard>

      {loading ? (
        <p className="mt-6 text-sm text-white/40">Loading…</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <GlassCard key={img.id} className="overflow-hidden p-0">
              <div className="relative aspect-square">
                <Image src={img.url} alt={img.caption || img.category} fill sizes="220px" className="object-cover" />
                {img.featured && (
                  <Badge className="absolute left-2 top-2" tone="success">
                    Featured
                  </Badge>
                )}
              </div>
              <div className="space-y-2 p-3">
                <Select
                  value={img.category}
                  onChange={(e) => updateImage(img.id, { category: e.target.value })}
                  className="!py-1.5 text-xs"
                >
                  {PORTFOLIO_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.replace("_", " ")}
                    </option>
                  ))}
                </Select>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs text-white/60">
                    <input
                      type="checkbox"
                      checked={img.featured}
                      onChange={(e) => updateImage(img.id, { featured: e.target.checked })}
                      className="h-3.5 w-3.5 rounded border-border-dim"
                    />
                    Featured
                  </label>
                  <button
                    onClick={() => remove(img.id)}
                    className="text-xs font-semibold uppercase tracking-wide text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
