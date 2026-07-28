import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { APPOINTMENT_STATUSES } from "@/lib/validation";
import { addMinutesToTime } from "@/lib/availability";
import { notify } from "@/lib/notifications";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body." }, { status: 400 });

  const existing = await prisma.appointment.findUnique({ where: { id }, include: { service: true } });
  if (!existing) return NextResponse.json({ error: "Appointment not found." }, { status: 404 });

  const data: {
    status?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
  } = {};

  if (body.status !== undefined) {
    if (!APPOINTMENT_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    data.status = body.status;
  }

  if (body.date !== undefined && body.startTime !== undefined) {
    data.date = body.date;
    data.startTime = body.startTime;
    data.endTime = addMinutesToTime(body.date, body.startTime, existing.service.duration);
  }

  const appointment = await prisma.appointment.update({ where: { id }, data, include: { service: true } });

  if (data.status === "CONFIRMED" || data.status === "CANCELLED") {
    await notify(data.status === "CONFIRMED" ? "BOOKING_CONFIRMED" : "BOOKING_CANCELLED", {
      customerName: appointment.customerName,
      phone: appointment.phone,
      email: appointment.email,
      serviceName: appointment.service.name,
      date: appointment.date,
      startTime: appointment.startTime,
    });
  }

  return NextResponse.json({ appointment });
}
