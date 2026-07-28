"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { Modal } from "@/components/ui/Modal";

export interface GalleryImage {
  id: string;
  url: string;
  beforeUrl?: string | null;
  category: string;
  caption?: string | null;
  createdAt: string;
}

const FILTERS = ["ALL", "FADE", "TAPER", "BURST_FADE", "DESIGN", "BEARD", "KIDS", "NEWEST"] as const;

function label(f: string) {
  if (f === "ALL") return "All";
  if (f === "NEWEST") return "Newest";
  return f
    .split("_")
    .map((w) => w[0] + w.slice(1).toLowerCase())
    .join(" ");
}

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showBefore, setShowBefore] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "ALL") return images;
    if (filter === "NEWEST") {
      return [...images].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return images.filter((img) => img.category === filter);
  }, [filter, images]);

  const active = activeIndex !== null ? filtered[activeIndex] : null;

  function openAt(index: number) {
    setShowBefore(false);
    setActiveIndex(index);
  }

  function step(delta: number) {
    if (activeIndex === null) return;
    setShowBefore(false);
    setActiveIndex((activeIndex + delta + filtered.length) % filtered.length);
  }

  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wide transition-colors",
              filter === f
                ? "border-chrome bg-chrome/15 text-chrome"
                : "border-border-dim text-white/50 hover:border-chrome/40 hover:text-white"
            )}
          >
            {label(f)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-white/40">No photos in this category yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((img, i) => (
            <button
              key={img.id}
              onClick={() => openAt(i)}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-border-dim text-left"
            >
              <Image
                src={img.url}
                alt={img.caption || `${label(img.category)} haircut by Cuts by Scrap`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="absolute bottom-3 left-3 font-heading text-xs font-semibold uppercase tracking-wide text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {label(img.category)}
              </span>
              {img.beforeUrl && (
                <span className="absolute right-2 top-2 rounded-full border border-chrome/40 bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-chrome">
                  Before/After
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <Modal open={active !== null} onClose={() => setActiveIndex(null)} className="max-w-3xl">
        {active && (
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black sm:aspect-[4/3]">
              <Image
                src={showBefore && active.beforeUrl ? active.beforeUrl : active.url}
                alt={active.caption || label(active.category)}
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-contain"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-heading text-sm font-semibold uppercase tracking-wide text-chrome">
                  {label(active.category)}
                </p>
                {active.caption && <p className="text-sm text-white/60">{active.caption}</p>}
              </div>
              <div className="flex gap-2">
                {active.beforeUrl && (
                  <button
                    onClick={() => setShowBefore((v) => !v)}
                    className="rounded-full border border-chrome/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-chrome hover:bg-chrome/10"
                  >
                    {showBefore ? "Show After" : "Show Before"}
                  </button>
                )}
                <button
                  onClick={() => step(-1)}
                  className="rounded-full border border-border-dim px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 hover:border-chrome/40"
                >
                  Prev
                </button>
                <button
                  onClick={() => step(1)}
                  className="rounded-full border border-border-dim px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 hover:border-chrome/40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
