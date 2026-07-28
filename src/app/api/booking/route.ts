import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validation";
import { getAvailableSlots, addMinutesToTime } from "@/lib/availability";
import { notify } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { serviceId, date, startTime, customerName, phone, email, notes } = parsed.data;

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.active) {
    return NextResponse.json({ error: "That service isn't available." }, { status: 400 });
  }

  const { slots, reason } = await getAvailableSlots(date, serviceId);
  if (!slots.includes(startTime)) {
    return NextResponse.json(
      { error: reason || "That time is no longer available. Please pick another slot." },
      { status: 409 }
    );
  }

  const endTime = addMinutesToTime(date, startTime, service.duration);

  const appointment = await prisma.appointment.create({
    data: {
      serviceId,
      customerName,
      phone,
      email: email || null,
      notes: notes || null,
      date,
      startTime,
      endTime,
      status: "PENDING",
    },
  });

  await notify("BOOKING_RECEIVED", {
    customerName,
    phone,
    email,
    serviceName: service.name,
    date,
    startTime,
  });

  return NextResponse.json({ appointment }, { status: 201 });
}
