import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export interface ServiceCardData {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
}

export function ServiceCard({ service, showBook = true }: { service: ServiceCardData; showBook?: boolean }) {
  return (
    <GlassCard className="flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-white">
          {service.name}
        </h3>
        <span className="font-heading whitespace-nowrap text-xl font-bold text-chrome-gradient">
          ${service.price % 1 === 0 ? service.price : service.price.toFixed(2)}
        </span>
      </div>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/40">
        {service.duration} min
      </p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-white/60">{service.description}</p>
      {showBook && (
        <div className="mt-6">
          <Button href={`/book?service=${service.id}`} variant="secondary" size="sm" className="w-full">
            Book This
          </Button>
        </div>
      )}
    </GlassCard>
  );
}
