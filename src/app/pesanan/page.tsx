import MobileAppShell from "@/components/MobileAppShell";
import { prisma } from "@/lib/prisma";
import OrderHistoryView from "@/components/OrderHistoryView";

export const revalidate = 60;

export default async function PesananPage() {
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
      <div className="bg-[#FFF9E6] px-4 py-2 text-center border-b border-[var(--color-muted)]/10">
        <span className="text-[14px] font-bold text-[var(--color-charcoal)]">Riwayat Pesanan</span>
      </div>

      <OrderHistoryView waNumber={waNumber} />
    </MobileAppShell>
  );
}
