import MobileAppShell from "@/components/MobileAppShell";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { MessageSquare, MapPin, Clock } from "lucide-react";
import { InstagramIcon } from "@/components/InstagramIcon";

export const revalidate = 60;

export default async function KontakPage() {
  let waNumber = "6288267018426";
  let address = "Pangkalpinang, Kepulauan Bangka Belitung";
  let hours = "Senin - Sabtu: 08.00 - 17.00 WIB";
  let ig = "stikkeju.bongiri_";

  try {
    const settings = await prisma.businessSetting.findUnique({
      where: { id: "default" },
    });
    if (settings) {
      if (settings.whatsappNumber) waNumber = settings.whatsappNumber;
      if (settings.address) address = settings.address;
      if (settings.openingHours) hours = settings.openingHours;
      if (settings.instagramHandle) ig = settings.instagramHandle;
    }
  } catch (error) {
    console.warn("DB connection pending or unreachable in KontakPage, using defaults.", error);
  }

  return (
    <MobileAppShell>
      {/* Tab Title */}
      <div className="bg-[#FFF9E6] px-4 py-2 text-center border-b border-[var(--color-muted)]/10">
        <span className="text-[14px] font-bold text-[var(--color-charcoal)]">Kontak</span>
      </div>

      <div className="flex flex-col bg-[#FFF9E6] min-h-screen pb-32">
        {/* Header Image */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9]">
          <Image
            src="/images/products/original.webp"
            alt="Kontak Bon Giri"
            fill
            sizes="(max-width: 480px) 100vw, 480px"
            className="object-cover"
          />
        </div>

        {/* Content Area */}
        <div className="px-5 pt-8">
          <h1 className="font-display text-[26px] font-bold text-[var(--color-charcoal)] mb-2">
            Kunjungi Kami
          </h1>
          <p className="text-[14px] text-[var(--color-charcoal-soft)] leading-relaxed mb-8">
            Punya pertanyaan mengenai pesanan, reseller, atau paket khusus? Hubungi tim Bon Giri secara langsung.
          </p>

          {/* Info Cards */}
          <div className="space-y-4">
            {/* Alamat */}
            <div className="bg-white p-4 rounded-[16px] shadow-sm border border-[var(--color-muted)]/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E8F3FB] flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-[#005B96]" />
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-[var(--color-charcoal)] mb-0.5">Alamat Produksi</h3>
                <p className="text-[12px] text-[var(--color-charcoal-soft)] leading-tight">{address}</p>
              </div>
            </div>

            {/* Jam Operasional */}
            <div className="bg-white p-4 rounded-[16px] shadow-sm border border-[var(--color-muted)]/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E8F3FB] flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-[#005B96]" />
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-[var(--color-charcoal)] mb-0.5">Jam Operasional</h3>
                <p className="text-[12px] text-[var(--color-charcoal-soft)] leading-tight">{hours}</p>
              </div>
            </div>

            {/* Instagram */}
            <div className="bg-white p-4 rounded-[16px] shadow-sm border border-[var(--color-muted)]/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E8F3FB] flex items-center justify-center shrink-0">
                <InstagramIcon className="w-6 h-6 text-[#005B96]" />
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-[var(--color-charcoal)] mb-0.5">Instagram</h3>
                <a
                  href={`https://instagram.com/${ig}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-[var(--color-navy)] font-semibold hover:underline"
                >
                  @{ig}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-[72px] w-full max-w-[480px] px-4 pb-4 z-40 bg-gradient-to-t from-[#FFF9E6] via-[#FFF9E6]/80 to-transparent pt-8">
        <a
          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
            "Halo Bon Giri, saya ingin bertanya seputar pemesanan stik keju."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-[15px] py-4 rounded-full flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(18,140,126,0.4)] transition-all"
        >
          <MessageSquare className="w-5 h-5 fill-white" />
          Chat WhatsApp
        </a>
      </div>
    </MobileAppShell>
  );
}
