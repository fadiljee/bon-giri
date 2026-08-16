import MobileAppShell from "@/components/MobileAppShell";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import CartView from "@/components/CartView";

export const revalidate = 60;

export default async function CartPage() {
  let waNumber = "6288267018426";
  try {
    const settings = await prisma.businessSetting.findUnique({
      where: { id: "default" },
    });
    if (settings?.whatsappNumber) {
      waNumber = settings.whatsappNumber;
    }
  } catch (e) {
    console.warn("Using default WA number", e);
  }

  return (
    <MobileAppShell>
      {/* Header Bar Title */}
      <div className="bg-[#FFF9E6] px-4 py-2 border-b border-[var(--color-muted)]/10 flex items-center">
        <Link href="/katalog" className="text-[var(--color-charcoal-soft)] hover:text-[var(--color-navy)]">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="flex-1 text-[14px] font-bold text-[var(--color-charcoal)] text-center mr-5">
          Keranjang Belanja
        </span>
      </div>

      <CartView waNumber={waNumber} />
    </MobileAppShell>
  );
}
