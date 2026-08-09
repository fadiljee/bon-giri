import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminSettingsForm from "@/components/AdminSettingsForm";

export default async function AdminPengaturanPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const settings = await prisma.businessSetting.findUnique({
    where: { id: "default" },
  });

  const initialData = {
    whatsappNumber: settings?.whatsappNumber || "6288267018426",
    address: settings?.address || "Pangkalpinang, Kepulauan Bangka Belitung",
    openingHours: settings?.openingHours || "Senin - Sabtu: 08.00 - 17.00 WIB",
    instagramHandle: settings?.instagramHandle || "stikkeju.bongiri_",
  };

  return <AdminSettingsForm initialData={initialData} />;
}
