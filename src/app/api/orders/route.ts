import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerAddress,
      paymentMethod,
      proofUrl,
      items,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Pesanan tidak boleh kosong" },
        { status: 400 }
      );
    }

    // Extract product IDs to query cost prices and verify foreign keys
    const productIds = items
      .map((i: { productId?: string; id?: string }) => i.productId || i.id)
      .filter(Boolean) as string[];

    const dbProducts: Record<string, { id: string; costPrice: number }> = {};
    if (productIds.length > 0) {
      const foundProducts = await prisma.product.findMany({
        where: {
          OR: [
            { id: { in: productIds } },
            { slug: { in: productIds } },
          ],
        },
        select: { id: true, slug: true, costPrice: true },
      });
      foundProducts.forEach((p) => {
        dbProducts[p.id] = { id: p.id, costPrice: p.costPrice };
        dbProducts[p.slug] = { id: p.id, costPrice: p.costPrice };
      });
    }

    // Calculate total amount and cost
    let totalAmount = 0;
    let totalCost = 0;

    const preparedItems = items.map((item: { productId?: string; id?: string; name?: string; productName?: string; price: number; quantity: number }) => {
      const rawId = item.productId || item.id || "";
      const matched = rawId ? dbProducts[rawId] : undefined;
      const pId = matched ? matched.id : null;
      const cost = matched ? matched.costPrice : 0;
      const subtotal = item.price * item.quantity;
      
      totalAmount += subtotal;
      totalCost += cost * item.quantity;

      return {
        productId: pId,
        productName: item.name || item.productName || "Stik Keju Bon Giri",
        price: item.price,
        costPrice: cost,
        quantity: item.quantity,
        subtotal,
      };
    });

    const timestamp = Date.now().toString().slice(-6);
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-${timestamp}-${randomDigits}`;

    const formattedMethod = (paymentMethod || "").toUpperCase() === "COD" ? "COD" : "QRIS";
    const status = formattedMethod === "COD" ? "PENDING_COD" : "PENDING_PAYMENT";
    const notesText = `Alamat: ${customerAddress || "-"}${proofUrl ? ` | Bukti Transfer: ${proofUrl}` : ""}`;

    const transaction = await prisma.salesTransaction.create({
      data: {
        invoiceNumber,
        customerName: customerName || "Pembeli Web",
        customerPhone: customerPhone || null,
        totalAmount,
        totalCost,
        grossProfit: totalAmount - totalCost,
        paymentMethod: formattedMethod,
        status,
        notes: notesText,
        items: {
          create: preparedItems,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      invoiceNumber: transaction.invoiceNumber,
      transaction,
    });
  } catch (error) {
    console.error("Error saving order to database:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan pesanan ke database." },
      { status: 500 }
    );
  }
}
