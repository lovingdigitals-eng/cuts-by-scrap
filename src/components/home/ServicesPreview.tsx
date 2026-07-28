import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCard, type ServiceCardData } from "@/components/services/ServiceCard";
import { Button } from "@/components/ui/Button";

export function ServicesPreview({ services }: { services: ServiceCardData[] }) {
  return (
    <Section id="services" className="bg-surface/40">
      <SectionHeading
        eyebrow="Services"
        title="Precision For Every Style"
        subtitle="Clean fades, sharp lineups, and beard work — every service built around quality over quantity."
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <Reveal key={service.id} delay={i * 0.08}>
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button href="/services" variant="secondary">
          View All Services
        </Button>
      </div>
    </Section>
  );
}
