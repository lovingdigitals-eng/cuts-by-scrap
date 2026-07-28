"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Select } from "@/components/ui/Input";
import { StatusSelect } from "@/components/admin/appointments/StatusSelect";
import type { AdminAppointment } from "@/components/admin/appointments/types";

export function ListView({
  appointments,
  onStatusChange,
  onReschedule,
}: {
  appointments: AdminAppointment[];
  onStatusChange: (id: string, status: string) => void;
  onReschedule: (appointment: AdminAppointment) => void;
}) {
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered =
    statusFilter === "ALL" ? appointments : appointments.filter((a) => a.status === statusFilter);

  const sorted = [...filtered].sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime));

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
          All Appointments
        </h2>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="max-w-[180px]">
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="NO_SHOW">No Show</option>
        </Select>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-white/40">No appointments match this filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border-dim text-xs uppercase tracking-wide text-white/40">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">Client</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">Service</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((a) => (
                <tr key={a.id} className="border-b border-border-dim/60">
                  <td className="py-3 pr-4 text-white/70">{a.date}</td>
                  <td className="py-3 pr-4 text-white/70">{a.startTime}</td>
                  <td className="py-3 pr-4 text-white">{a.customerName}</td>
                  <td className="py-3 pr-4 text-white/50">{a.phone}</td>
                  <td className="py-3 pr-4 text-white/70">{a.service.name}</td>
                  <td className="py-3 pr-4">
                    <StatusSelect value={a.status} onChange={(status) => onStatusChange(a.id, status)} />
                  </td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => onReschedule(a)}
                      className="text-xs font-semibold uppercase tracking-wide text-chrome hover:underline"
                    >
                      Reschedule
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </GlassCard>
  );
}
