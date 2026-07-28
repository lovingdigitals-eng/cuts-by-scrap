import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveImage } from "@/lib/upload";

export async function GET() {
  const reviews = await prisma.review.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json({ reviews });
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const name = String(form.get("name") || "").trim();
  const text = String(form.get("text") || "").trim();
  const rating = Number(form.get("rating") || 5);
  const dateStr = form.get("date");
  const featured = form.get("featured") === "true";
  const approved = form.get("approved") !== "false";
  const avatarFile = form.get("avatarFile");

  if (!name || !text || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Name, text, and a 1-5 rating are required." }, { status: 400 });
  }

  const avatarUrl =
    avatarFile instanceof File && avatarFile.size > 0 ? await saveImage(avatarFile, "reviews") : null;

  const review = await prisma.review.create({
    data: {
      name,
      text,
      rating,
      avatarUrl,
      featured,
      approved,
      date: dateStr ? new Date(String(dateStr)) : new Date(),
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}
