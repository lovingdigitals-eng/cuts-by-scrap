import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

async function saveToPublicDir(file: File, dir: string) {
  const absDir = path.join(process.cwd(), "public", dir);
  await mkdir(absDir, { recursive: true });
  const ext = EXT_BY_MIME[file.type] || "jpg";
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(absDir, filename), buffer);
  return `/${dir}/${filename}`;
}

export async function saveImage(file: File, kind: "portfolio" | "reviews" | "site") {
  return saveToPublicDir(file, kind === "portfolio" ? "portfolio" : kind === "reviews" ? "reviews" : "uploads");
}

export async function deletePublicFile(url: string) {
  if (!url.startsWith("/portfolio/") && !url.startsWith("/reviews/") && !url.startsWith("/uploads/")) {
    return;
  }
  const filePath = path.join(process.cwd(), "public", url);
  try {
    await unlink(filePath);
  } catch {
    // file already gone — nothing to do
  }
}
