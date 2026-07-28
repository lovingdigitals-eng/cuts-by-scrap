import { addMinutes, format, isBefore, parse } from "date-fns";
import { prisma } from "./prisma";

function parseDateTime(dateStr: string, time: string) {
  return parse(`${dateStr} ${time}`, "yyyy-MM-dd HH:mm", new Date());
}

function todayStr() {
  return format(new Date(), "yyyy-MM-dd");
}

export interface AvailabilityResult {
  slots: string[];
  reason?: string;
}

export async function getAvailableSlots(
  dateStr: string,
  serviceId: string
): Promise<AvailabilityResult> {
  if (dateStr < todayStr()) {
    return { slots: [], reason: "That date has already passed." };
  }

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });
  if (!settings || !settings.bookingEnabled) {
    return { slots: [], reason: "Online booking is currently paused." };
  }
  if (settings.vacationMode) {
    return { slots: [], reason: "Scrap is on a break — check back soon." };
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.active) {
    return { slots: [], reason: "That service isn't available." };
  }

  const blocked = await prisma.blockedDate.findUnique({ where: { date: dateStr } });
  if (blocked) {
    return { slots: [], reason: blocked.reason || "This date is unavailable." };
  }

  const dayOfWeek = parse(dateStr, "yyyy-MM-dd", new Date()).getDay();
  const hours = await prisma.businessHours.findUnique({ where: { dayOfWeek } });
  if (!hours || !hours.isOpen) {
    return { slots: [], reason: "Closed on this day." };
  }

  const existing = await prisma.appointment.findMany({
    where: { date: dateStr, status: { in: ["PENDING", "CONFIRMED"] } },
  });

  if (existing.length >= settings.maxAppointmentsPerDay) {
    return { slots: [], reason: "Fully booked for this day." };
  }

  const duration = service.duration;
  const close = parseDateTime(dateStr, hours.closeTime);
  const lunchStart = hours.lunchStart ? parseDateTime(dateStr, hours.lunchStart) : null;
  const lunchEnd = hours.lunchEnd ? parseDateTime(dateStr, hours.lunchEnd) : null;
  const now = new Date();
  const isToday = dateStr === todayStr();

  const existingRanges = existing.map((appt) => ({
    start: parseDateTime(dateStr, appt.startTime),
    end: parseDateTime(dateStr, appt.endTime),
  }));

  const slots: string[] = [];
  let cursor = parseDateTime(dateStr, hours.openTime);

  while (addMinutes(cursor, duration).getTime() <= close.getTime()) {
    const slotEnd = addMinutes(cursor, duration);
    const overlapsLunch =
      !!lunchStart && !!lunchEnd && cursor < lunchEnd && slotEnd > lunchStart;
    const overlapsExisting = existingRanges.some(
      (r) => cursor < r.end && slotEnd > r.start
    );
    const isPast = isToday && isBefore(cursor, now);

    if (!overlapsLunch && !overlapsExisting && !isPast) {
      slots.push(format(cursor, "HH:mm"));
    }
    cursor = addMinutes(cursor, duration);
  }

  return { slots };
}

export function addMinutesToTime(dateStr: string, time: string, minutes: number) {
  return format(addMinutes(parseDateTime(dateStr, time), minutes), "HH:mm");
}
