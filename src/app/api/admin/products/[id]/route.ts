import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: RouteProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: { isAvailable: body.isAvailable },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Gagal memperbarui status" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: RouteProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { name, description, price, spiceLevel, categoryId, isAvailable, imageUrl } = body;

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: Number(price),
        spiceLevel,
        categoryId,
        isAvailable,
      },
    });

    if (imageUrl) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.create({
        data: {
          productId: id,
          url: imageUrl,
          altText: name,
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Gagal memperbarui produk" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as any)?.role;
  if (role !== "ADMIN") {
    return NextResponse.json(
      { message: "Hanya Admin yang berhak menghapus produk secara permanen." },
      { status: 403 }
    );
  }

  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ message: "Gagal menghapus produk" }, { status: 500 });
  }
}
