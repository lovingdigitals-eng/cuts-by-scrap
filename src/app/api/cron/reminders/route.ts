import { NextRequest, NextResponse } from "next/server";
import { format, addDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notifications";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

  const appointments = await prisma.appointment.findMany({
    where: { date: tomorrow, status: "CONFIRMED", reminderSent: false },
    include: { service: true },
  });

  for (const appt of appointments) {
    await notify("BOOKING_REMINDER", {
      customerName: appt.customerName,
      phone: appt.phone,
      email: appt.email,
      serviceName: appt.service.name,
      date: appt.date,
      startTime: appt.startTime,
    });
    await prisma.appointment.update({ where: { id: appt.id }, data: { reminderSent: true } });
  }

  return NextResponse.json({ remindersSent: appointments.length });
}
