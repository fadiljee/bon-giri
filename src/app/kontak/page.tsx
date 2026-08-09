import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
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
    <>
      <Navbar />
      <main className="flex-1 bg-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

          {/* Page Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="tag-filled text-[11px]">
              Layanan Pelanggan
            </span>
            <h1 className="text-[32px] sm:text-[38px] font-bold text-[#1A1A1A] mt-3 leading-[1.15]">
              Kontak Usaha Bon Giri
            </h1>
            <p className="text-[15px] text-[#6B6B6B] mt-2 leading-[1.6]">
              Punya pertanyaan mengenai pesanan, reseller, atau paket khusus? Hubungi tim Bon
              Giri secara langsung.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* WhatsApp Box */}
            <div
              className="bg-white rounded-xl border border-[#E0E0E0] p-7 flex flex-col justify-between space-y-6"
              style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.06)" }}
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 fill-emerald-600" />
                </div>
                <h2 className="text-[20px] font-semibold text-[#1A1A1A]">
                  Pemesanan WhatsApp
                </h2>
                <p className="text-[14px] text-[#6B6B6B] leading-[1.6]">
                  Order cepat tanpa ribet. Tim kami siap melayani pertanyaan seputar
                  ketersediaan varian, harga grosir, dan pengiriman.
                </p>
                <div className="text-[14px] font-bold text-[#005B96] bg-[#B3D1E8]/30 px-3 py-1.5 rounded-lg inline-block">
                  +{waNumber}
                </div>
              </div>

              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                  "Halo Bon Giri, saya ingin bertanya seputar pemesanan stik keju."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-btn w-full justify-center text-[14px] py-3"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                Hubungi via WhatsApp
              </a>
            </div>

            {/* Business Info Box */}
            <div
              className="bg-white rounded-xl border border-[#E0E0E0] p-7 space-y-5"
              style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.06)" }}
            >
              <div className="pb-4 border-b border-[#E0E0E0]">
                <h2 className="text-[20px] font-semibold text-[#1A1A1A]">
                  Alamat & Operasional
                </h2>
              </div>

              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#FDB813] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[12px] text-[#A6A6A6] font-medium uppercase tracking-[0.04em] block">
                      Lokasi Produksi
                    </span>
                    <span className="text-[14px] text-[#1A1A1A] font-semibold">{address}</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#FDB813] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[12px] text-[#A6A6A6] font-medium uppercase tracking-[0.04em] block">
                      Jam Layanan
                    </span>
                    <span className="text-[14px] text-[#1A1A1A] font-semibold">{hours}</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <InstagramIcon className="w-5 h-5 text-[#FDB813] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[12px] text-[#A6A6A6] font-medium uppercase tracking-[0.04em] block">
                      Instagram Resmi
                    </span>
                    <a
                      href={`https://instagram.com/${ig}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px] text-[#005B96] font-semibold hover:text-[#003D5C] transition-colors"
                    >
                      @{ig}
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
