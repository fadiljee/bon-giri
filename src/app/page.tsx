import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { ArrowRight, MessageSquare, CheckCircle2, Flame, Sparkles, Fish, UtensilsCrossed, GraduationCap } from "lucide-react";

export const revalidate = 60;

const FALLBACK_PRODUCTS = [
  {
    id: "fb-1",
    name: "Stik Keju Ikan Tenggiri Original 100g",
    description: "Stik keju gurih renyah berbahan dasar keju premium & kalsium tinggi tulang ikan tenggiri khas Bangka Belitung.",
    price: 15000,
    spiceLevel: "Original",
    isAvailable: true,
    category: { name: "Varian Original" },
    images: [{ url: "/images/products/original.png" }],
  },
  {
    id: "fb-2",
    name: "Stik Keju Ikan Tenggiri Pedas Balado 100g",
    description: "Sensasi renyah gurih keju ikan tenggiri berpadu dengan bumbu pedas balado khas yang kaya rempah.",
    price: 16000,
    spiceLevel: "Pedas Sedang",
    isAvailable: true,
    category: { name: "Varian Pedas" },
    images: [{ url: "/images/products/balado.png" }],
  },
  {
    id: "fb-3",
    name: "Stik Keju Ikan Tenggiri Rasa BBQ 100g",
    description: "Aroma asap smokey barbeque khas yang dipadukan dengan keju melimpah dan kerenyahan kalsium ikan tenggiri.",
    price: 16000,
    spiceLevel: "Original",
    isAvailable: true,
    category: { name: "Varian Original" },
    images: [{ url: "/images/products/bbq.png" }],
  },
  {
    id: "fb-4",
    name: "Stik Keju Ikan Tenggiri Rumput Laut 100g",
    description: "Sensasi umami gurih rumput laut pilihan yang membalur stik keju renyah tinggi nutrisi kalsium.",
    price: 16500,
    spiceLevel: "Original",
    isAvailable: true,
    category: { name: "Spesial Aroma" },
    images: [{ url: "/images/products/rumput-laut.png" }],
  },
];

