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

    // Extract product IDs to query cost prices if possible
    const productIds = items
      .map((i: any) => i.productId || i.id)
      .filter(Boolean);

    let dbProducts: Record<string, { costPrice: number }> = {};
    if (productIds.length > 0) {
      const foundProducts = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, costPrice: true },
      });
      foundProducts.forEach((p) => {
        dbProducts[p.id] = { costPrice: p.costPrice };
      });
    }

    // Calculate total amount and cost
    let totalAmount = 0;
    let totalCost = 0;

    const preparedItems = items.map((item: any) => {
      const pId = item.productId || item.id || null;
      const cost = pId && dbProducts[pId] ? dbProducts[pId].costPrice : 0;
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
