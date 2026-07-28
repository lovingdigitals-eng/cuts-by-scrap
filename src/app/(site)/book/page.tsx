import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Section, SectionHeading } from "@/components/ui/Section";
import { BookingForm } from "@/components/booking/BookingForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book Appointment",
  description: "Book your next haircut with Cuts by Scrap — pick a service, date, and time.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const [services, settings, sp] = await Promise.all([
    prisma.service.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    searchParams,
  ]);

  if (!settings || !settings.bookingEnabled || settings.vacationMode) {
    return (
      <Section className="pt-16 text-center">
        <SectionHeading eyebrow="Book Appointment" title="Booking Paused" />
        <p className="mx-auto max-w-md text-white/60">
          Online booking isn&rsquo;t available right now. Check back soon, or reach out directly on the
          Contact page.
        </p>
      </Section>
    );
  }

  return (
    <Section className="pt-16">
      <SectionHeading
        eyebrow="Book Appointment"
        title="Lock In Your Cut"
        subtitle="Pick a service, date, and time — you'll get a confirmation once it's approved."
      />
      <BookingForm services={services} initialServiceId={sp.service} />
    </Section>
  );
}
