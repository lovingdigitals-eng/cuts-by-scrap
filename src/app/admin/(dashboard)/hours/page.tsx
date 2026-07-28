import type { Metadata } from "next";
import { HoursManager } from "@/components/admin/hours/HoursManager";

export const metadata: Metadata = { title: "Hours & Availability", robots: { index: false, follow: false } };

export default function AdminHoursPage() {
  return <HoursManager />;
}
