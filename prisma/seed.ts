import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/bon_giri?schema=public";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding PostgreSQL database...");

  // 1. Business Setting
  await prisma.businessSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      whatsappNumber: "6288267018426",
      address: "Pangkalpinang, Kepulauan Bangka Belitung",
      openingHours: "Senin - Sabtu: 08.00 - 17.00 WIB",
      instagramHandle: "stikkeju.bongiri_",
    },
  });

  // 2. Admin & Staff User
  const adminPasswordHash = await bcrypt.hash("adminbongiri123", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@bongiri.com" },
    update: {},
    create: {
      name: "Admin Bon Giri",
      email: "admin@bongiri.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const staffPasswordHash = await bcrypt.hash("staffbongiri123", 10);
  await prisma.user.upsert({
    where: { email: "staff@bongiri.com" },
    update: {},
    create: {
      name: "Staff Penjualan",
      email: "staff@bongiri.com",
      passwordHash: staffPasswordHash,
      role: "STAFF",
    },
  });

  // 3. Categories
  const catOriginal = await prisma.category.upsert({
    where: { slug: "original" },
    update: {},
    create: { name: "Varian Original", slug: "original" },
  });

  const catPedas = await prisma.category.upsert({
    where: { slug: "pedas" },
    update: {},
    create: { name: "Varian Pedas", slug: "pedas" },
  });

  const catAroma = await prisma.category.upsert({
    where: { slug: "spesial-aroma" },
    update: {},
    create: { name: "Spesial Aroma", slug: "spesial-aroma" },
  });

  const products = [
    {
      name: "Stik Keju Ikan Tenggiri Original 100g",
      slug: "stik-keju-tenggiri-original-100g",
      description:
        "Stik keju gurih renyah berbahan dasar keju premium & kalsium tinggi tulang ikan tenggiri khas Bangka Belitung.",
      price: 15000,
      spiceLevel: "Original",
      isAvailable: true,
      categoryId: catOriginal.id,
      createdById: adminUser.id,
      images: [
        {
          url: "/images/products/original.png",
          altText: "Stik Keju Original 100g",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Stik Keju Ikan Tenggiri Pedas Balado 100g",
      slug: "stik-keju-tenggiri-pedas-balado-100g",
      description:
        "Sensasi renyah gurih keju ikan tenggiri berpadu dengan bumbu pedas balado khas yang kaya rempah.",
      price: 10000,
      spiceLevel: "Pedas Sedang",
      isAvailable: true,
      categoryId: catPedas.id,
      createdById: adminUser.id,
      images: [
        {
          url: "/images/products/balado.png",
          altText: "Stik Keju Balado 100g",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Stik Keju Ikan Tenggiri Rasa BBQ 100g",
      slug: "stik-keju-tenggiri-rasa-bbq-100g",
      description:
        "Aroma asap smokey barbeque khas yang dipadukan dengan keju melimpah dan kerenyahan kalsium ikan tenggiri.",
      price: 10000,
      spiceLevel: "Original",
      isAvailable: true,
      categoryId: catOriginal.id,
      createdById: adminUser.id,
      images: [
        {
          url: "/images/products/bbq.png",
          altText: "Stik Keju BBQ 100g",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Stik Keju Ikan Tenggiri Rumput Laut 100g",
      slug: "stik-keju-tenggiri-rumput-laut-100g",
      description:
        "Sensasi umami gurih rumput laut pilihan yang membalur stik keju renyah tinggi nutrisi kalsium.",
      price: 16500,
      spiceLevel: "Original",
      isAvailable: true,
      categoryId: catAroma.id,
      createdById: adminUser.id,
      images: [
        {
          url: "/images/products/rumput-laut.png",
          altText: "Stik Keju Rumput Laut 100g",
          sortOrder: 0,
        },
      ],
    },
  ];

  for (const p of products) {
    const { images, ...productData } = p;
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          ...productData,
          images: {
            deleteMany: {},
            create: images,
          },
        },
      });
    } else {
      await prisma.product.create({
        data: {
          ...productData,
          images: {
            create: images,
          },
        },
      });
    }
  }

  console.log("PostgreSQL database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
