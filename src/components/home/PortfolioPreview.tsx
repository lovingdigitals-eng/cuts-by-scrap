import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export interface PreviewImage {
  id: string;
  url: string;
  category: string;
}

export function PortfolioPreview({ images }: { images: PreviewImage[] }) {
  if (images.length === 0) return null;

  return (
    <Section id="portfolio">
      <SectionHeading
        eyebrow="Portfolio"
        title="The Work Speaks"
        subtitle="A look at recent fades, tapers, and designs. Full gallery has before/afters and filters by style."
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <Reveal key={img.id} delay={i * 0.06} className="group relative aspect-square overflow-hidden rounded-2xl border border-border-dim">
            <Image
              src={img.url}
              alt={`${img.category} haircut by Cuts by Scrap`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="absolute bottom-3 left-3 font-heading text-xs font-semibold uppercase tracking-wide text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {img.category.replace("_", " ")}
            </span>
          </Reveal>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button href="/portfolio" variant="secondary">
          View Full Portfolio
        </Button>
      </div>
    </Section>
  );
}
