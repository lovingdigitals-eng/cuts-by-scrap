"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

interface BusinessHour {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  lunchStart?: string | null;
  lunchEnd?: string | null;
}

interface BlockedDate {
  id: string;
  date: string;
  reason?: string | null;
}

interface Settings {
  bookingEnabled: boolean;
  vacationMode: boolean;
  defaultAppointmentDuration: number;
  maxAppointmentsPerDay: number;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function HoursManager() {
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load() {
    const [hoursRes, settingsRes, blockedRes] = await Promise.all([
      fetch("/api/admin/hours").then((r) => r.json()),
      fetch("/api/admin/settings").then((r) => r.json()),
      fetch("/api/admin/blocked-dates").then((r) => r.json()),
    ]);
    setHours(hoursRes.hours || []);
    setSettings(settingsRes.settings);
    setBlockedDates(blockedRes.blockedDates || []);
  }

  useEffect(() => {
    load();
  }, []);

  function updateDay(dayOfWeek: number, data: Partial<BusinessHour>) {
    setHours((prev) => prev.map((h) => (h.dayOfWeek === dayOfWeek ? { ...h, ...data } : h)));
  }

  async function saveAll() {
    setSaving(true);
    setSaved(false);
    await Promise.all([
      fetch("/api/admin/hours", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours }),
      }),
      settings &&
        fetch("/api/admin/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        }),
    ]);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function addBlockedDate() {
    if (!newBlockDate) return;
    await fetch("/api/admin/blocked-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newBlockDate, reason: newBlockReason || undefined }),
    });
    setNewBlockDate("");
    setNewBlockReason("");
    load();
  }

  async function removeBlockedDate(id: string) {
    await fetch(`/api/admin/blocked-dates/${id}`, { method: "DELETE" });
    load();
  }

  if (!settings || hours.length === 0) {
    return <p className="text-sm text-white/40">Loading…</p>;
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-chrome-gradient">
        Hours & Availability
      </h1>

      <GlassCard className="mt-6 p-6">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
          Booking Controls
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={settings.bookingEnabled}
              onChange={(e) => setSettings({ ...settings, bookingEnabled: e.target.checked })}
              className="h-4 w-4 rounded border-border-dim"
            />
            Online booking enabled
          </label>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={settings.vacationMode}
              onChange={(e) => setSettings({ ...settings, vacationMode: e.target.checked })}
              className="h-4 w-4 rounded border-border-dim"
            />
            Vacation mode
          </label>
          <div>
            <Label htmlFor="default-duration">Default Duration (min)</Label>
            <Input
              id="default-duration"
              type="number"
              value={settings.defaultAppointmentDuration}
              onChange={(e) =>
                setSettings({ ...settings, defaultAppointmentDuration: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <Label htmlFor="max-per-day">Max Appointments / Day</Label>
            <Input
              id="max-per-day"
              type="number"
              value={settings.maxAppointmentsPerDay}
              onChange={(e) => setSettings({ ...settings, maxAppointmentsPerDay: Number(e.target.value) })}
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="mt-6 p-6">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
          Weekly Hours
        </h2>
        <div className="mt-4 space-y-3">
          {hours
            .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
            .map((h) => (
              <div
                key={h.dayOfWeek}
                className="grid grid-cols-2 items-center gap-3 rounded-lg border border-border-dim p-3 sm:grid-cols-6"
              >
                <span className="text-sm font-semibold text-white">{DAY_NAMES[h.dayOfWeek]}</span>
                <label className="flex items-center gap-2 text-xs text-white/60">
                  <input
                    type="checkbox"
                    checked={h.isOpen}
                    onChange={(e) => updateDay(h.dayOfWeek, { isOpen: e.target.checked })}
                    className="h-3.5 w-3.5 rounded border-border-dim"
                  />
                  Open
                </label>
                <Input
                  type="time"
                  value={h.openTime}
                  disabled={!h.isOpen}
                  onChange={(e) => updateDay(h.dayOfWeek, { openTime: e.target.value })}
                />
                <Input
                  type="time"
                  value={h.closeTime}
                  disabled={!h.isOpen}
                  onChange={(e) => updateDay(h.dayOfWeek, { closeTime: e.target.value })}
                />
                <Input
                  type="time"
                  placeholder="Lunch start"
                  value={h.lunchStart || ""}
                  disabled={!h.isOpen}
                  onChange={(e) => updateDay(h.dayOfWeek, { lunchStart: e.target.value || null })}
                />
                <Input
                  type="time"
                  placeholder="Lunch end"
                  value={h.lunchEnd || ""}
                  disabled={!h.isOpen}
                  onChange={(e) => updateDay(h.dayOfWeek, { lunchEnd: e.target.value || null })}
                />
              </div>
            ))}
        </div>
      </GlassCard>

      <div className="mt-6 flex items-center gap-4">
        <Button onClick={saveAll} disabled={saving}>
          {saving ? "Saving…" : "Save Hours & Settings"}
        </Button>
        {saved && <span className="text-sm text-emerald-400">Saved.</span>}
      </div>

      <GlassCard className="mt-8 p-6">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
          Blocked Dates
        </h2>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <Label htmlFor="block-date">Date</Label>
            <Input id="block-date" type="date" value={newBlockDate} onChange={(e) => setNewBlockDate(e.target.value)} />
          </div>
          <div className="flex-1">
            <Label htmlFor="block-reason">Reason (optional)</Label>
            <Input
              id="block-reason"
              value={newBlockReason}
              onChange={(e) => setNewBlockReason(e.target.value)}
              placeholder="Vacation, holiday, etc."
            />
          </div>
          <Button onClick={addBlockedDate} disabled={!newBlockDate}>
            Block Date
          </Button>
        </div>

        {blockedDates.length > 0 && (
          <ul className="mt-5 space-y-2">
            {blockedDates.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between rounded-lg border border-border-dim px-4 py-2 text-sm"
              >
                <span className="text-white/70">
                  {b.date} {b.reason && <span className="text-white/40">— {b.reason}</span>}
                </span>
                <button
                  onClick={() => removeBlockedDate(b.id)}
                  className="text-xs font-semibold uppercase tracking-wide text-red-400 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}
