import type { Metadata } from "next";
import { AppointmentsManager } from "@/components/admin/appointments/AppointmentsManager";

export const metadata: Metadata = { title: "Appointments", robots: { index: false, follow: false } };

export default function AdminAppointmentsPage() {
  return <AppointmentsManager />;
}
