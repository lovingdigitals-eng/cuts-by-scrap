import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/admin/StatCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Admin Overview", robots: { index: false, follow: false } };

const STATUS_TONE: Record<string, "default" | "success" | "warning" | "danger" | "muted"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  COMPLETED: "muted",
  CANCELLED: "danger",
  NO_SHOW: "danger",
};

export default async function AdminOverviewPage() {
  const today = format(new Date(), "yyyy-MM-dd");
  const monthPrefix = format(new Date(), "yyyy-MM");

  const [total, pending, todayCount, appointments] = await Promise.all([
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.appointment.count({ where: { date: today } }),
    prisma.appointment.findMany({ include: { service: true } }),
  ]);

  const monthRevenue = appointments
    .filter((a) => a.status === "COMPLETED" && a.date.startsWith(monthPrefix))
    .reduce((sum, a) => sum + a.service.price, 0);

  const upcoming = appointments
    .filter((a) => (a.status === "PENDING" || a.status === "CONFIRMED") && a.date >= today)
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
    .slice(0, 8);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-chrome-gradient">
        Overview
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Appointments" value={total} />
        <StatCard label="Pending Approval" value={pending} />
        <StatCard label="Today" value={todayCount} />
        <StatCard label="This Month's Revenue" value={`$${monthRevenue.toFixed(2)}`} sub="Completed appointments only" />
      </div>

      <GlassCard className="mt-8 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
            Upcoming Appointments
          </h2>
          <Link href="/admin/appointments" className="text-xs font-semibold uppercase tracking-wide text-chrome hover:underline">
            View All
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <p className="mt-4 text-sm text-white/40">No upcoming appointments.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-dim text-xs uppercase tracking-wide text-white/40">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Time</th>
                  <th className="py-2 pr-4">Client</th>
                  <th className="py-2 pr-4">Service</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((a) => (
                  <tr key={a.id} className="border-b border-border-dim/60">
                    <td className="py-3 pr-4 text-white/70">{a.date}</td>
                    <td className="py-3 pr-4 text-white/70">{a.startTime}</td>
                    <td className="py-3 pr-4 text-white">{a.customerName}</td>
                    <td className="py-3 pr-4 text-white/70">{a.service.name}</td>
                    <td className="py-3 pr-4">
                      <Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
