"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, MessageSquare, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { InstagramIcon } from "./InstagramIcon";

interface SettingsProps {
  initialData: {
    whatsappNumber: string;
    address: string;
    openingHours: string;
    instagramHandle: string;
  };
}

export default function AdminSettingsForm({ initialData }: SettingsProps) {
  const router = useRouter();
  const [whatsappNumber, setWhatsappNumber] = useState(initialData.whatsappNumber);
  const [address, setAddress] = useState(initialData.address);
  const [openingHours, setOpeningHours] = useState(initialData.openingHours);
  const [instagramHandle, setInstagramHandle] = useState(initialData.instagramHandle);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsappNumber,
          address,
          openingHours,
          instagramHandle,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || "Gagal menyimpan pengaturan.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
        <div className="mb-6 pb-4 border-b border-neutral-100">
          <h1 className="text-2xl font-extrabold text-neutral-900">
            Pengaturan Usaha & Kontak WA
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Informasi di halaman ini akan langsung memperbarui nomor WhatsApp tujuan order dan kontak di website publik.
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Pengaturan usaha berhasil diperbarui!</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Nomor WhatsApp Tujuan Order *
              </label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="6288267018426"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Gunakan format internasional tanpa tanda tanda plus/spasi (contoh: <strong>6288267018426</strong>).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-600" />
                Alamat Produksi / Usaha *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Pangkalpinang, Kepulauan Bangka Belitung"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                Jam Layanan / Operasional *
              </label>
              <input
                type="text"
                required
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="Senin - Sabtu: 08.00 - 17.00 WIB"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <InstagramIcon className="w-4 h-4 text-pink-600" />
                Username Instagram Usaha *
              </label>
              <input
                type="text"
                required
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="stikkeju.bongiri_"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-xs font-bold px-6 py-2.5 shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-1.5" />
              {loading ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
