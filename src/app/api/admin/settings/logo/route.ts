import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveImage } from "@/lib/upload";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "A logo file is required." }, { status: 400 });
  }

  const url = await saveImage(file, "site");
  const settings = await prisma.siteSettings.update({
    where: { id: "singleton" },
    data: { logoUrl: url },
  });

  return NextResponse.json({ settings });
}
