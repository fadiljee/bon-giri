import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailClient from "@/components/storefront/ProductDetailClient";
import {
  BusinessInfo,
  DEFAULT_BUSINESS_INFO,
  FALLBACK_VARIANTS,
  StorefrontVariant,
  getCutoutImage,
} from "@/data/storefront";

export const revalidate = 60;

interface ProductDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { slug } = await params;

  let variant: StorefrontVariant | null = null;
  let business: BusinessInfo = DEFAULT_BUSINESS_INFO;

  try {
    const [product, settings] = await Promise.all([
      prisma.product.findUnique({
        where: { slug },
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
        },
      }),
      prisma.businessSetting.findUnique({ where: { id: "default" } }),
    ]);

    if (product) {
      variant = {
        id: product.id,
        slug: product.slug,
        shortName: product.name.replace("Stik Keju Ikan Tenggiri ", "").replace(" 100g", ""),
        fullName: product.name,
        description: product.description,
        price: product.price,
        spiceLevel: product.spiceLevel,
        categoryName: product.category?.name || "Varian",
        image: getCutoutImage(product.slug, product.name, product.images[0]?.url),
        swatchColor: "#3d5740",
        isAvailable: product.isAvailable,
      };
    }

    if (settings) {
      business = {
        whatsappNumber: settings.whatsappNumber || DEFAULT_BUSINESS_INFO.whatsappNumber,
        address: settings.address || DEFAULT_BUSINESS_INFO.address,
        openingHours: settings.openingHours || DEFAULT_BUSINESS_INFO.openingHours,
        instagramHandle: settings.instagramHandle || DEFAULT_BUSINESS_INFO.instagramHandle,
      };
    }
  } catch (error) {
    console.warn("DB unreachable on ProductDetailPage, checking fallback:", error);
  }

  if (!variant) {
    variant = FALLBACK_VARIANTS.find((v) => v.slug === slug) || null;
  }

  if (!variant) {
    notFound();
  }

  return <ProductDetailClient variant={variant} business={business} />;
}
