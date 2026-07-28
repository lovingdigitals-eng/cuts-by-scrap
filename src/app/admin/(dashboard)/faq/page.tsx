import type { Metadata } from "next";
import { FaqManager } from "@/components/admin/faq/FaqManager";

export const metadata: Metadata = { title: "FAQ", robots: { index: false, follow: false } };

export default function AdminFaqPage() {
  return <FaqManager />;
}
