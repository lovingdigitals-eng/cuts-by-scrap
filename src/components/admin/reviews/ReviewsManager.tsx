"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea, Select } from "@/components/ui/Input";
import { StarRating } from "@/components/reviews/StarRating";

interface Review {
  id: string;
  name: string;
  avatarUrl?: string | null;
  rating: number;
  text: string;
  date: string;
  featured: boolean;
  approved: boolean;
}

export function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/reviews");
    const data = await res.json();
    setReviews(data.reviews || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    await fetch("/api/admin/reviews", { method: "POST", body: form });
    setSubmitting(false);
    formRef.current?.reset();
    load();
  }

  async function update(id: string, data: Partial<Review>) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function remove(id: string) {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-chrome-gradient">
        Reviews
      </h1>

      <GlassCard className="mt-6 p-6">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
          Add Review
        </h2>
        <form ref={formRef} onSubmit={create} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="rev-name">Client Name</Label>
            <Input id="rev-name" name="name" required />
          </div>
          <div>
            <Label htmlFor="rev-rating">Rating</Label>
            <Select id="rev-rating" name="rating" defaultValue="5">
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} Stars
                </option>
              ))}
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="rev-text">Review Text</Label>
            <Textarea id="rev-text" name="text" rows={3} required />
          </div>
          <div>
            <Label htmlFor="rev-date">Date</Label>
            <Input id="rev-date" name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
          </div>
          <div>
            <Label htmlFor="rev-avatar">Profile Picture (optional)</Label>
            <input
              id="rev-avatar"
              name="avatarFile"
              type="file"
              accept="image/*"
              className="block w-full text-sm text-white/60 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:text-white/70"
            />
          </div>
          <div className="flex items-center gap-4 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" name="featured" value="true" className="h-4 w-4 rounded border-border-dim" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                name="approved"
                value="true"
                defaultChecked
                className="h-4 w-4 rounded border-border-dim"
              />
              Approved (visible on site)
            </label>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Add Review"}
            </Button>
          </div>
        </form>
      </GlassCard>

      {loading ? (
        <p className="mt-6 text-sm text-white/40">Loading…</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <GlassCard key={review.id} className="p-6">
              <div className="flex items-center gap-3">
                {review.avatarUrl ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image src={review.avatarUrl} alt={review.name} fill sizes="40px" className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-chrome/30 text-xs font-bold text-chrome">
                    {review.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-heading text-sm font-semibold text-white">{review.name}</p>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              <p className="mt-3 text-sm text-white/60">&ldquo;{review.text}&rdquo;</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-white/60">
                  <input
                    type="checkbox"
                    checked={review.featured}
                    onChange={(e) => update(review.id, { featured: e.target.checked })}
                    className="h-3.5 w-3.5 rounded border-border-dim"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-1.5 text-xs text-white/60">
                  <input
                    type="checkbox"
                    checked={review.approved}
                    onChange={(e) => update(review.id, { approved: e.target.checked })}
                    className="h-3.5 w-3.5 rounded border-border-dim"
                  />
                  Approved
                </label>
                <button
                  onClick={() => remove(review.id)}
                  className="ml-auto text-xs font-semibold uppercase tracking-wide text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
