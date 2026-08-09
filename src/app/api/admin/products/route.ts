import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Tidak diizinkan (Unauthorized)" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, price, spiceLevel, categoryId, isAvailable, imageUrl } = body;

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json({ message: "Semua kolom wajib diisi" }, { status: 400 });
    }

    // Generate slug
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const userId = (session.user as any).id;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Number(price),
        spiceLevel: spiceLevel || "Original",
        isAvailable: isAvailable ?? true,
        categoryId,
        createdById: userId,
        images: imageUrl
          ? {
              create: [
                {
                  url: imageUrl,
                  altText: name,
                  sortOrder: 0,
                },
              ],
            }
          : undefined,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("API error POST product:", error);
    return NextResponse.json({ message: "Gagal menambahkan produk" }, { status: 500 });
  }
}
