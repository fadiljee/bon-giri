import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { ArrowRight, MessageSquare, CheckCircle2, Flame, Sparkles, Fish, UtensilsCrossed, GraduationCap } from "lucide-react";

export const revalidate = 60;

export default async function Home() {
  let featuredProducts: any[] = [];
  let waNumber = "6288267018426";

  try {
    const [dbProducts, settings] = await Promise.all([
      prisma.product.findMany({
        where: { isAvailable: true },
        take: 4,
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.businessSetting.findUnique({
        where: { id: "default" },
      }),
    ]);

    featuredProducts = dbProducts || [];
    if (settings?.whatsappNumber) {
      waNumber = settings.whatsappNumber;
    }
  } catch (error) {
    console.error("Error fetching homepage data from DB:", error);
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-white pt-12 pb-20 md:pt-16 md:pb-28">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Text Area */}
              <div className="lg:col-span-7 space-y-7 text-left gsap-hero">
                {/* <div className="inline-flex items-center gap-2 bg-[#FFFDD0] border border-[#FDD273]/80 text-[#8C6300] rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#D48806]" />
                  Inovasi Otentik Bangka Belitung
                </div> */}

                <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-[#1A1A1A] tracking-tight leading-[1.1]">
                  Stik Keju{" "}
                  <span className="text-[#005B96] font-black">
                    Ikan Tenggiri
                  </span>{" "}
                  Renyah & Kaya Kalsium.
                </h1>

                <p className="text-[17px] text-[#3D3D3D] leading-[1.7] max-w-2xl font-normal">
                  Camilan gurih renyah berbahan dasar keju berkualitas dan kalsium alami dari
                  tepung tulang ikan tenggiri khas Kepulauan Bangka Belitung binaan KLK Kewirausahaan Universitas Bangka Belitung.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                      "Halo Bon Giri, saya berminat memesan stik keju ikan tenggiri!"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wa-btn text-sm font-bold uppercase tracking-wider px-8 py-4 justify-center"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    Pesan via WhatsApp
                  </a>

                  <Link
                    href="/katalog"
                    className="inline-flex items-center justify-center gap-2 text-[#1A1A1A] font-bold text-sm hover:text-[#005B96] border-b-2 border-neutral-300 hover:border-[#005B96] pb-1 pt-1 transition-all"
                  >
                    Lihat Semua Varian
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-neutral-200/80 text-left">
                  {[
                    "Kaya Kalsium Alami",
                    "Renyah Tanpa Bau Amis",
                    "100% Bina UBB",
                  ].map((badge) => (
                    <div key={badge} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#005B96] shrink-0" />
                      <span className="text-xs font-semibold text-[#3D3D3D]">
                        {badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Image Showcase */}
              <div className="lg:col-span-5 gsap-hero">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="aspect-[3/2] rounded-2xl overflow-hidden shadow-lg border border-neutral-200/70 bg-neutral-50 relative group">
                    <Image
                      src="/images/products/original.webp"
                      alt="Bon Giri Stik Keju Ikan Tenggiri Original"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-6 pointer-events-none">
                      <div className="text-white">
                        <span className="bg-[#FDB813] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md inline-block">
                          Best Seller
                        </span>
                        <h3 className="text-xl font-bold mt-2">
                          Stik Keju Tenggiri Original
                        </h3>
                        <p className="text-xs text-[#FDD273] mt-0.5 font-medium">
                          Gurih Keju Asli & Nutrisi Tulang Tenggiri
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
        <section className="py-20 bg-neutral-50/60 border-t border-b border-neutral-200/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gsap-reveal">
              <div>
                <span className="text-[#005B96] text-xs font-bold uppercase tracking-widest block mb-2">
                  Katalog Terfavorit
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
                  Varian Bon Giri Pilihan
                </h2>
              </div>
              <Link
                href="/katalog"
                className="mt-4 sm:mt-0 text-sm font-bold text-[#005B96] hover:text-[#003D5C] flex items-center gap-1.5 group transition-colors"
              >
                Lihat Selengkapnya di Katalog
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {featuredProducts.length === 0 ? (
              <div className="text-center py-12 text-[#6B6B6B]">
                Belum ada produk yang ditampilkan saat ini.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => {
                  const imgUrl =
                    product.images[0]?.url || "/images/products/original.webp";

                  const waMessage = encodeURIComponent(
                    `Halo Bon Giri, saya ingin memesan produk: *${product.name}* (Harga: Rp ${product.price.toLocaleString("id-ID")})`
                  );

                  return (
                    <div
                      key={product.id}
                      className="gsap-card flex flex-col bg-white rounded-xl border border-neutral-200/80 overflow-hidden hover:shadow-md hover:border-[#005B96]/40 transition-all duration-300 group"
                    >
                      <div className="relative aspect-[3/2] overflow-hidden bg-[#FFFEF3]">
                        <Link href={`/katalog/${product.slug}`} className="block w-full h-full relative">
                          <Image
                            src={imgUrl}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </Link>
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-[#1A1A1A] shadow-2xs">
                          {product.category.name}
                        </div>
                        {product.spiceLevel && (
                          <div className="absolute top-3 right-3 bg-[#E2B024] text-[#1A1A1A] text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            {product.spiceLevel}
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-bold text-lg text-[#1A1A1A] leading-snug line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#6B6B6B] mt-2 line-clamp-2 flex-1 leading-relaxed">
                          {product.description}
                        </p>

                        <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[11px] text-[#A6A6A6] font-semibold uppercase tracking-wider block leading-none">
                              Harga Kemasan
                            </span>
                            <span className="text-base font-bold text-[#FDB813] leading-tight mt-0.5 block">
                              Rp {product.price.toLocaleString("id-ID")}
                            </span>
                          </div>

                          <a
                            href={`https://wa.me/${waNumber}?text=${waMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wa-btn py-2 px-3.5 text-xs font-bold shadow-2xs"
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
            )}
          </div>
        </section>

        {/* KEUNGGULAN SECTION */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 gsap-reveal">
              <span className="text-[#005B96] text-xs font-bold uppercase tracking-widest block mb-2">
                Keunggulan Utama
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
                Mengapa Memilih Stik Keju Bon Giri?
              </h2>
              <p className="text-[#6B6B6B] mt-3 text-base leading-relaxed">
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
                    className="gsap-reveal bg-[#FFFEF3] border border-[#FDD273]/50 p-8 rounded-2xl space-y-4 hover:border-[#005B96]/40 hover:bg-white hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#FDB813]/20 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#8C6300]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1A1A1A]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#3D3D3D] leading-relaxed">
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
