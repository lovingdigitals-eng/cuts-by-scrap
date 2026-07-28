import type { Metadata } from "next";
import { ReviewsManager } from "@/components/admin/reviews/ReviewsManager";

export const metadata: Metadata = { title: "Reviews", robots: { index: false, follow: false } };

export default function AdminReviewsPage() {
  return <ReviewsManager />;
}
