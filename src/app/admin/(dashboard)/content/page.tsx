import type { Metadata } from "next";
import { ContentManager } from "@/components/admin/content/ContentManager";

export const metadata: Metadata = { title: "Site Content", robots: { index: false, follow: false } };

export default function AdminContentPage() {
  return <ContentManager />;
}
