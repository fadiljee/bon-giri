"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit2, Trash2, CheckCircle2, XCircle, Plus, Search, Eye } from "lucide-react";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  spiceLevel: string;
  isAvailable: boolean;
  category: {
    name: string;
  };
  updatedAt: Date;
}

export default function AdminProductList({
  initialProducts,
  userRole,
}: {
  initialProducts: ProductItem[];
  userRole: string;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isAvailable: !currentStatus } : p))
        );
      } else {
        alert("Gagal memperbarui status produk");
      }
    } catch {
      alert("Terjadi kesalahan koneksi server");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (userRole !== "ADMIN") {
      alert("Hanya Admin Utama yang berhak menghapus produk secara permanen.");
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) return;

    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Gagal menghapus produk");
      }
    } catch {
      alert("Terjadi kesalahan koneksi server");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#E0E0E0]"
        style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.06)" }}
      >
        <div>
          {/* Headline §3 */}
          <h1 className="text-[28px] font-bold text-[#1A1A1A] leading-[1.15]">
            Kelola Produk Bon Giri
          </h1>
          <p className="text-[13px] text-[#6B6B6B] mt-1">
            Tambah varian rasa baru, ubah harga, atau ganti status ketersediaan stok.
          </p>
        </div>

        {/* btn-primary §4.1 */}
        <Link href="/admin/produk/tambah" className="btn-primary text-[13px] font-bold px-5 py-2.5">
          <Plus className="w-4 h-4" />
          Tambah Produk Baru
        </Link>
      </div>

      {/* Filter & Search §4.2 */}
      <div
        className="bg-white p-4 rounded-xl border border-[#E0E0E0] flex items-center justify-between gap-4"
        style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.06)" }}
      >
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama produk atau kategori..."
            className="w-full pl-9 pr-4 py-2.5 text-[13px] bg-white border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#FDB813] focus:ring-2 focus:ring-[#FDB813]/20 text-[#1A1A1A] placeholder:text-[#6B6B6B]"
          />
        </div>
        <span className="text-[12px] font-medium text-[#6B6B6B] uppercase tracking-[0.04em] whitespace-nowrap">
          Total: {filtered.length} produk
        </span>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.06)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#FFFEF3] border-b border-[#E0E0E0]">
              <tr>
                <th className="py-4 px-5 text-[11px] font-bold text-[#6B6B6B] uppercase tracking-[0.08em]">
                  Nama Varian
                </th>
                <th className="py-4 px-5 text-[11px] font-bold text-[#6B6B6B] uppercase tracking-[0.08em]">
                  Kategori
                </th>
                <th className="py-4 px-5 text-[11px] font-bold text-[#6B6B6B] uppercase tracking-[0.08em]">
                  Harga
                </th>
                <th className="py-4 px-5 text-[11px] font-bold text-[#6B6B6B] uppercase tracking-[0.08em]">
                  Level Pedas
                </th>
                <th className="py-4 px-5 text-[11px] font-bold text-[#6B6B6B] uppercase tracking-[0.08em]">
                  Status Stok
                </th>
                <th className="py-4 px-5 text-[11px] font-bold text-[#6B6B6B] uppercase tracking-[0.08em] text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E0] text-[#1A1A1A]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#6B6B6B] font-semibold">
                    Tidak ada produk ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FFFEF3] transition-colors">
                    {/* Product Name — subheading semibold */}
                    <td className="py-4 px-5 font-semibold text-[#1A1A1A] max-w-[200px]">
                      <span className="line-clamp-2">{p.name}</span>
                    </td>

                    {/* Category — tag-outlined */}
                    <td className="py-4 px-5">
                      <span className="tag-outlined text-[11px]">
                        {p.category.name}
                      </span>
                    </td>

                    {/* Price — primary-500 */}
                    <td className="py-4 px-5 font-bold text-[#FDB813]">
                      Rp {p.price.toLocaleString("id-ID")}
                    </td>

                    {/* Spice Level — tag-filled or none */}
                    <td className="py-4 px-5">
                      {p.spiceLevel ? (
                        <span className="tag-filled text-[10px]">
                          {p.spiceLevel}
                        </span>
                      ) : (
                        <span className="text-[#A6A6A6]">—</span>
                      )}
                    </td>

                    {/* Stock Toggle — action-btn-olive (available) / red (unavailable) §4.5 */}
                    <td className="py-4 px-5">
                      <button
                        onClick={() => toggleAvailability(p.id, p.isAvailable)}
                        disabled={loadingId === p.id}
                        title="Klik untuk mengubah status stok"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                          p.isAvailable
                            ? "bg-[#4A6B1F]/15 text-[#4A6B1F] hover:bg-[#4A6B1F]/25"
                            : "bg-[#C81E1E]/15 text-[#C81E1E] hover:bg-[#C81E1E]/25"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {p.isAvailable ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Ready Stock
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            Stok Habis
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action Buttons §4.5 — icon 32px bulat */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2 justify-end">
                        {/* View — action-btn-blue */}
                        <Link
                          href={`/katalog/${p.slug}`}
                          target="_blank"
                          className="action-btn-blue"
                          title="Lihat Produk"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* Edit — action-btn-gold */}
                        <Link
                          href={`/admin/produk/edit/${p.id}`}
                          className="action-btn-gold"
                          title="Edit Produk"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        {/* Delete — action-btn-red (ADMIN only) */}
                        {userRole === "ADMIN" && (
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            disabled={loadingId === p.id}
                            className="action-btn-red"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
