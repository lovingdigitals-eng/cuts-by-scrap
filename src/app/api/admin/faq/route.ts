import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { faqSchema } from "@/lib/validation";

export async function GET() {
  const faqs = await prisma.faqItem.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ faqs });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = faqSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const faq = await prisma.faqItem.create({ data: parsed.data });
  return NextResponse.json({ faq }, { status: 201 });
}
