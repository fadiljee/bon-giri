import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MessageSquare, ShieldCheck, Flame, CheckCircle2, AlertCircle } from "lucide-react";

export const revalidate = 60;

interface ProductDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { slug } = await params;

  const [product, settings] = await Promise.all([
    prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.businessSetting.findUnique({
      where: { id: "default" },
    }),
  ]);

  if (!product) {
    notFound();
  }

  const waNumber = settings?.whatsappNumber || "6288267018426";

  const imgUrl =
    product.images[0]?.url || "/images/products/original.webp";

  const waMessage = encodeURIComponent(
    `Halo Bon Giri, saya berminat order produk:\n\n*Nama:* ${product.name}\n*Harga:* Rp ${product.price.toLocaleString("id-ID")}\n*Varian Rasa:* ${product.spiceLevel}\n\nApakah stok masih tersedia?`
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

          {/* Back link */}
          <Link
            href="/katalog"
            className="gsap-reveal inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#6B6B6B] hover:text-[#005B96] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Katalog Produk
          </Link>

          {/* Main Card */}
          <div
            className="gsap-reveal bg-white rounded-xl border border-[#E0E0E0] overflow-hidden p-6 sm:p-8"
            style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.06)" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Product Image */}
              <div className="lg:col-span-6">
                <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-[#FFFEF3] border border-[#E0E0E0]">
                  <Image
                    src={imgUrl}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[12px] font-bold text-[#1A1A1A] shadow-sm">
                    {product.category.name}
                  </div>
                  {product.spiceLevel && (
                    <div className="absolute top-4 right-4 tag-filled text-[11px] gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      {product.spiceLevel}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <span className="tag-filled text-[11px]">
                    {product.category.name}
                  </span>
                  <h1 className="text-[28px] sm:text-[32px] font-bold text-[#1A1A1A] mt-3 leading-[1.15]">
                    {product.name}
                  </h1>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] font-bold text-[#FDB813] leading-none">
                    Rp {product.price.toLocaleString("id-ID")}
                  </span>
                  <span className="text-[12px] text-[#A6A6A6] font-medium uppercase tracking-[0.04em]">
                    / Kemasan 100g
                  </span>
                </div>

                <div>
                  {product.isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 text-[#4A6B1F] bg-[#4A6B1F]/10 border border-[#4A6B1F]/20 px-3 py-1.5 rounded-lg text-[13px] font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      Stok Tersedia
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[#C81E1E] bg-[#C81E1E]/10 border border-[#C81E1E]/20 px-3 py-1.5 rounded-lg text-[13px] font-semibold">
                      <AlertCircle className="w-4 h-4" />
                      Stok Habis
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-[#E0E0E0]">
                  <h3 className="text-[12px] font-medium text-[#A6A6A6] uppercase tracking-[0.04em] mb-2">
                    Deskripsi Produk
                  </h3>
                  <p className="text-[15px] text-[#3D3D3D] leading-[1.6]">
                    {product.description}
                  </p>
                </div>

                <div className="bg-[#FFFDD0] border border-[#FDD273]/60 p-4 rounded-xl space-y-2">
                  <h4 className="text-[12px] font-bold text-[#4A3200] uppercase tracking-[0.04em] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#8C6300]" />
                    Informasi Nutrisi & Keunggulan
                  </h4>
                  <ul className="text-[13px] text-[#1A1A1A] space-y-1.5">
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#FDB813] font-bold mt-0.5">•</span>
                      Terbuat dari keju berkualitas & tepung kalsium tulang ikan tenggiri.
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#FDB813] font-bold mt-0.5">•</span>
                      Dikemas higienis dengan seal rapat agar kerenyahan tahan lama.
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#FDB813] font-bold mt-0.5">•</span>
                      Asli binaan KLK Kewirausahaan Universitas Bangka Belitung.
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  {product.isAvailable ? (
                    <a
                      href={`https://wa.me/${waNumber}?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="wa-btn w-full text-[15px] py-3.5 justify-center shadow-md hover:shadow-lg"
                    >
                      <MessageSquare className="w-5 h-5 fill-white" />
                      Pesan Sekarang via WhatsApp
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-[#E0E0E0] text-[#A6A6A6] font-bold py-3.5 rounded-full cursor-not-allowed text-[14px]"
                    >
                      Stok Sedang Habis (Hubungi Seller)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
