import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deletePublicFile } from "@/lib/upload";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body." }, { status: 400 });

  const { name, text, rating, featured, approved, date } = body;
  const review = await prisma.review.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(text !== undefined && { text }),
      ...(rating !== undefined && { rating }),
      ...(featured !== undefined && { featured }),
      ...(approved !== undefined && { approved }),
      ...(date !== undefined && { date: new Date(date) }),
    },
  });
  return NextResponse.json({ review });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const review = await prisma.review.delete({ where: { id } });
  if (review.avatarUrl) await deletePublicFile(review.avatarUrl);
  return NextResponse.json({ ok: true });
}
