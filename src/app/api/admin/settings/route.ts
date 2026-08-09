import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { whatsappNumber, address, openingHours, instagramHandle } = body;

    const updated = await prisma.businessSetting.upsert({
      where: { id: "default" },
      update: {
        whatsappNumber,
        address,
        openingHours,
        instagramHandle,
      },
      create: {
        id: "default",
        whatsappNumber,
        address,
        openingHours,
        instagramHandle,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Gagal memperbarui pengaturan" }, { status: 500 });
  }
}
