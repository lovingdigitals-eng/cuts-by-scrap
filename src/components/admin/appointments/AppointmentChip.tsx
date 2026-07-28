import { cn } from "@/lib/cn";
import type { AdminAppointment } from "@/components/admin/appointments/types";

const STATUS_COLOR: Record<string, string> = {
  PENDING: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  CONFIRMED: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  COMPLETED: "border-white/20 bg-white/5 text-white/50",
  CANCELLED: "border-red-500/40 bg-red-500/10 text-red-300",
  NO_SHOW: "border-red-500/40 bg-red-500/10 text-red-300",
};

export function AppointmentChip({
  appointment,
  onClick,
}: {
  appointment: AdminAppointment;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border px-2 py-1.5 text-left text-xs transition-transform hover:-translate-y-0.5",
        STATUS_COLOR[appointment.status]
      )}
    >
      <span className="font-semibold">{appointment.startTime}</span> {appointment.customerName}
      <span className="block truncate text-[10px] opacity-70">{appointment.service.name}</span>
    </button>
  );
}
