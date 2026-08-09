import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, CheckCircle2, AlertCircle, Layers, Plus, Settings, Flame } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const [totalProducts, availableProducts, outOfStockProducts, categoriesCount, recentProducts] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isAvailable: true } }),
      prisma.product.count({ where: { isAvailable: false } }),
      prisma.category.count(),
      prisma.product.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: { category: true },
      }),
    ]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            Selamat Datang, {session.user?.name}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-2">
            Dashboard Kelola Bon Giri
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Pantau status stok produk dan ubah informasi bisnis dari panel ini.
          </p>
        </div>

        <Link
          href="/admin/produk/tambah"
          className="btn-primary text-xs font-bold px-4 py-2.5 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Tambah Produk Baru
        </Link>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Total Produk
            </span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-neutral-900">{totalProducts}</p>
          <span className="text-[11px] text-neutral-500">Varian terdaftar di katalog</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Stok Ready
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-600">{availableProducts}</p>
          <span className="text-[11px] text-emerald-700 font-medium">Tersedia untuk diorder</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Stok Habis
            </span>
            <div className="p-2 rounded-xl bg-red-100 text-red-700">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-red-600">{outOfStockProducts}</p>
          <span className="text-[11px] text-red-600 font-medium">Nonaktif / Perlu Restok</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Kategori
            </span>
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-neutral-900">{categoriesCount}</p>
          <span className="text-[11px] text-neutral-500">Kategori varian aktif</span>
        </div>
      </div>

      {/* Recent Products Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-neutral-900 text-lg">Aktivitas Produk Terkini</h2>
            <p className="text-xs text-neutral-500">
              Daftar produk yang baru saja ditambahkan atau diperbarui.
            </p>
          </div>
          <Link
            href="/admin/produk"
            className="text-xs font-bold text-amber-700 hover:text-amber-800"
          >
            Lihat Semua →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-400 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Nama Produk</th>
                <th className="py-3.5 px-6">Kategori</th>
                <th className="py-3.5 px-6">Harga</th>
                <th className="py-3.5 px-6">Status Stok</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
              {recentProducts.map((p: any) => (
                <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-neutral-900 flex items-center gap-2">
                    {p.name}
                    {p.spiceLevel && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {p.spiceLevel}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">{p.category.name}</td>
                  <td className="py-4 px-6 font-bold text-amber-700">
                    Rp {p.price.toLocaleString("id-ID")}
                  </td>
                  <td className="py-4 px-6">
                    {p.isAvailable ? (
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold">
                        Ready
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-full text-[10px] font-bold">
                        Habis
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/admin/produk/edit/${p.id}`}
                      className="text-amber-700 hover:underline font-bold"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
