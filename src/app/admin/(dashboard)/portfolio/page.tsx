import type { Metadata } from "next";
import { PortfolioManager } from "@/components/admin/portfolio/PortfolioManager";

export const metadata: Metadata = { title: "Portfolio", robots: { index: false, follow: false } };

export default function AdminPortfolioPage() {
  return <PortfolioManager />;
}
