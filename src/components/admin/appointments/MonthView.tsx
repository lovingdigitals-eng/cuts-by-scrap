"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { cn } from "@/lib/cn";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import type { AdminAppointment } from "@/components/admin/appointments/types";

export function MonthView({
  month,
  onMonthChange,
  appointments,
  onSelectDate,
}: {
  month: Date;
  onMonthChange: (date: Date) => void;
  appointments: AdminAppointment[];
  onSelectDate: (date: Date) => void;
}) {
  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));
  const days = eachDayOfInterval({ start, end });

  const byDate = new Map<string, AdminAppointment[]>();
  for (const a of appointments) {
    byDate.set(a.date, [...(byDate.get(a.date) || []), a]);
  }

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
          {format(month, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          >
            Prev
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onMonthChange(new Date())}>
            Today
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-white/40">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayAppointments = byDate.get(key) || [];
          const inMonth = isSameMonth(day, month);
          const today = isSameDay(day, new Date());

          return (
            <button
              key={key}
              onClick={() => onSelectDate(day)}
              className={cn(
                "flex h-20 flex-col items-start rounded-lg border p-2 text-left transition-colors",
                inMonth ? "border-border-dim hover:border-chrome/40" : "border-border-dim/30 opacity-40",
                today && "border-chrome"
              )}
            >
              <span className="text-xs text-white/60">{format(day, "d")}</span>
              {dayAppointments.length > 0 && (
                <span className="mt-1 rounded-full border border-chrome/40 bg-chrome/10 px-2 py-0.5 text-[10px] font-semibold text-chrome">
                  {dayAppointments.length}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}
