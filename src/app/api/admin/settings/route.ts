import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { siteSettingsSchema } from "@/lib/validation";

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return NextResponse.json({ settings });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const settings = await prisma.siteSettings.update({
    where: { id: "singleton" },
    data: parsed.data,
  });
  return NextResponse.json({ settings });
}
