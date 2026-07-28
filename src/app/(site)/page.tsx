import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/home/Hero";
import { AboutPreview } from "@/components/home/AboutPreview";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { PortfolioPreview } from "@/components/home/PortfolioPreview";
import { ReviewsPreview } from "@/components/home/ReviewsPreview";
import { CTASection } from "@/components/home/CTASection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, services, portfolioImages, reviews] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    prisma.service.findMany({ where: { active: true }, orderBy: { order: "asc" }, take: 6 }),
    prisma.portfolioImage.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
      take: 8,
    }),
    prisma.review.findMany({
      where: { approved: true, featured: true },
      orderBy: { date: "desc" },
      take: 3,
    }),
  ]);

  return (
    <>
      <Hero
        logoUrl={settings?.logoUrl || "/logo.png"}
        headline={settings?.heroHeadline || "CUTS BY SCRAP"}
        subheadline={
          settings?.heroSubheadline || "Student Barber. Precision Cuts. Built Different."
        }
      />
      <AboutPreview
        aboutText={
          settings?.aboutText ||
          "College student barber passionate about the craft — professional fades, clean cuts, and quality over quantity."
        }
      />
      <ServicesPreview services={services} />
      <PortfolioPreview images={portfolioImages} />
      <ReviewsPreview reviews={reviews.map((r) => ({ ...r, date: r.date.toISOString() }))} />
      <CTASection />
    </>
  );
}
