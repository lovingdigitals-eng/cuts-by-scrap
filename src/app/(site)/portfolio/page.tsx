import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Gallery } from "@/components/portfolio/Gallery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Browse fades, tapers, designs, and beard work from Cuts by Scrap.",
};

export default async function PortfolioPage() {
  const images = await prisma.portfolioImage.findMany({ orderBy: { order: "asc" } });

  return (
    <Section className="pt-16">
      <SectionHeading
        eyebrow="Portfolio"
        title="Fresh Cuts, Every Angle"
        subtitle="Filter by style to see the range — fades, tapers, designs, beard work, and kids cuts."
      />
      <Gallery
        images={images.map((img) => ({ ...img, createdAt: img.createdAt.toISOString() }))}
      />
    </Section>
  );
}
