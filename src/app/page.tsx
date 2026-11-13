import { prisma } from "@/lib/prisma";
import StorefrontClient from "@/components/storefront/StorefrontClient";
import {
  BusinessInfo,
  DEFAULT_BUSINESS_INFO,
  FALLBACK_VARIANTS,
  StorefrontVariant,
} from "@/data/storefront";

export const revalidate = 60;

const SWATCH_BY_SLUG: Record<string, string> = {
  "stik-keju-tenggiri-original-100g": "#d4b46a",
  "stik-keju-tenggiri-pedas-balado-100g": "#b84b39",
  "stik-keju-tenggiri-rasa-bbq-100g": "#7c4a32",
  "stik-keju-tenggiri-rumput-laut-100g": "#3d5740",
};

const SHORT_NAME_BY_SLUG: Record<string, string> = {
  "stik-keju-tenggiri-original-100g": "Original",
  "stik-keju-tenggiri-pedas-balado-100g": "Pedas Balado",
  "stik-keju-tenggiri-rasa-bbq-100g": "Rasa BBQ",
  "stik-keju-tenggiri-rumput-laut-100g": "Rumput Laut",
};

function getCutoutImage(slug: string, name: string, fallbackUrl?: string): string {
  const key = `${slug} ${name}`.toLowerCase();
  if (key.includes("balado") || key.includes("pedas")) {
    return "/images/products/balado-new.png";
  }
  if (key.includes("bbq") || key.includes("barbeque")) {
    return "/images/products/bbq-new.png";
  }
  if (key.includes("rumput") || key.includes("nori") || key.includes("seaweed")) {
    return "/images/products/rumput-new.png";
  }
  if (key.includes("original") || key.includes("keju")) {
    return "/images/products/original-new.png";
  }
  return fallbackUrl || "/images/products/original-new.png";
}

export default async function HomePage() {
  let variants: StorefrontVariant[] = FALLBACK_VARIANTS;
  let business: BusinessInfo = DEFAULT_BUSINESS_INFO;

  try {
    const [dbProducts, settings] = await Promise.all([
      prisma.product.findMany({
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.businessSetting.findUnique({
        where: { id: "default" },
      }),
    ]);

    if (dbProducts && dbProducts.length > 0) {
      variants = dbProducts.map((p) => ({
        id: p.id,
        slug: p.slug,
        shortName:
          SHORT_NAME_BY_SLUG[p.slug] ||
          p.name.replace("Stik Keju Ikan Tenggiri ", "").replace(" 100g", ""),
        fullName: p.name,
        description: p.description,
        price: p.price,
        spiceLevel: p.spiceLevel,
        categoryName: p.category?.name || "Varian",
        image: getCutoutImage(p.slug, p.name, p.images[0]?.url),
        swatchColor: SWATCH_BY_SLUG[p.slug] || "#3d5740",
        isAvailable: p.isAvailable,
      }));
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
    console.warn("Using fallback storefront data (DB unreachable):", error);
  }

  return <StorefrontClient variants={variants} business={business} />;
}
