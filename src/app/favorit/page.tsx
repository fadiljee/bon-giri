import MobileAppShell from "@/components/MobileAppShell";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function FavoritPage() {
  const products = await prisma.product.findMany({
    take: 2,
    where: { isAvailable: true },
    include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <MobileAppShell>
      {/* Header Bar Title */}
      <div className="bg-[#FFF9E6] px-4 py-2 text-center border-b border-[var(--color-muted)]/10">
        <span className="text-[14px] font-bold text-[var(--color-charcoal)]">Favorit Saya</span>
      </div>

      <div className="flex flex-col bg-[#FFF9E6] min-h-screen pb-24 pt-6 px-4">
        {/* Banner */}
        <div className="bg-white p-5 rounded-[16px] border border-[var(--color-muted)]/10 shadow-sm mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 text-[var(--color-gold-dark)] fill-[var(--color-gold-dark)]" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-[var(--color-charcoal)]">Varian Favorit Pembeli</h2>
            <p className="text-[12px] text-[var(--color-charcoal-soft)] leading-tight">
              Simpan dan temukan kembali rasa stik keju kesukaan Anda di sini.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="space-y-4">
          <h3 className="text-[13px] font-bold text-[var(--color-charcoal-soft)] uppercase tracking-wide">
            Rekomendasi Varian Terfavorit
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => {
              const imgUrl = product.images[0]?.url || "/images/products/original.webp";
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-[16px] border border-[var(--color-muted)]/10 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative aspect-square w-full bg-[#FFFEF3]">
                    <Image
                      src={imgUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 480px) 50vw, 240px"
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[var(--color-error)]">
                      <Heart className="w-4 h-4 fill-[var(--color-error)]" />
                    </div>
                  </div>

                  <div className="p-3 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[var(--color-gold-dark)] uppercase">
                        {product.category.name}
                      </span>
                      <h4 className="text-[13px] font-bold text-[var(--color-charcoal)] line-clamp-1 mt-0.5">
                        {product.name}
                      </h4>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[13px] font-bold text-[var(--color-charcoal)]">
                        Rp {product.price.toLocaleString("id-ID")}
                      </span>
                      <Link
                        href={`/katalog/${product.slug}`}
                        className="w-7 h-7 rounded-full bg-[var(--color-navy)] text-white flex items-center justify-center hover:bg-[var(--color-navy-dark)] transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MobileAppShell>
  );
}
