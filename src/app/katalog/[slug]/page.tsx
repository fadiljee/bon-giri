import MobileAppShell from "@/components/MobileAppShell";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Flame, CheckCircle2, AlertCircle } from "lucide-react";
import QrisCheckoutButton from "@/components/QrisCheckoutButton";
import AddToCartButton from "@/components/AddToCartButton";

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


  return (
    <MobileAppShell>
      {/* Tab Title */}
      <div className="bg-[#FFF9E6] px-4 py-2 text-center border-b border-[var(--color-muted)]/10 flex items-center">
        <Link href="/katalog" className="text-[var(--color-charcoal-soft)] hover:text-[var(--color-navy)]">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="flex-1 text-[14px] font-bold text-[var(--color-charcoal)] mr-5">Detail Produk</span>
      </div>

      <div className="flex flex-col bg-[#FFF9E6] min-h-screen pb-24 pt-4">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Main Card */}
          <div className="gsap-reveal card p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

              {/* Product Image */}
              <div className="lg:col-span-6">
                <div className="relative aspect-square sm:aspect-[4/3] rounded-[16px] overflow-hidden bg-[#FFFEF3] border border-[var(--color-muted)]/30 shadow-sm">
                  <Image
                    src={imgUrl}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 tag-filled bg-[var(--color-success)] text-[var(--color-white)] shadow-sm">
                    {product.category.name}
                  </div>
                  {product.spiceLevel && (
                    <div className="absolute top-4 right-4 tag-filled bg-[var(--color-navy)] text-white shadow-sm">
                      <Flame className="w-3.5 h-3.5" />
                      {product.spiceLevel}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="tag-outlined text-[var(--color-charcoal)] border-[var(--color-charcoal)]">
                    {product.category.name}
                  </span>
                  <h1 className="font-display text-[28px] sm:text-[36px] font-semibold text-[var(--color-charcoal)] mt-3 leading-tight">
                    {product.name}
                  </h1>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="tabular-price text-[32px] font-bold text-[var(--color-charcoal)] leading-none">
                    Rp {product.price.toLocaleString("id-ID")}
                  </span>
                  <span className="text-[14px] text-[var(--color-muted)] font-medium uppercase tracking-wide">
                    / Kemasan 100g
                  </span>
                </div>

                <div>
                  {product.isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 text-[var(--color-success)] bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 px-3 py-1.5 rounded-full text-[13px] font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      Stok Tersedia
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[var(--color-error)] bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 px-3 py-1.5 rounded-full text-[13px] font-bold">
                      <AlertCircle className="w-4 h-4" />
                      Stok Habis
                    </span>
                  )}
                </div>

                <div className="pt-4 border-t border-[var(--color-muted)]/30">
                  <h3 className="text-[13px] font-bold text-[var(--color-charcoal-soft)] uppercase tracking-wide mb-2">
                    Deskripsi Produk
                  </h3>
                  <p className="text-[15px] text-[var(--color-charcoal)] leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="bg-[var(--color-cream-soft)] border border-[var(--color-gold)]/60 p-5 rounded-[16px] space-y-3">
                  <h4 className="text-[14px] font-bold text-[var(--color-charcoal)] uppercase tracking-wide flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[var(--color-gold-dark)]" />
                    Informasi Nutrisi & Keunggulan
                  </h4>
                  <ul className="text-[14px] text-[var(--color-charcoal)] space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--color-gold)] font-bold">•</span>
                      Terbuat dari keju berkualitas & tepung kalsium tulang ikan tenggiri.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--color-gold)] font-bold">•</span>
                      Dikemas higienis dengan seal rapat agar kerenyahan tahan lama.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--color-gold)] font-bold">•</span>
                      Asli binaan KLK Kewirausahaan Universitas Bangka Belitung.
                    </li>
                  </ul>
                </div>

                <div className="pt-2 space-y-4">
                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      price: product.price,
                      image: imgUrl,
                      categoryName: product.category.name,
                    }}
                    variant="detail-action"
                    disabled={!product.isAvailable}
                  />

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-[var(--color-muted)]/20"></div>
                    <span className="flex-shrink mx-4 text-[12px] font-bold text-[var(--color-muted)] uppercase tracking-wider">atau</span>
                    <div className="flex-grow border-t border-[var(--color-muted)]/20"></div>
                  </div>

                  <QrisCheckoutButton 
                    productName={product.name}
                    productPrice={product.price}
                    waNumber={waNumber}
                    variant="full"
                    disabled={!product.isAvailable}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileAppShell>
  );
}
