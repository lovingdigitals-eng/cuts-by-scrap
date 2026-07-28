import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { businessHoursSchema } from "@/lib/validation";
import { z } from "zod";

export async function GET() {
  const hours = await prisma.businessHours.findMany({ orderBy: { dayOfWeek: "asc" } });
  return NextResponse.json({ hours });
}

const bulkSchema = z.object({ hours: z.array(businessHoursSchema) });

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = bulkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const results = await Promise.all(
    parsed.data.hours.map((h) =>
      prisma.businessHours.upsert({
        where: { dayOfWeek: h.dayOfWeek },
        update: h,
        create: h,
      })
    )
  );

  return NextResponse.json({ hours: results });
}
