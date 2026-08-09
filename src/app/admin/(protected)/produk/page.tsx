import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminProductList from "@/components/AdminProductList";

export default async function AdminProdukPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const userRole = (session.user as any)?.role || "STAFF";

  return <AdminProductList initialProducts={products} userRole={userRole} />;
}
