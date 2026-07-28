import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ReviewCard, type ReviewCardData } from "@/components/reviews/ReviewCard";
import { Button } from "@/components/ui/Button";

export function ReviewsPreview({ reviews }: { reviews: ReviewCardData[] }) {
  if (reviews.length === 0) return null;

  return (
    <Section id="reviews" className="bg-surface/40">
      <SectionHeading eyebrow="Reviews" title="What Clients Are Saying" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, i) => (
          <Reveal key={review.id} delay={i * 0.08}>
            <ReviewCard review={review} />
          </Reveal>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button href="/reviews" variant="secondary">
          Read All Reviews
        </Button>
      </div>
    </Section>
  );
}
