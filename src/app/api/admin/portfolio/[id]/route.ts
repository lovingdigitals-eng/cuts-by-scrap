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

  const { category, caption, featured, order } = body;
  const image = await prisma.portfolioImage.update({
    where: { id },
    data: {
      ...(category !== undefined && { category }),
      ...(caption !== undefined && { caption }),
      ...(featured !== undefined && { featured }),
      ...(order !== undefined && { order }),
    },
  });
  return NextResponse.json({ image });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const image = await prisma.portfolioImage.delete({ where: { id } });
  await deletePublicFile(image.url);
  if (image.beforeUrl) await deletePublicFile(image.beforeUrl);
  return NextResponse.json({ ok: true });
}
