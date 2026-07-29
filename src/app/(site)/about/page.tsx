import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the college student barber behind Cuts by Scrap — professional fades, clean cuts, and quality over quantity.",
};

const HIGHLIGHTS = [
  { title: "College Student Barber", body: "Balancing school and the chair — every appointment matters." },
  { title: "Passionate About The Craft", body: "Constantly sharpening technique on fades, tapers, and lineups." },
  { title: "Professional Fades", body: "Clean blends and sharp lines, every single time." },
  { title: "Quality Over Quantity", body: "Fewer clients per day, more attention on each cut." },
  { title: "Flexible Scheduling", body: "Built around a student's schedule — evenings and weekends open up fast." },
  { title: "Growing One Client At A Time", body: "Every new client is a chance to build something real." },
];

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  return (
    <>
      <Section className="pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-border-dim shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <Image
                src={settings?.aboutPhotoUrl || "/about-portrait.jpg"}
                alt="Scrap, barber behind Cuts by Scrap"
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <SectionHeading eyebrow="About" title="Meet Scrap" align="left" />
            <p className="whitespace-pre-line text-base leading-relaxed text-white/70 sm:text-lg">
              {settings?.aboutText}
            </p>
            <div className="mt-8">
              <Button href="/book">Book Appointment</Button>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-surface/40">
        <SectionHeading eyebrow="Why Cuts by Scrap" title="The Standard, Every Visit" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HIGHLIGHTS.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.06}>
              <GlassCard className="h-full p-6">
                <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
                  {h.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{h.body}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
