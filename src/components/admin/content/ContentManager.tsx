"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";

interface Settings {
  heroHeadline: string;
  heroSubheadline: string;
  aboutText: string;
  contactPhone: string;
  contactEmail: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  address: string;
  mapEmbedUrl: string;
  logoUrl: string;
  aboutPhotoUrl: string;
}

export function ContentManager() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingAboutPhoto, setUploadingAboutPhoto] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);
  const aboutPhotoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => setSettings(data.settings));
  }, []);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function uploadLogo() {
    const file = logoRef.current?.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/settings/logo", { method: "POST", body: form });
    const data = await res.json();
    setUploadingLogo(false);
    if (data.settings) setSettings(data.settings);
  }

  async function uploadAboutPhoto() {
    const file = aboutPhotoRef.current?.files?.[0];
    if (!file) return;
    setUploadingAboutPhoto(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/settings/about-photo", { method: "POST", body: form });
    const data = await res.json();
    setUploadingAboutPhoto(false);
    if (data.settings) setSettings(data.settings);
  }

  if (!settings) {
    return <p className="text-sm text-white/40">Loading…</p>;
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-chrome-gradient">
        Site Content
      </h1>

      <GlassCard className="mt-6 p-6">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">Logo</h2>
        <div className="mt-4 flex items-center gap-6">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border-dim">
            <Image src={settings.logoUrl} alt="Logo" fill sizes="64px" className="object-contain" />
          </div>
          <input
            ref={logoRef}
            type="file"
            accept="image/*"
            className="block text-sm text-white/60 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:text-white/70"
          />
          <Button onClick={uploadLogo} disabled={uploadingLogo} size="sm">
            {uploadingLogo ? "Uploading…" : "Upload New Logo"}
          </Button>
        </div>
      </GlassCard>

      <GlassCard className="mt-6 p-6">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
          About Photo
        </h2>
        <p className="mt-1 text-xs text-white/40">
          Shown on the homepage About section and the full About page.
        </p>
        <div className="mt-4 flex items-center gap-6">
          <div className="relative h-20 w-16 overflow-hidden rounded-lg border border-border-dim">
            <Image src={settings.aboutPhotoUrl} alt="About photo" fill sizes="64px" className="object-cover" />
          </div>
          <input
            ref={aboutPhotoRef}
            type="file"
            accept="image/*"
            className="block text-sm text-white/60 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:text-white/70"
          />
          <Button onClick={uploadAboutPhoto} disabled={uploadingAboutPhoto} size="sm">
            {uploadingAboutPhoto ? "Uploading…" : "Upload New Photo"}
          </Button>
        </div>
      </GlassCard>

      <GlassCard className="mt-6 p-6">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
          Homepage
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="hero-headline">Hero Headline</Label>
            <Input
              id="hero-headline"
              value={settings.heroHeadline}
              onChange={(e) => set("heroHeadline", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="hero-subheadline">Hero Subheadline</Label>
            <Input
              id="hero-subheadline"
              value={settings.heroSubheadline}
              onChange={(e) => set("heroSubheadline", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="about-text">About Text</Label>
            <Textarea
              id="about-text"
              rows={6}
              value={settings.aboutText}
              onChange={(e) => set("aboutText", e.target.value)}
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="mt-6 p-6">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
          Contact & Social
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="contact-phone">Phone</Label>
            <Input
              id="contact-phone"
              value={settings.contactPhone}
              onChange={(e) => set("contactPhone", e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input
              id="instagram"
              value={settings.instagram}
              onChange={(e) => set("instagram", e.target.value)}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              id="facebook"
              value={settings.facebook}
              onChange={(e) => set("facebook", e.target.value)}
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <Label htmlFor="tiktok">TikTok URL</Label>
            <Input
              id="tiktok"
              value={settings.tiktok}
              onChange={(e) => set("tiktok", e.target.value)}
              placeholder="https://tiktok.com/@..."
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={settings.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="map-embed">Google Maps Embed URL (optional)</Label>
            <Input
              id="map-embed"
              value={settings.mapEmbedUrl}
              onChange={(e) => set("mapEmbedUrl", e.target.value)}
              placeholder="https://www.google.com/maps/embed?..."
            />
          </div>
        </div>
      </GlassCard>

      <div className="mt-6 flex items-center gap-4">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </Button>
        {saved && <span className="text-sm text-emerald-400">Saved.</span>}
      </div>
    </div>
  );
}
