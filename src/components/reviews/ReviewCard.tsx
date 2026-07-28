import { GlassCard } from "@/components/ui/GlassCard";
import { StarRating } from "@/components/reviews/StarRating";

export interface ReviewCardData {
  id: string;
  name: string;
  avatarUrl?: string | null;
  rating: number;
  text: string;
  date: string;
  featured?: boolean;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ReviewCard({ review }: { review: ReviewCardData }) {
  return (
    <GlassCard className="flex h-full flex-col p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-chrome/30 bg-white/5 font-heading text-sm font-bold text-chrome">
          {initials(review.name)}
        </div>
        <div>
          <p className="font-heading text-sm font-semibold text-white">{review.name}</p>
          <p className="text-xs text-white/40">
            {new Date(review.date).toLocaleDateString(undefined, {
              month: "short",
              year: "numeric",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
      <StarRating rating={review.rating} className="mt-4" />
      <p className="mt-3 flex-1 text-sm leading-relaxed text-white/70">&ldquo;{review.text}&rdquo;</p>
    </GlassCard>
  );
}
