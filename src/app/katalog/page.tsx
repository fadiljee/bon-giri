import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MessageSquare, Flame, Search, PackageSearch } from "lucide-react";

export const revalidate = 60;

interface KatalogProps {
  searchParams: Promise<{
    kategori?: string;
    q?: string;
  }>;
}

const FALLBACK_CATEGORIES = [
  { id: "cat-1", name: "Varian Original", slug: "original" },
  { id: "cat-2", name: "Varian Pedas", slug: "pedas" },
  { id: "cat-3", name: "Spesial Aroma", slug: "spesial-aroma" },
];

const FALLBACK_PRODUCTS = [
  {
    id: "fb-1",
    name: "Stik Keju Ikan Tenggiri Original 100g",
    slug: "stik-keju-tenggiri-original-100g",
    description: "Stik keju gurih renyah berbahan dasar keju premium & kalsium tinggi tulang ikan tenggiri khas Bangka Belitung.",
    price: 15000,
    spiceLevel: "Original",
    isAvailable: true,
    category: { name: "Varian Original", slug: "original" },
    images: [{ url: "/images/products/original.png" }],
  },
  {
    id: "fb-2",
    name: "Stik Keju Ikan Tenggiri Pedas Balado 100g",
    slug: "stik-keju-tenggiri-pedas-balado-100g",
    description: "Sensasi renyah gurih keju ikan tenggiri berpadu dengan bumbu pedas balado khas yang kaya rempah.",
    price: 16000,
    spiceLevel: "Pedas Sedang",
    isAvailable: true,
    category: { name: "Varian Pedas", slug: "pedas" },
    images: [{ url: "/images/products/balado.png" }],
  },
  {
    id: "fb-3",
    name: "Stik Keju Ikan Tenggiri Rasa BBQ 100g",
    slug: "stik-keju-tenggiri-rasa-bbq-100g",
    description: "Aroma asap smokey barbeque khas yang dipadukan dengan keju melimpah dan kerenyahan kalsium ikan tenggiri.",
    price: 16000,
    spiceLevel: "Original",
    isAvailable: true,
    category: { name: "Varian Original", slug: "original" },
    images: [{ url: "/images/products/bbq.png" }],
  },
  {
    id: "fb-4",
    name: "Stik Keju Ikan Tenggiri Rumput Laut 100g",
    slug: "stik-keju-tenggiri-rumput-laut-100g",
    description: "Sensasi umami gurih rumput laut pilihan yang membalur stik keju renyah tinggi nutrisi kalsium.",
    price: 16500,
    spiceLevel: "Original",
    isAvailable: true,
    category: { name: "Spesial Aroma", slug: "spesial-aroma" },
    images: [{ url: "/images/products/rumput-laut.png" }],
  },
];

