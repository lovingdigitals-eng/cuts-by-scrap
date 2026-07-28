"use client";

import { startOfWeek, addDays, format, isSameDay } from "date-fns";
import { cn } from "@/lib/cn";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { AppointmentChip } from "@/components/admin/appointments/AppointmentChip";
import type { AdminAppointment } from "@/components/admin/appointments/types";

export function WeekView({
  weekStart,
  onWeekChange,
  appointments,
  onSelectAppointment,
}: {
  weekStart: Date;
  onWeekChange: (date: Date) => void;
  appointments: AdminAppointment[];
  onSelectAppointment: (appointment: AdminAppointment) => void;
}) {
  const start = startOfWeek(weekStart);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
          Week of {format(start, "MMM d, yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => onWeekChange(addDays(start, -7))}>
            Prev
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onWeekChange(new Date())}>
            Today
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onWeekChange(addDays(start, 7))}>
            Next
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayAppointments = appointments
            .filter((a) => a.date === key)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
          const today = isSameDay(day, new Date());

          return (
            <div
              key={key}
              className={cn(
                "min-h-[140px] rounded-lg border border-border-dim p-2",
                today && "border-chrome/50"
              )}
            >
              <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-white/50">
                {format(day, "EEE d")}
              </p>
              <div className="space-y-1.5">
                {dayAppointments.map((a) => (
                  <AppointmentChip key={a.id} appointment={a} onClick={() => onSelectAppointment(a)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
