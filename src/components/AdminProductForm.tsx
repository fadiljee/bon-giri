"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: CategoryOption[];
  initialData?: {
    id: string;
    name: string;
    description: string;
    price: number;
    spiceLevel: string;
    isAvailable: boolean;
    categoryId: string;
    imageUrl?: string;
  };
}

export default function AdminProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price || 15000);
  const [spiceLevel, setSpiceLevel] = useState(initialData?.spiceLevel || "Original");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || categories[0]?.id || "");
  const [isAvailable, setIsAvailable] = useState(initialData?.isAvailable ?? true);
  const [imageUrl, setImageUrl] = useState(
    initialData?.imageUrl ||
      "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      name,
      description,
      price: Number(price),
      spiceLevel,
      categoryId,
      isAvailable,
      imageUrl,
    };

    try {
      const url = isEditing ? `/api/admin/products/${initialData.id}` : "/api/admin/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/produk");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || "Gagal menyimpan data produk.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/admin/produk"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#6B6B6B] hover:text-[#005B96] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar Produk
      </Link>

      <div
        className="bg-white rounded-xl border border-[#E0E0E0] p-6 sm:p-8"
        style={{ boxShadow: "0 2px 8px rgba(26,26,26,0.06)" }}
      >
        <div className="mb-6 pb-4 border-b border-[#E0E0E0]">
          {/* Headline §3 28px bold */}
          <h1 className="text-[28px] font-bold text-[#1A1A1A] leading-[1.15]">
            {isEditing ? "Edit Varian Produk" : "Tambah Produk Baru"}
          </h1>
          <p className="text-[13px] text-[#6B6B6B] mt-1">
            Isi formulir lengkap mengenai varian stik keju Bon Giri berikut ini.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-[#C81E1E]/10 border border-[#C81E1E]/30 text-[#C81E1E] text-[13px] font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              {/* Label §3: 12px medium uppercase letter-spacing 0.04em */}
              <label className="block text-[12px] font-medium text-[#6B6B6B] uppercase tracking-[0.04em] mb-2">
                Nama Varian Produk *
              </label>
              {/* Input §4.2 */}
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="misal: Stik Keju Tenggiri Pedas Manis 100g"
                className="w-full px-4 py-2.5 bg-white border border-[#E0E0E0] rounded-lg text-[14px] text-[#1A1A1A] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#FDB813] focus:ring-2 focus:ring-[#FDB813]/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-[#6B6B6B] uppercase tracking-[0.04em] mb-2">
                  Kategori Produk *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#E0E0E0] rounded-lg text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#FDB813] focus:ring-2 focus:ring-[#FDB813]/20"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#6B6B6B] uppercase tracking-[0.04em] mb-2">
                  Level Pedas *
                </label>
                <select
                  value={spiceLevel}
                  onChange={(e) => setSpiceLevel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#E0E0E0] rounded-lg text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#FDB813] focus:ring-2 focus:ring-[#FDB813]/20"
                >
                  <option value="Original">Original (Tidak Pedas)</option>
                  <option value="Pedas Sedang">Pedas Sedang</option>
                  <option value="Extra Pedas">Extra Pedas</option>
                  <option value="Campur">Campur (Paket Combo)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-[#6B6B6B] uppercase tracking-[0.04em] mb-2">
                  Harga Kemasan (Rp) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-white border border-[#E0E0E0] rounded-lg text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#FDB813] focus:ring-2 focus:ring-[#FDB813]/20"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#6B6B6B] uppercase tracking-[0.04em] mb-2">
                  Status Ketersediaan Stok
                </label>
                <select
                  value={isAvailable ? "true" : "false"}
                  onChange={(e) => setIsAvailable(e.target.value === "true")}
                  className="w-full px-4 py-2.5 bg-white border border-[#E0E0E0] rounded-lg text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#FDB813] focus:ring-2 focus:ring-[#FDB813]/20"
                >
                  <option value="true">Ready Stock (Tersedia)</option>
                  <option value="false">Stok Habis (Nonaktifkan Order)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#6B6B6B] uppercase tracking-[0.04em] mb-2">
                URL Gambar Produk
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 bg-white border border-[#E0E0E0] rounded-lg text-[14px] text-[#1A1A1A] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#FDB813] focus:ring-2 focus:ring-[#FDB813]/20"
              />
              <p className="text-[12px] text-[#A6A6A6] mt-1.5">
                Masukkan URL foto produk yang valid. Foto akan tampil di katalog utama.
              </p>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#6B6B6B] uppercase tracking-[0.04em] mb-2">
                Deskripsi Lengkap Produk *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan keunikan cita rasa, komposisi, atau berat bersih..."
                className="w-full px-4 py-2.5 bg-white border border-[#E0E0E0] rounded-lg text-[14px] text-[#1A1A1A] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#FDB813] focus:ring-2 focus:ring-[#FDB813]/20 resize-none"
              />
            </div>
          </div>

          {/* Action buttons — btn-primary & btn-secondary §4.1 */}
          <div className="pt-4 border-t border-[#E0E0E0] flex items-center justify-end gap-3">
            {/* btn-secondary §4.1 */}
            <Link
              href="/admin/produk"
              className="btn-secondary text-[13px]"
            >
              Batal
            </Link>
            {/* btn-primary §4.1 */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-[13px] px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {loading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
