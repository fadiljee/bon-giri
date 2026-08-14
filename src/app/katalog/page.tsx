import MobileAppShell from "@/components/MobileAppShell";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Flame, Search, PackageSearch } from "lucide-react";
export const revalidate = 60;

interface KatalogProps {
  searchParams: Promise<{
    kategori?: string;
    q?: string;
  }>;
}

export default async function KatalogPage({ searchParams }: KatalogProps) {
  const { kategori, q } = await searchParams;

  let categories: any[] = [];
  let products: any[] = [];
  let waNumber = "6288267018426";

  try {
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

    const [dbCategories, dbProducts, settings] = await Promise.all([
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.product.findMany({
        where: whereCondition,
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

    categories = dbCategories || [];
    products = dbProducts || [];
    if (settings?.whatsappNumber) waNumber = settings.whatsappNumber;
  } catch (error) {
    console.error("Error loading KatalogPage data from DB:", error);
  }

  return (
    <MobileAppShell>
      {/* Tab Title */}
      <div className="bg-[#FFF9E6] px-4 py-2 text-center border-b border-[var(--color-muted)]/10">
        <span className="text-[14px] font-bold text-[var(--color-charcoal)]">Katalog</span>
      </div>

      <div className="flex flex-col bg-[#FFF9E6] min-h-screen pb-20">
        {/* Search Bar */}
        <div className="px-4 pt-4 pb-2">
          <form action="/katalog" method="GET" className="relative w-full">
            {kategori && <input type="hidden" name="kategori" value={kategori} />}
            <Search className="w-5 h-5 text-[var(--color-muted)] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="q"
              defaultValue={q || ""}
              placeholder="Cari onigiri favoritmu..."
              className="w-full pl-12 pr-4 py-3 text-[14px] bg-[var(--color-white)] border border-[var(--color-muted)]/20 rounded-[16px] focus:outline-none focus:border-[var(--color-gold)] text-[var(--color-charcoal)] placeholder:text-[var(--color-muted)] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all"
            />
          </form>
        </div>

        {/* Category Pills */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
              <Link
                href="/katalog"
                className={`px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-150 ${!kategori
                  ? "bg-[var(--color-gold)] text-[var(--color-charcoal)] shadow-sm"
                  : "bg-[var(--color-white)] border border-[var(--color-muted)]/20 text-[var(--color-charcoal)] shadow-sm"
                  }`}
              >
                Semua
              </Link>
              {categories.map((cat) => {
                const isSelected = kategori === cat.slug;
                return (
                  <Link
                    key={cat.id}
                    href={`/katalog?kategori=${cat.slug}${q ? `&q=${q}` : ""}`}
                    className={`px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-150 ${isSelected
                      ? "bg-[var(--color-gold)] text-[var(--color-charcoal)] shadow-sm"
                      : "bg-[var(--color-white)] border border-[var(--color-muted)]/20 text-[var(--color-charcoal)] shadow-sm"
                      }`}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          </div>

        {/* Product Grid */}
        <div className="px-4 mt-2">
          {products.length === 0 ? (
            <div className="gsap-reveal text-center py-16 bg-[var(--color-white)] rounded-[16px] shadow-sm border border-[var(--color-muted)]/20">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[#FFF9E6] flex items-center justify-center border border-[var(--color-gold)]/40">
                  <PackageSearch className="w-8 h-8 text-[var(--color-gold-dark)]" />
                </div>
              </div>
              <h3 className="font-display text-[20px] font-semibold text-[var(--color-charcoal)]">
                Varian Tidak Ditemukan
              </h3>
              <p className="text-[14px] text-[var(--color-charcoal-soft)] mt-2">
                Coba sesuaikan kata kunci pencarian.
              </p>
              <Link href="/katalog" className="btn-primary mt-6 inline-flex text-[14px] bg-[var(--color-gold)] text-[var(--color-charcoal)]">
                Lihat Semua Varian
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => {
                const imgUrl = product.images[0]?.url || "/images/products/original.webp";

                return (
                  <div key={product.id} className="gsap-card card flex flex-col p-0 overflow-hidden group border-0 shadow-sm rounded-[16px]">
                    <div className="relative aspect-square bg-[#FFFEF3] w-full">
                      <Link href={`/katalog/${product.slug}`} className="block w-full h-full relative">
                        <Image src={imgUrl} alt={product.name} fill sizes="(max-width: 480px) 50vw, 240px" className="object-cover" loading="lazy" />
                        
                        {/* Sold Out Overlay */}
                        {!product.isAvailable && (
                          <div className="absolute inset-0 bg-[var(--color-charcoal)]/60 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="text-white font-display font-bold text-[16px] tracking-wider">SOLD OUT</span>
                          </div>
                        )}
                      </Link>

                      {product.isAvailable && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FDE29F] text-[#B08A20]">
                          Ready Stock
                        </div>
                      )}

                      {product.spiceLevel && product.isAvailable && (
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-error)] text-white shadow-sm flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5" /> {product.spiceLevel}
                        </div>
                      )}
                    </div>

                    <div className="p-3 flex flex-col flex-1 bg-[var(--color-white)] relative">
                      <Link href={`/katalog/${product.slug}`} className="font-bold text-[13px] text-[var(--color-charcoal)] line-clamp-2 leading-snug mb-1">
                        {product.name}
                      </Link>
                      
                      <span className="tabular-price text-[15px] font-bold text-[var(--color-gold-dark)] mt-auto">
                        Rp{product.price.toLocaleString("id-ID")}
                      </span>
                      
                      {/* Plus Button */}
                      <Link href={`/katalog/${product.slug}`} className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[var(--color-muted)]/10 flex items-center justify-center text-[var(--color-charcoal)] hover:bg-[var(--color-gold)] transition-colors">
                        <span className="text-[18px] font-medium leading-none mb-0.5">+</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MobileAppShell>
  );
}
