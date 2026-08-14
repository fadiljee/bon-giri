import MobileAppShell from "@/components/MobileAppShell";
import Link from "next/link";
import { User, MapPin, Clock, ShieldCheck, ChevronRight, MessageSquare, Info } from "lucide-react";
import { InstagramIcon } from "@/components/InstagramIcon";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function ProfilPage() {
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
  } catch (e) {
    console.warn("Using default settings", e);
  }

  return (
    <MobileAppShell>
      {/* Header Bar Title */}
      <div className="bg-[#FFF9E6] px-4 py-2 text-center border-b border-[var(--color-muted)]/10">
        <span className="text-[14px] font-bold text-[var(--color-charcoal)]">Profil Pengguna</span>
      </div>

      <div className="flex flex-col bg-[#FFF9E6] min-h-screen pb-24 pt-6 px-4 space-y-5">
        {/* Profile Card */}
        <div className="bg-white p-5 rounded-[16px] border border-[var(--color-muted)]/10 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[var(--color-gold)]/20 border-2 border-[var(--color-gold)] flex items-center justify-center shrink-0">
            <User className="w-7 h-7 text-[var(--color-gold-dark)]" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[var(--color-charcoal)]">Pelanggan Bon Giri</h2>
            <p className="text-[12px] text-[var(--color-gold-dark)] font-semibold">
              Pecinta Camilan Kalsium Tenggiri
            </p>
          </div>
        </div>

        {/* UMKM Info Group */}
        <div className="bg-white rounded-[16px] border border-[var(--color-muted)]/10 shadow-sm divide-y divide-[var(--color-muted)]/10">
          <div className="p-4 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[var(--color-gold-dark)] shrink-0" />
            <div className="flex-1">
              <span className="text-[11px] text-[var(--color-charcoal-soft)] uppercase font-bold block">Status Usaha</span>
              <span className="text-[13px] font-bold text-[var(--color-charcoal)]">Binaan KLK Kewirausahaan UBB</span>
            </div>
          </div>

          <Link href="/tentang" className="p-4 flex items-center justify-between hover:bg-black/5 transition-colors">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-[#005B96] shrink-0" />
              <span className="text-[13px] font-bold text-[var(--color-charcoal)]">Tentang Bon Giri Stik Keju</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--color-muted)]" />
          </Link>

          <Link href="/kontak" className="p-4 flex items-center justify-between hover:bg-black/5 transition-colors">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#005B96] shrink-0" />
              <div>
                <span className="text-[13px] font-bold text-[var(--color-charcoal)] block">Lokasi & Alamat</span>
                <span className="text-[11px] text-[var(--color-charcoal-soft)]">{address}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--color-muted)]" />
          </Link>

          <div className="p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#005B96] shrink-0" />
            <div>
              <span className="text-[11px] text-[var(--color-charcoal-soft)] uppercase font-bold block">Jam Layanan</span>
              <span className="text-[13px] font-bold text-[var(--color-charcoal)]">{hours}</span>
            </div>
          </div>

          <a
            href={`https://instagram.com/${ig}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 flex items-center justify-between hover:bg-black/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <InstagramIcon className="w-5 h-5 text-[#005B96] shrink-0" />
              <span className="text-[13px] font-bold text-[var(--color-navy)]">@{ig}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--color-muted)]" />
          </a>
        </div>

        {/* Quick Help */}
        <a
          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
            "Halo Bon Giri, saya ingin bertanya seputar layanan dan pemesanan."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-[14px] py-3.5 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          Hubungi Layanan Pelanggan
        </a>
      </div>
    </MobileAppShell>
  );
}
