"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { ListView } from "@/components/admin/appointments/ListView";
import { MonthView } from "@/components/admin/appointments/MonthView";
import { WeekView } from "@/components/admin/appointments/WeekView";
import { DayView } from "@/components/admin/appointments/DayView";
import { RescheduleModal } from "@/components/admin/appointments/RescheduleModal";
import type { AdminAppointment } from "@/components/admin/appointments/types";

const TABS = ["list", "day", "week", "month"] as const;
type Tab = (typeof TABS)[number];

export function AppointmentsManager() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("list");
  const [cursor, setCursor] = useState(new Date());
  const [rescheduling, setRescheduling] = useState<AdminAppointment | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/appointments");
    const data = await res.json();
    setAppointments(data.appointments || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: status as AdminAppointment["status"] } : a)));
    await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function reschedule(date: string, startTime: string) {
    if (!rescheduling) return;
    await fetch(`/api/admin/appointments/${rescheduling.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, startTime }),
    });
    setRescheduling(null);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-chrome-gradient">
          Appointments
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 rounded-full border border-border-dim p-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-full px-4 py-1.5 font-heading text-xs font-semibold uppercase tracking-wide transition-colors",
                  tab === t ? "bg-chrome/15 text-chrome" : "text-white/50 hover:text-white"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <Button href="/api/admin/appointments/export" variant="secondary" size="sm">
            Export CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-white/40">Loading appointments…</p>
      ) : (
        <>
          {tab === "list" && (
            <ListView appointments={appointments} onStatusChange={updateStatus} onReschedule={setRescheduling} />
          )}
          {tab === "day" && (
            <DayView
              date={cursor}
              onDateChange={setCursor}
              appointments={appointments}
              onStatusChange={updateStatus}
              onReschedule={setRescheduling}
            />
          )}
          {tab === "week" && (
            <WeekView
              weekStart={cursor}
              onWeekChange={setCursor}
              appointments={appointments}
              onSelectAppointment={setRescheduling}
            />
          )}
          {tab === "month" && (
            <MonthView
              month={cursor}
              onMonthChange={setCursor}
              appointments={appointments}
              onSelectDate={(date) => {
                setCursor(date);
                setTab("day");
              }}
            />
          )}
        </>
      )}

      <RescheduleModal appointment={rescheduling} onClose={() => setRescheduling(null)} onSave={reschedule} />
    </div>
  );
}
