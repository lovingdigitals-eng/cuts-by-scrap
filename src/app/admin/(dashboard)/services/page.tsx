import type { Metadata } from "next";
import { ServicesManager } from "@/components/admin/services/ServicesManager";

export const metadata: Metadata = { title: "Services", robots: { index: false, follow: false } };

export default function AdminServicesPage() {
  return <ServicesManager />;
}
