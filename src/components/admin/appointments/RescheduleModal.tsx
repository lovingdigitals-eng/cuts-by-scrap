"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { AdminAppointment } from "@/components/admin/appointments/types";

export function RescheduleModal({
  appointment,
  onClose,
  onSave,
}: {
  appointment: AdminAppointment | null;
  onClose: () => void;
  onSave: (date: string, startTime: string) => Promise<void>;
}) {
  const [date, setDate] = useState(appointment?.date || "");
  const [time, setTime] = useState(appointment?.startTime || "");
  const [saving, setSaving] = useState(false);

  if (appointment && date !== appointment.date && !date) setDate(appointment.date);

  async function save() {
    setSaving(true);
    await onSave(date, time);
    setSaving(false);
  }

  return (
    <Modal open={!!appointment} onClose={onClose} className="max-w-sm">
      {appointment && (
        <div>
          <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
            Reschedule
          </h3>
          <p className="mt-1 text-sm text-white/50">{appointment.customerName} — {appointment.service.name}</p>
          <div className="mt-5 space-y-4">
            <div>
              <Label htmlFor="reschedule-date">Date</Label>
              <Input
                id="reschedule-date"
                type="date"
                defaultValue={appointment.date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="reschedule-time">Start Time</Label>
              <Input
                id="reschedule-time"
                type="time"
                defaultValue={appointment.startTime}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving || !date || !time}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
