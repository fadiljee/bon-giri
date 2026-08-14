import MobileAppShell from "@/components/MobileAppShell";
import Link from "next/link";
import { ReceiptText, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

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

      <div className="flex flex-col bg-[#FFF9E6] min-h-screen pb-24 pt-6 px-4 space-y-5">
        {/* Banner Status */}
        <div className="bg-white p-5 rounded-[16px] border border-[var(--color-muted)]/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#E8F3FB] flex items-center justify-center shrink-0">
            <ReceiptText className="w-6 h-6 text-[#005B96]" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-[var(--color-charcoal)]">Pemesanan WhatsApp & QRIS</h2>
            <p className="text-[12px] text-[var(--color-charcoal-soft)] leading-tight">
              Pesanan diproses langsung oleh admin via WhatsApp DANA Bisnis.
            </p>
          </div>
        </div>

        {/* Steps Guide */}
        <div className="bg-white p-5 rounded-[16px] border border-[var(--color-muted)]/10 shadow-sm space-y-4">
          <h3 className="text-[14px] font-bold text-[var(--color-charcoal)] border-b border-[var(--color-muted)]/10 pb-2">
            Cara Mengecek Status Pesanan
          </h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--color-gold)] text-white text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <p className="text-[13px] text-[var(--color-charcoal-soft)] leading-snug">
                Pilih produk pilihan Anda di menu <strong className="text-[var(--color-charcoal)]">Katalog</strong> lalu tekan <strong className="text-[var(--color-charcoal)]">Pesan</strong>.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--color-gold)] text-white text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <p className="text-[13px] text-[var(--color-charcoal-soft)] leading-snug">
                Lakukan pembayaran via QRIS DANA Bisnis dan konfirmasi ke WhatsApp Admin.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--color-gold)] text-white text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <p className="text-[13px] text-[var(--color-charcoal-soft)] leading-snug">
                Admin akan memverifikasi pembayaran dan mengabari nomor resi/pengiriman stik keju Anda.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Contact */}
        <div className="bg-[#FFFEF3] p-5 rounded-[16px] border border-[var(--color-gold)]/30 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
            <h4 className="text-[14px] font-bold text-[var(--color-charcoal)]">Butuh bantuan pesanan?</h4>
          </div>
          <p className="text-[12px] text-[var(--color-charcoal-soft)] leading-relaxed">
            Tim Bon Giri siap membantu mengecek status pesanan atau pertanyaan pengiriman secara langsung.
          </p>
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
              "Halo Admin Bon Giri, saya ingin menanyakan status pesanan saya."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-[13px] py-3 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            Tanya Admin via WhatsApp
          </a>
        </div>
      </div>
    </MobileAppShell>
  );
}
