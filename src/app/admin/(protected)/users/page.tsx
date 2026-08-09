import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminUserManagement from "@/components/AdminUserManagement";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const role = (session.user as any)?.role;
  if (role !== "ADMIN") {
    redirect("/admin/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminUserManagement initialUsers={users} />;
}
