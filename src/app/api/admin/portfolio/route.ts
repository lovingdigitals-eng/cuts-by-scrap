import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveImage } from "@/lib/upload";
import { PORTFOLIO_CATEGORIES } from "@/lib/validation";

export async function GET() {
  const images = await prisma.portfolioImage.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ images });
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const file = form.get("file");
  const beforeFile = form.get("beforeFile");
  const category = String(form.get("category") || "");
  const caption = form.get("caption");
  const featured = form.get("featured") === "true";

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "A photo file is required." }, { status: 400 });
  }
  if (!PORTFOLIO_CATEGORIES.includes(category as (typeof PORTFOLIO_CATEGORIES)[number])) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }

  const url = await saveImage(file, "portfolio");
  const beforeUrl =
    beforeFile instanceof File && beforeFile.size > 0 ? await saveImage(beforeFile, "portfolio") : null;

  const count = await prisma.portfolioImage.count();
  const image = await prisma.portfolioImage.create({
    data: {
      url,
      beforeUrl,
      category,
      caption: caption ? String(caption) : null,
      featured,
      order: count,
    },
  });

  return NextResponse.json({ image }, { status: 201 });
}
