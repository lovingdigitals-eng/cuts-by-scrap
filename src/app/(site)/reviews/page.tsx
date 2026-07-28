import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Read what clients are saying about Cuts by Scrap.",
};

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { approved: true },
    orderBy: [{ featured: "desc" }, { date: "desc" }],
  });

  return (
    <Section className="pt-16">
      <SectionHeading eyebrow="Reviews" title="Client Reviews" />

      {reviews.length === 0 ? (
        <div className="mx-auto max-w-md text-center">
          <p className="text-white/50">
            No reviews yet — be the first to book and leave feedback after your cut.
          </p>
          <div className="mt-8">
            <Button href="/book">Book Appointment</Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={review.id} delay={i * 0.05}>
              <ReviewCard review={{ ...review, date: review.date.toISOString() }} />
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}
