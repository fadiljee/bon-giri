import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminProductForm from "@/components/AdminProductForm";

export default async function AdminTambahProdukPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return <AdminProductForm categories={categories} />;
}
