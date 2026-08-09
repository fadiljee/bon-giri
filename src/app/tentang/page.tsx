import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, MapPin, Fish, UtensilsCrossed, GraduationCap } from "lucide-react";

export default function TentangPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 gsap-reveal">
            <span className="tag-filled text-[11px]">
              Profil Usaha UMKM
            </span>
            <h1 className="text-[32px] sm:text-[38px] font-bold text-[#1A1A1A] mt-3 leading-[1.15]">
              Tentang Bon Giri Stik Keju
            </h1>
            <p className="text-[15px] text-[#6B6B6B] mt-3 leading-[1.6]">
              Inovasi produk camilan lokal khas Kepulauan Bangka Belitung berbahan dasar
              tepung tulang ikan tenggiri kaya kalsium.
            </p>
          </div>

          {/* Main card */}
          <div
            className="gsap-reveal bg-white rounded-xl border border-[#E0E0E0] p-8 sm:p-10 space-y-10"
            style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.06)" }}
          >
            {/* Story */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-[28px] font-bold text-[#1A1A1A] leading-[1.15]">
                  Latar Belakang & Visi Bon Giri
                </h2>
                <p className="text-[15px] text-[#3D3D3D] leading-[1.6]">
                  Usaha Bon Giri berawal dari program pengembangan kewirausahaan mahasiswa
                  binaan Kelompok Laboratorium Kewirausahaan (KLK) Universitas Bangka Belitung.
                </p>
                <p className="text-[15px] text-[#3D3D3D] leading-[1.6]">
                  Melihat melimpahnya potensi pengolahan ikan tenggiri di Bangka Belitung,
                  Bon Giri hadir membawa solusi pemanfaatan tulang ikan tenggiri yang diolah
                  secara higienis menjadi tepung tinggi kalsium yang dipadukan dengan lezatnya
                  stik keju gurih.
                </p>

                {/* Location */}
                <div className="flex items-center gap-2 pt-1">
                  <MapPin className="w-4 h-4 text-[#005B96] shrink-0" />
                  <span className="text-[13px] font-semibold text-[#3D3D3D]">
                    Pangkalpinang, Kepulauan Bangka Belitung
                  </span>
                </div>
              </div>

              <div className="aspect-4/3 rounded-xl overflow-hidden border border-[#E0E0E0] bg-[#FFFEF3]">
                <img
                  src="/images/products/original.png"
                  alt="Usaha Bon Giri Stik Keju"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Core Pillars */}
            <div className="pt-8 border-t border-[#E0E0E0]">
              <h3 className="text-[28px] font-bold text-[#1A1A1A] mb-6 text-center leading-[1.15]">
                Nilai Utama Produk Kami
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    IconComponent: Fish,
                    title: "Inovasi Bergizi",
                    body: "Mengubah tulang ikan tenggiri menjadi sumber kalsium alami tanpa bau amis.",
                  },
                  {
                    IconComponent: UtensilsCrossed,
                    title: "Rasa Otentik Gurih",
                    body: "Kombinasi keju premium renyah yang cocok dijadikan camilan sehari-hari atau oleh-oleh.",
                  },
                  {
                    IconComponent: GraduationCap,
                    title: "Binaan UBB",
                    body: "Didukung bimbingan kualitas & kontinuitas dari KLK Kewirausahaan Universitas Bangka Belitung.",
                  },
                ].map((item) => {
                  const Icon = item.IconComponent;
                  return (
                    <div
                      key={item.title}
                      className="bg-[#FFFEF3] border border-[#FDD273]/50 p-6 rounded-xl space-y-2"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#FDB813]/20 flex items-center justify-center mb-2">
                        <Icon className="w-5 h-5 text-[#8C6300]" />
                      </div>
                      <h4 className="font-semibold text-[16px] text-[#1A1A1A]">
                        {item.title}
                      </h4>
                      <p className="text-[13px] text-[#6B6B6B] leading-[1.6]">
                        {item.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quality Badges */}
            <div className="pt-8 border-t border-[#E0E0E0]">
              <h3 className="text-[20px] font-bold text-[#1A1A1A] mb-5">
                Komitmen Kualitas Kami
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Bahan baku ikan tenggiri segar pilihan",
                  "Proses produksi higienis & terstandar",
                  "Bebas pengawet berbahaya",
                  "Kemasan rapat, menjaga kerenyahan",
                  "Kaya kalsium alami dari tepung tulang tenggiri",
                  "Cocok untuk segala usia",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#005B96] shrink-0" />
                    <span className="text-[14px] text-[#3D3D3D]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
