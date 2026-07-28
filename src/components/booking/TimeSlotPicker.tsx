"use client";

import { cn } from "@/lib/cn";

export function TimeSlotPicker({
  slots,
  value,
  onChange,
  loading,
  reason,
}: {
  slots: string[];
  value: string | null;
  onChange: (time: string) => void;
  loading: boolean;
  reason?: string;
}) {
  function formatTime(t: string) {
    const [h, m] = t.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
  }

  if (loading) {
    return <p className="text-sm text-white/50">Checking availability…</p>;
  }

  if (slots.length === 0) {
    return (
      <p className="text-sm text-white/50">
        {reason || "No open times for that day — try another date."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {slots.map((slot) => (
        <button
          key={slot}
          type="button"
          onClick={() => onChange(slot)}
          className={cn(
            "rounded-xl border px-3 py-3 text-sm font-semibold transition-colors",
            value === slot
              ? "border-chrome bg-chrome/15 text-chrome"
              : "border-border-dim text-white/70 hover:border-chrome/40"
          )}
        >
          {formatTime(slot)}
        </button>
      ))}
    </div>
  );
}