export default async function KatalogPage({ searchParams }: KatalogProps) {
  const { kategori, q } = await searchParams;

  let categories = FALLBACK_CATEGORIES;
  let products = FALLBACK_PRODUCTS;
  let waNumber = "6288267018426";

  try {
    const dbCategories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    if (dbCategories && dbCategories.length > 0) {
      categories = dbCategories as any;
    }

    const whereCondition: any = {};
    if (kategori) {
      whereCondition.category = { slug: kategori };
    }
    if (q) {
      whereCondition.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
      ];
    }

    const dbProducts = await prisma.product.findMany({
      where: whereCondition,
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbProducts) {
      products = dbProducts as any;
    }

    const settings = await prisma.businessSetting.findUnique({
      where: { id: "default" },
    });
    if (settings?.whatsappNumber) waNumber = settings.whatsappNumber;
  } catch (error) {
    console.warn("DB connection pending or unreachable in KatalogPage, using fallback data.", error);
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Page Header */}
          <div className="mb-8 text-center max-w-2xl mx-auto gsap-reveal">
            <span className="tag-filled text-[11px]">
              Katalog Produk Usaha
            </span>
            <h1 className="text-[32px] sm:text-[38px] font-bold text-[#1A1A1A] mt-3 leading-[1.15]">
              Daftar Stik Keju Bon Giri
            </h1>
            <p className="text-[15px] text-[#6B6B6B] mt-2 leading-[1.6]">
              Pilih varian favoritmu dan klik tombol pesan untuk langsung terhubung ke WhatsApp
              penjual dengan pesan otomatis.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div
            className="gsap-reveal bg-white p-4 rounded-xl border border-[#E0E0E0] mb-8 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.06)" }}
          >
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <Link
                href="/katalog"
                className={`px-4 py-2 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all duration-150 uppercase tracking-[0.04em] ${!kategori
                    ? "bg-[#FDB813] text-[#1A1A1A]"
                    : "bg-[#E0E0E0] text-[#3D3D3D] hover:bg-[#A6A6A6]/30"
                  }`}
              >
                Semua Varian ({products.length})
              </Link>
              {categories.map((cat) => {
                const isSelected = kategori === cat.slug;
                return (
                  <Link
                    key={cat.id}
                    href={`/katalog?kategori=${cat.slug}${q ? `&q=${q}` : ""}`}
                    className={`px-4 py-2 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all duration-150 uppercase tracking-[0.04em] ${isSelected
                        ? "bg-[#FDB813] text-[#1A1A1A]"
                        : "bg-[#E0E0E0] text-[#3D3D3D] hover:bg-[#A6A6A6]/30"
                      }`}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>

            {/* Search Input */}
            <form action="/katalog" method="GET" className="relative w-full md:w-72">
              {kategori && <input type="hidden" name="kategori" value={kategori} />}
              <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="q"
                defaultValue={q || ""}
                placeholder="Cari varian rasa..."
                className="w-full pl-9 pr-4 py-2.5 text-[13px] bg-white border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#FDB813] focus:ring-2 focus:ring-[#FDB813]/20 text-[#1A1A1A] placeholder:text-[#6B6B6B]"
              />
            </form>
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div
              className="gsap-reveal text-center py-16 bg-white rounded-xl border border-[#E0E0E0]"
              style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.06)" }}
            >
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-[#FFFDD0] flex items-center justify-center border border-[#FDB813]/40">
                  <PackageSearch className="w-8 h-8 text-[#005B96]" />
                </div>
              </div>
              <h3 className="text-[19px] font-semibold text-[#1A1A1A]">
                Varian Tidak Ditemukan
              </h3>
              <p className="text-[13px] text-[#6B6B6B] mt-1.5">
                Coba sesuaikan kata kunci pencarian atau pilih kategori produk yang lain.
              </p>
              <Link href="/katalog" className="btn-primary text-[13px] mt-5 inline-flex">
                Lihat Semua Varian
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const imgUrl =
                  product.images[0]?.url || "/images/products/original.png";

                const waMessage = encodeURIComponent(
                  `Halo Bon Giri, saya ingin memesan produk: *${product.name}* (Harga: Rp ${product.price.toLocaleString("id-ID")})`
                );

                return (
                  <div
                    key={product.id}
                    className={`gsap-card flex flex-col bg-white rounded-xl border border-[#E0E0E0] overflow-hidden hover:shadow-lg transition-all duration-200 group ${!product.isAvailable ? "opacity-70" : ""
                      }`}
                    style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.06)" }}
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-[#FFFEF3]">
                      <Link href={`/katalog/${product.slug}`}>
                        <img
                          src={imgUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>

                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold text-[#1A1A1A] shadow-sm">
                        {product.category.name}
                      </div>

                      {!product.isAvailable ? (
                        <div className="absolute inset-0 bg-[#1A1A1A]/50 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="tag-danger">Stok Habis</span>
                        </div>
                      ) : (
                        product.spiceLevel && (
                          <div className="absolute top-3 right-3 tag-filled text-[10px] gap-1">
                            <Flame className="w-3 h-3" />
                            {product.spiceLevel}
                          </div>
                        )
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <Link
                        href={`/katalog/${product.slug}`}
                        className="font-semibold text-[16px] text-[#1A1A1A] leading-snug line-clamp-2 hover:text-[#005B96] transition-colors"
                      >
                        {product.name}
                      </Link>
                      <p className="text-[13px] text-[#6B6B6B] mt-1.5 line-clamp-2 flex-1 leading-[1.6]">
                        {product.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-[#E0E0E0] flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[12px] text-[#A6A6A6] font-medium uppercase tracking-[0.04em] block leading-none">
                            Harga Kemasan
                          </span>
                          <span className="text-[16px] font-bold text-[#FDB813] leading-tight">
                            Rp {product.price.toLocaleString("id-ID")}
                          </span>
                        </div>

                        {product.isAvailable ? (
                          <a
                            href={`https://wa.me/${waNumber}?text=${waMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wa-btn py-2 px-3 text-[12px] font-bold"
                          >
                            <MessageSquare className="w-3.5 h-3.5 fill-white" />
                            Pesan
                          </a>
                        ) : (
                          <button
                            disabled
                            className="bg-[#E0E0E0] text-[#A6A6A6] text-[12px] font-bold py-2 px-3 rounded-full cursor-not-allowed"
                          >
                            Habis
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
