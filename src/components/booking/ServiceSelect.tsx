"use client";

import { cn } from "@/lib/cn";
import type { ServiceCardData } from "@/components/services/ServiceCard";

export function ServiceSelect({
  services,
  value,
  onChange,
}: {
  services: ServiceCardData[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {services.map((service) => {
        const selected = value === service.id;
        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onChange(service.id)}
            className={cn(
              "glass rounded-2xl p-5 text-left transition-all",
              selected
                ? "border-chrome shadow-[0_0_24px_rgba(192,192,192,0.35)]"
                : "hover:border-chrome/40"
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-heading text-base font-bold uppercase tracking-wide text-white">
                {service.name}
              </span>
              <span className="font-heading text-base font-bold text-chrome-gradient">
                ${service.price % 1 === 0 ? service.price : service.price.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/40">
              {service.duration} min
            </p>
            <p className="mt-2 text-sm text-white/60">{service.description}</p>
          </button>
        );
      })}
    </div>
  );
}
