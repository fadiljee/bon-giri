import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    const ext = file?.name?.split(".").pop() || "png";
    const filename = `proof-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

    if (file) {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });
        await writeFile(path.join(uploadsDir, filename), buffer);
        return NextResponse.json({ success: true, url: `/uploads/${filename}` });
      } catch (fsError) {
        console.warn("Filesystem upload unavailable, using dummy proof URL:", fsError);
      }
    }

    return NextResponse.json({
      success: true,
      url: `/uploads/dummy-${filename}`,
      dummy: true,
    });
  } catch (error) {
    console.warn("Upload fallback triggered:", error);
    return NextResponse.json({
      success: true,
      url: `/uploads/dummy-proof-${Date.now()}.png`,
      dummy: true,
    });
  }
}