export default async function Home() {
  let featuredProducts = FALLBACK_PRODUCTS;
  let waNumber = "6288267018426";

  try {
    const dbProducts = await prisma.product.findMany({
      where: { isAvailable: true },
      take: 4,
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbProducts && dbProducts.length > 0) {
      featuredProducts = dbProducts as any;
    }

    const settings = await prisma.businessSetting.findUnique({
      where: { id: "default" },
    });

    if (settings?.whatsappNumber) {
      waNumber = settings.whatsappNumber;
    }
  } catch (error) {
    console.warn("DB connection pending or unreachable, using fallback product data.", error);
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-[#FFFDD0] pt-14 pb-20 md:pt-20 md:pb-28">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle, #FDB813 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Text Area */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left gsap-hero">
                <div className="inline-flex items-center gap-1.5 bg-[#E2B024] text-[#1A1A1A] rounded-full px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.04em]">
                  <Sparkles className="w-3.5 h-3.5 text-[#1A1A1A]" />
                  Inovasi Otentik Bangka Belitung
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#1A1A1A] leading-[1.15]">
                  Sensasi Gurih Renyah{" "}
                  <span className="text-[#005B96]">
                    Stik Keju Tulang Ikan Tenggiri
                  </span>
                </h1>

                <p className="text-[16px] text-[#3D3D3D] leading-[1.6] max-w-2xl mx-auto lg:mx-0">
                  Camilan bergizi kaya kalsium alami dari tepung tulang ikan tenggiri khas
                  Kepulauan Bangka Belitung. Renyah, gurih keju melimpah, cocok untuk teman
                  santai kapan saja.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    href="/katalog"
                    className="btn-primary text-[15px] px-7 py-3.5 shadow-md hover:shadow-lg w-full sm:w-auto"
                  >
                    Lihat Semua Varian
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                      "Halo Bon Giri, saya berminat memesan stik keju ikan tenggiri!"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wa-btn text-[15px] px-7 py-3.5 w-full sm:w-auto"
                  >
                    <MessageSquare className="w-5 h-5 fill-white" />
                    Pesan Langsung WA
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#FDB813]/40 max-w-lg mx-auto lg:mx-0 text-left">
                  {[
                    "Kaya Kalsium Alami",
                    "Minyak Nabati Bersih",
                    "100% Produk Lokal UBB",
                  ].map((badge) => (
                    <div key={badge} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#005B96] shrink-0" />
                      <span className="text-[12px] font-semibold text-[#3D3D3D]">
                        {badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Image */}
              <div className="lg:col-span-5 gsap-hero">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#FEEBB8] relative group">
                    <img
                      src="/images/products/original.png"
                      alt="Bon Giri Stik Keju Ikan Tenggiri Original"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent flex items-end p-6">
                      <div className="text-white">
                        <span className="tag-filled text-[11px]">
                          Best Seller
                        </span>
                        <h3 className="text-xl font-bold mt-2">
                          Stik Keju Tenggiri Original
                        </h3>
                        <p className="text-[12px] text-[#FDD273] mt-0.5">
                          Gurih Keju Asli & Kalsium Ikan Tenggiri
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS SECTION */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gsap-reveal">
              <div>
                <span className="tag-filled text-[11px]">
                  Katalog Terfavorit
                </span>
                <h2 className="text-[32px] font-bold text-[#1A1A1A] mt-3 leading-[1.15]">
                  Varian Bon Giri Pilihan
                </h2>
              </div>
              <Link
                href="/katalog"
                className="mt-3 sm:mt-0 text-[13px] font-bold text-[#005B96] hover:text-[#003D5C] flex items-center gap-1 group transition-colors"
              >
                Lihat Selengkapnya di Katalog
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => {
                const imgUrl =
                  product.images[0]?.url || "/images/products/original.png";

                const waMessage = encodeURIComponent(
                  `Halo Bon Giri, saya ingin memesan produk: *${product.name}* (Harga: Rp ${product.price.toLocaleString("id-ID")})`
                );

                return (
                  <div
                    key={product.id}
                    className="gsap-card flex flex-col bg-white rounded-xl border border-[#E0E0E0] overflow-hidden hover:shadow-lg transition-all duration-200 group"
                    style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.06)" }}
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-[#FFFEF3]">
                      <img
                        src={imgUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold text-[#1A1A1A] shadow-sm">
                        {product.category.name}
                      </div>
                      {product.spiceLevel && (
                        <div className="absolute top-3 right-3 tag-filled text-[10px] gap-1">
                          <Flame className="w-3 h-3" />
                          {product.spiceLevel}
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-semibold text-[19px] text-[#1A1A1A] leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-[13px] text-[#6B6B6B] mt-1.5 line-clamp-2 flex-1 leading-[1.6]">
                        {product.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-[#E0E0E0] flex items-center justify-between">
                        <div>
                          <span className="text-[12px] text-[#A6A6A6] font-medium uppercase tracking-[0.04em] block leading-none">
                            Harga Kemasan
                          </span>
                          <span className="text-[18px] font-bold text-[#FDB813] leading-tight">
                            Rp {product.price.toLocaleString("id-ID")}
                          </span>
                        </div>

                        <a
                          href={`https://wa.me/${waNumber}?text=${waMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="wa-btn py-2 px-3.5 text-[12px] font-bold"
                          title="Pesan via WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-white" />
                          Pesan WA
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* KEUNGGULAN SECTION */}
        <section className="py-16 bg-[#1A1A1A] text-white relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 gsap-reveal">
              <span className="tag-filled text-[11px] mb-4 inline-flex">
                Keunggulan Produk
              </span>
              <h2 className="text-[32px] sm:text-[38px] font-bold mt-3 leading-[1.15]">
                Mengapa Memilih Stik Keju Bon Giri?
              </h2>
              <p className="text-[#A6A6A6] mt-3 text-[15px] leading-[1.6]">
                Inovasi pengolahan tulang ikan tenggiri menjadi camilan stik keju tinggi nutrisi
                dan cita rasa otentik khas Bangka Belitung.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  IconComponent: Fish,
                  title: "Kaya Kalsium Tulang Tenggiri",
                  body: "Memanfaatkan potensi limbah tulang ikan tenggiri yang diolah secara higienis menjadi tepung halus kalsium tinggi yang aman dan menyehatkan.",
                },
                {
                  IconComponent: UtensilsCrossed,
                  title: "Rasa Keju Gurih Melimpah",
                  body: "Bumbu keju pilihan berpadu sempurna dengan kelezatan khas ikan tenggiri Bangka. Renyah tanpa bau amis!",
                },
                {
                  IconComponent: GraduationCap,
                  title: "Binaan Kewirausahaan UBB",
                  body: "Produk asli binaan Kelompok Laboratorium Kewirausahaan (KLK) Universitas Bangka Belitung, dikemas higienis & terstandar.",
                },
              ].map((item) => {
                const Icon = item.IconComponent;
                return (
                  <div
                    key={item.title}
                    className="gsap-reveal bg-[#3D3D3D]/40 border border-white/10 p-7 rounded-xl space-y-3 hover:border-[#FDB813]/40 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#FDB813]/20 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#FDB813]" />
                    </div>
                    <h3 className="text-[19px] font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-[15px] text-[#A6A6A6] leading-[1.6]">
                      {item.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
