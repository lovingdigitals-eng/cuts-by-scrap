import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/services/ServiceCard";
import { GlassCard } from "@/components/ui/GlassCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description: "Haircut pricing and services from Cuts by Scrap — fades, tapers, beard trims, and more.",
};

const PAYMENT_METHODS = ["Cash", "Cash App", "Zelle"];

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <Section className="pt-16">
      <SectionHeading
        eyebrow="Services"
        title="Menu & Pricing"
        subtitle="Every price includes the same standard — clean lines, sharp fades, no shortcuts."
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <Reveal key={service.id} delay={i * 0.06}>
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className="mt-14">
        <GlassCard className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
              Payment Methods
            </h3>
            <p className="mt-1 text-sm text-white/60">No online payments — pay in person after your cut.</p>
          </div>
          <div className="flex gap-3">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="rounded-full border border-chrome/30 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80"
              >
                {method}
              </span>
            ))}
          </div>
        </GlassCard>
      </Reveal>
    </Section>
  );
}
