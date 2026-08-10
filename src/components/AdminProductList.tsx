"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit2, Trash2, Plus, Search, Eye, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  spiceLevel: string;
  isAvailable: boolean;
  category: { name: string };
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
  const [deleteTarget, setDeleteTarget] = useState<ProductItem | null>(null);
  const [deleteError, setDeleteError] = useState("");

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

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    if (userRole !== "ADMIN") {
      setDeleteError("Hanya Admin Utama yang berhak menghapus produk secara permanen.");
      return;
    }
    setDeleteError("");
    setLoadingId(deleteTarget.id);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        setDeleteError("Gagal menghapus produk. Coba lagi.");
      }
    } catch {
      setDeleteError("Terjadi kesalahan koneksi server.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#ededed]">Kelola Produk</h1>
          <p className="mt-0.5 text-[12px] text-[#525252]">
            Tambah varian rasa, ubah harga, atau ganti status ketersediaan stok.
          </p>
        </div>
        <Button asChild variant="default" size="sm">
          <Link href="/admin/produk/tambah">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Tambah Produk
          </Link>
        </Button>
      </div>

      {/* Search + count */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#525252] pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk atau kategori..."
            className="pl-9 text-xs h-8"
          />
        </div>
        <span className="shrink-0 text-[11px] text-[#525252]">{filtered.length} produk</span>
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-[#262626] bg-[#1a1a1a] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Varian</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Level Pedas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-[#525252]">
                  Tidak ada produk ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <span className="font-semibold text-[#ededed] line-clamp-1">{p.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-[11px] text-[#737373]">{p.category.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-[12px] font-semibold text-[#a3a3a3]">
                      Rp {p.price.toLocaleString("id-ID")}
                    </span>
                  </TableCell>
                  <TableCell>
                    {p.spiceLevel ? (
                      <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide bg-amber-950/40 text-amber-400 border border-amber-900/40">
                        {p.spiceLevel}
                      </span>
                    ) : (
                      <span className="text-[#3a3a3a]">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <button
                      disabled={loadingId === p.id}
                      onClick={() => toggleAvailability(p.id, p.isAvailable)}
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide border transition-opacity disabled:opacity-50 cursor-pointer hover:opacity-80 ${
                        p.isAvailable
                          ? "bg-emerald-950/50 text-emerald-400 border-emerald-900/50"
                          : "bg-red-950/50 text-red-400 border-red-900/50"
                      }`}
                    >
                      {loadingId === p.id ? "..." : p.isAvailable ? "Ready" : "Habis"}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/katalog/${p.slug}`}
                        target="_blank"
                        className="text-[11px] text-[#525252] hover:text-[#a3a3a3] transition-colors"
                        title="Lihat di katalog"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/produk/edit/${p.id}`}
                        className="text-[11px] text-[#525252] hover:text-[#ededed] transition-colors"
                        title="Edit produk"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      {userRole === "ADMIN" && (
                        <button
                          onClick={() => { setDeleteError(""); setDeleteTarget(p); }}
                          disabled={loadingId === p.id}
                          className="text-[#525252] hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Hapus produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Produk</DialogTitle>
            <DialogDescription>
              Hapus produk{" "}
              <strong className="text-[#ededed]">"{deleteTarget?.name}"</strong> secara permanen?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={!!loadingId}>
              {loadingId ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
