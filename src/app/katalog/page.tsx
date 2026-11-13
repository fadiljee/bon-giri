import { prisma } from "@/lib/prisma";
import KatalogClient from "@/components/storefront/KatalogClient";
import {
  BusinessInfo,
  DEFAULT_BUSINESS_INFO,
  FALLBACK_VARIANTS,
  StorefrontVariant,
  getCutoutImage,
} from "@/data/storefront";

export const revalidate = 60;

const SHORT_NAME_BY_SLUG: Record<string, string> = {
  "stik-keju-tenggiri-original-100g": "Original",
  "stik-keju-tenggiri-pedas-balado-100g": "Pedas Balado",
  "stik-keju-tenggiri-rasa-bbq-100g": "Rasa BBQ",
  "stik-keju-tenggiri-rumput-laut-100g": "Rumput Laut",
};

const SWATCH_BY_SLUG: Record<string, string> = {
  "stik-keju-tenggiri-original-100g": "#d4b46a",
  "stik-keju-tenggiri-pedas-balado-100g": "#b84b39",
  "stik-keju-tenggiri-rasa-bbq-100g": "#7c4a32",
  "stik-keju-tenggiri-rumput-laut-100g": "#3d5740",
};

interface KatalogProps {
  searchParams: Promise<{
    kategori?: string;
    q?: string;
  }>;
}

export default async function KatalogPage({ searchParams }: KatalogProps) {
  const { kategori, q } = await searchParams;

  let variants: StorefrontVariant[] = FALLBACK_VARIANTS;
  let categories = [
    { id: "cat-1", name: "Varian Original", slug: "original" },
    { id: "cat-2", name: "Varian Pedas", slug: "pedas" },
    { id: "cat-3", name: "Spesial Aroma", slug: "spesial-aroma" },
  ];
  let business: BusinessInfo = DEFAULT_BUSINESS_INFO;

  try {
    const [dbCategories, dbProducts, settings] = await Promise.all([
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.product.findMany({
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.businessSetting.findUnique({ where: { id: "default" } }),
    ]);

    if (dbCategories && dbCategories.length > 0) {
      categories = dbCategories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
    }

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
    console.warn("Using fallback catalog data (DB unreachable):", error);
  }

  return (
    <KatalogClient
      variants={variants}
      categories={categories}
      business={business}
      initialCategory={kategori || ""}
      initialQuery={q || ""}
    />
  );
}
