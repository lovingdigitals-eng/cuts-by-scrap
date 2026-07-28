import { cn } from "@/lib/cn";

export function StarRating({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={cn("h-4 w-4", i < rating ? "fill-chrome" : "fill-white/15")}
        >
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.79L10 14.9l-5.21 2.74 1-5.79-4.21-4.1 5.82-.85z" />
        </svg>
      ))}
    </div>
  );
}
