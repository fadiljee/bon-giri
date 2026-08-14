import MobileAppShell from "@/components/MobileAppShell";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowLeft, Plus, Minus, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import QrisCheckoutButton from "@/components/QrisCheckoutButton";

export const revalidate = 60;

export default async function CartPage() {
  const products = await prisma.product.findMany({
    take: 2,
    where: { isAvailable: true },
    include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
  });

  let waNumber = "6288267018426";
  try {
    const settings = await prisma.businessSetting.findUnique({
      where: { id: "default" },
    });
    if (settings?.whatsappNumber) {
      waNumber = settings.whatsappNumber;
    }
  } catch (e) {
    console.warn("Using default WA number", e);
  }

  const sampleProduct = products[0];

  return (
    <MobileAppShell>
      {/* Header Bar Title */}
      <div className="bg-[#FFF9E6] px-4 py-2 border-b border-[var(--color-muted)]/10 flex items-center">
        <Link href="/katalog" className="text-[var(--color-charcoal-soft)] hover:text-[var(--color-navy)]">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="flex-1 text-[14px] font-bold text-[var(--color-charcoal)] text-center mr-5">
          Keranjang Belanja
        </span>
      </div>

      <div className="flex flex-col bg-[#FFF9E6] min-h-screen pb-32 pt-6 px-4 space-y-4">
        {/* Cart items summary */}
        {sampleProduct ? (
          <div className="bg-white p-4 rounded-[16px] border border-[var(--color-muted)]/10 shadow-sm flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-[12px] bg-[#FFFEF3] overflow-hidden shrink-0 border border-[var(--color-muted)]/20">
              <Image
                src={sampleProduct.images[0]?.url || "/images/products/original.webp"}
                alt={sampleProduct.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-[var(--color-gold-dark)] uppercase">
                {sampleProduct.category.name}
              </span>
              <h3 className="text-[14px] font-bold text-[var(--color-charcoal)] line-clamp-1">
                {sampleProduct.name}
              </h3>
              <span className="text-[13px] font-bold text-[var(--color-charcoal)] block mt-0.5">
                Rp {sampleProduct.price.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-[#FFF9E6] px-2 py-1 rounded-full border border-[var(--color-muted)]/20">
              <span className="text-[12px] font-bold px-2">1x</span>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-[16px] text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-[var(--color-muted)] mx-auto" />
            <p className="text-[14px] text-[var(--color-charcoal-soft)]">Keranjang Anda masih kosong</p>
          </div>
        )}

        {/* Suggestion CTA */}
        <div className="bg-[#FFFEF3] p-4 rounded-[16px] border border-[var(--color-gold)]/30">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[13px] font-bold text-[var(--color-charcoal)]">Ingin tambah varian rasa lain?</h4>
              <p className="text-[11px] text-[var(--color-charcoal-soft)]">Jelajahi varian Balado, BBQ, dan Rumput Laut</p>
            </div>
            <Link
              href="/katalog"
              className="text-[12px] font-bold text-[var(--color-navy)] flex items-center gap-1 hover:underline"
            >
              Katalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Checkout Button */}
        {sampleProduct && (
          <div className="fixed bottom-[72px] w-full max-w-[480px] px-4 pb-4 z-40 bg-gradient-to-t from-[#FFF9E6] via-[#FFF9E6]/90 to-transparent pt-6">
            <QrisCheckoutButton
              productName={sampleProduct.name}
              productPrice={sampleProduct.price}
              waNumber={waNumber}
              variant="full"
            />
          </div>
        )}
      </div>
    </MobileAppShell>
  );
}
