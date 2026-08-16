import Link from "next/link";
import Image from "next/image";
import MobileAppShell from "@/components/MobileAppShell";
import { prisma } from "@/lib/prisma";
import { ArrowRight, MessageSquare, CheckCircle2, Flame, Sparkles, Fish, UtensilsCrossed, GraduationCap } from "lucide-react";

import AddToCartButton from "@/components/AddToCartButton";

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
    <MobileAppShell>
      {/* Tab Title (Beranda) */}
      <div className="bg-[#FFF9E6] px-4 py-2 text-center border-b border-[var(--color-muted)]/10">
        <span className="text-[14px] font-bold text-[var(--color-charcoal)]">Beranda</span>
      </div>

      <div className="flex flex-col">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden w-full aspect-[4/3] rounded-b-[24px]">
          <Image
            src="/images/products/original.webp"
            alt="Bon Giri Stik Keju Ikan Tenggiri"
            fill
            priority
            sizes="(max-width: 480px) 100vw, 480px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          <div className="absolute inset-0 p-5 flex flex-col justify-end text-left gsap-hero pb-8">
            <span className="text-[14px] font-bold text-[var(--color-white)]/90 tracking-wide mb-1 drop-shadow-md">
              Signature Snacks
            </span>
            <h1 className="font-display text-[32px] font-bold text-[var(--color-white)] leading-[1.1] mb-2 drop-shadow-lg">
              Cemilan Artisanal<br/>Premium
            </h1>
            <p className="text-[14px] text-[var(--color-white)]/90 leading-relaxed max-w-xs drop-shadow-md">
              Kelezatan autentik dalam setiap gigitan.
            </p>
          </div>
        </section>

        {/* CTA BUTTON */}
        <div className="px-4 mt-6 -mb-2 z-10 relative">
          <Link href="/katalog" className="btn-primary w-full text-[14px] font-bold py-3.5 flex justify-center items-center gap-2 shadow-[0_4px_14px_rgba(253,184,19,0.3)] bg-[var(--color-gold)] hover:bg-[var(--color-gold-dark)] text-[var(--color-charcoal)] rounded-full">
            LIHAT KATALOG
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
            
        {/* Value Props */}
        <section className="px-4 mt-8">
          <div className="grid grid-cols-3 gap-3">
            {[
              { title: "Kalsium\nIkan Tenggiri", icon: Fish },
              { title: "Bebas\nPengawet", icon: Sparkles },
              { title: "Sertifikasi\nHalal", icon: CheckCircle2 }
            ].map((prop, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-3 rounded-[16px] bg-[var(--color-white)] border border-[var(--color-muted)]/20 shadow-sm text-center aspect-square gap-2">
                <div className="w-10 h-10 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center">
                  <prop.icon className="w-5 h-5 text-[var(--color-charcoal)]" />
                </div>
                <span className="text-[11px] font-bold text-[var(--color-charcoal)] leading-tight whitespace-pre-line">{prop.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED PRODUCTS SECTION */}
        <section className="pt-8 pb-24 px-4 bg-[#FFF9E6]">
          <h2 className="text-[20px] font-bold text-[var(--color-charcoal)] mb-4">
            Produk Unggulan
          </h2>

          {featuredProducts.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-charcoal-soft)]">
              Belum ada produk.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {featuredProducts.map((product) => {
                const imgUrl = product.images[0]?.url || "/images/products/original.webp";
                
                return (
                  <div key={product.id} className="gsap-card card flex flex-col p-0 overflow-hidden group border-0 shadow-sm rounded-[16px]">
                    <div className="relative aspect-square bg-[#FFFEF3] w-full">
                      <Link href={`/katalog/${product.slug}`} className="block w-full h-full relative">
                        <Image src={imgUrl} alt={product.name} fill sizes="(max-width: 480px) 50vw, 240px" className="object-cover" loading="lazy" />
                      </Link>
                      {product.isAvailable ? (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FDE29F] text-[#B08A20]">Terlaris</div>
                      ) : (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-muted)] text-[var(--color-white)]">Habis</div>
                      )}
                    </div>

                    <div className="p-3 flex flex-col flex-1 bg-[var(--color-white)] relative">
                      <Link href={`/katalog/${product.slug}`} className="font-bold text-[13px] text-[var(--color-charcoal)] line-clamp-2 leading-snug mb-1">
                        {product.name}
                      </Link>
                      <span className="tabular-price text-[15px] font-bold text-[var(--color-gold-dark)] mt-auto">
                        Rp{product.price.toLocaleString("id-ID")}
                      </span>
                      
                      {/* Add to Cart Button */}
                      <AddToCartButton
                        product={{
                          id: product.id,
                          name: product.name,
                          slug: product.slug,
                          price: product.price,
                          image: imgUrl,
                          categoryName: product.category?.name,
                        }}
                        disabled={!product.isAvailable}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </MobileAppShell>


  );
}
