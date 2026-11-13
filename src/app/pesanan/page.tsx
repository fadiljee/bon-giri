import { prisma } from "@/lib/prisma";
import OrderHistoryView from "@/components/OrderHistoryView";
import SubpageShell from "@/components/storefront/SubpageShell";
import { BusinessInfo, DEFAULT_BUSINESS_INFO } from "@/data/storefront";

export const revalidate = 60;

export default async function PesananPage() {
  let business: BusinessInfo = DEFAULT_BUSINESS_INFO;
  try {
    const settings = await prisma.businessSetting.findUnique({
      where: { id: "default" },
    });
    if (settings) {
      business = {
        whatsappNumber: settings.whatsappNumber || DEFAULT_BUSINESS_INFO.whatsappNumber,
        address: settings.address || DEFAULT_BUSINESS_INFO.address,
        openingHours: settings.openingHours || DEFAULT_BUSINESS_INFO.openingHours,
        instagramHandle: settings.instagramHandle || DEFAULT_BUSINESS_INFO.instagramHandle,
      };
    }
  } catch (e) {
    console.warn("Using default business info on PesananPage", e);
  }

  return (
    <SubpageShell business={business}>
      <OrderHistoryView waNumber={business.whatsappNumber} />
    </SubpageShell>
  );
}
