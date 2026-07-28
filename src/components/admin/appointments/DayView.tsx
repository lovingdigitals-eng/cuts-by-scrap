"use client";

import { addDays, format } from "date-fns";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusSelect } from "@/components/admin/appointments/StatusSelect";
import type { AdminAppointment } from "@/components/admin/appointments/types";

export function DayView({
  date,
  onDateChange,
  appointments,
  onStatusChange,
  onReschedule,
}: {
  date: Date;
  onDateChange: (date: Date) => void;
  appointments: AdminAppointment[];
  onStatusChange: (id: string, status: string) => void;
  onReschedule: (appointment: AdminAppointment) => void;
}) {
  const key = format(date, "yyyy-MM-dd");
  const dayAppointments = appointments
    .filter((a) => a.date === key)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
          {format(date, "EEEE, MMMM d, yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => onDateChange(addDays(date, -1))}>
            Prev
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onDateChange(new Date())}>
            Today
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onDateChange(addDays(date, 1))}>
            Next
          </Button>
        </div>
      </div>

      {dayAppointments.length === 0 ? (
        <p className="text-sm text-white/40">No appointments on this day.</p>
      ) : (
        <div className="space-y-3">
          {dayAppointments.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border-dim p-4"
            >
              <div>
                <p className="font-heading text-sm font-semibold text-white">
                  {a.startTime} – {a.endTime} · {a.customerName}
                </p>
                <p className="text-xs text-white/50">
                  {a.service.name} · {a.phone}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusSelect value={a.status} onChange={(status) => onStatusChange(a.id, status)} />
                <button
                  onClick={() => onReschedule(a)}
                  className="text-xs font-semibold uppercase tracking-wide text-chrome hover:underline"
                >
                  Reschedule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
