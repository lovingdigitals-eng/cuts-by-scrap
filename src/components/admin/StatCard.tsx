import { GlassCard } from "@/components/ui/GlassCard";

export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <GlassCard className="p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-2 font-heading text-3xl font-bold text-chrome-gradient">{value}</p>
      {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
    </GlassCard>
  );
}
