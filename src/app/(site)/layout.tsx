import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { hairSalonJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, hours] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    prisma.businessHours.findMany({ orderBy: { dayOfWeek: "asc" } }),
  ]);

  const logoUrl = settings?.logoUrl || "/logo.png";
  const bookingEnabled = (settings?.bookingEnabled ?? true) && !(settings?.vacationMode ?? false);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const jsonLd = hairSalonJsonLd({
    name: "Cuts by Scrap",
    url: siteUrl,
    phone: settings?.contactPhone,
    email: settings?.contactEmail,
    address: settings?.address,
    image: `${siteUrl}${logoUrl}`,
    description: settings?.heroSubheadline,
  });

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar logoUrl={logoUrl} bookingEnabled={bookingEnabled} />
      <main className="flex-1">{children}</main>
      <Footer
        settings={{
          logoUrl,
          contactPhone: settings?.contactPhone || "",
          instagram: settings?.instagram || "",
          facebook: settings?.facebook || "",
          tiktok: settings?.tiktok || "",
        }}
        hours={hours}
      />
    </>
  );
}
