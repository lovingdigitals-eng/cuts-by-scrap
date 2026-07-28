import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blockedDateSchema } from "@/lib/validation";

export async function GET() {
  const blockedDates = await prisma.blockedDate.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json({ blockedDates });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = blockedDateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const blockedDate = await prisma.blockedDate.upsert({
    where: { date: parsed.data.date },
    update: parsed.data,
    create: parsed.data,
  });
  return NextResponse.json({ blockedDate }, { status: 201 });
}
