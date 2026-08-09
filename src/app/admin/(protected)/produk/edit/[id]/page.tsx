import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminProductForm from "@/components/AdminProductForm";

interface EditProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProdukPage({ params }: EditProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { take: 1 } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) {
    notFound();
  }

  const initialData = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    spiceLevel: product.spiceLevel,
    isAvailable: product.isAvailable,
    categoryId: product.categoryId,
    imageUrl: product.images[0]?.url,
  };

  return <AdminProductForm categories={categories} initialData={initialData} />;
}
