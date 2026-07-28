import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toCsv } from "@/lib/csv";

export async function GET() {
  const appointments = await prisma.appointment.findMany({
    include: { service: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  const rows = appointments.map((a) => ({
    date: a.date,
    startTime: a.startTime,
    endTime: a.endTime,
    customerName: a.customerName,
    phone: a.phone,
    email: a.email || "",
    service: a.service.name,
    price: a.service.price,
    status: a.status,
    notes: a.notes || "",
    createdAt: a.createdAt.toISOString(),
  }));

  const csv = toCsv(rows, [
    "date",
    "startTime",
    "endTime",
    "customerName",
    "phone",
    "email",
    "service",
    "price",
    "status",
    "notes",
    "createdAt",
  ]);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="appointments-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
