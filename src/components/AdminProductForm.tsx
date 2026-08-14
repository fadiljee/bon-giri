"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

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
  const [price, setPrice] = useState(initialData?.price || 10000);
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

    try {
      const url = isEditing ? `/api/admin/products/${initialData.id}` : "/api/admin/products";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, price: Number(price), spiceLevel, categoryId, isAvailable, imageUrl }),
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
    <div className="p-6 md:p-8">
      <div className="max-w-2xl space-y-5">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/produk">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Kembali
          </Link>
        </Button>

        <div>
          <h1 className="text-xl font-bold text-[#ededed]">
            {isEditing ? "Edit Produk" : "Tambah Produk Baru"}
          </h1>
          <p className="mt-0.5 text-[12px] text-[#525252]">
            Isi formulir lengkap mengenai varian stik keju Bon Giri.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="rounded-xl border border-[#262626] bg-[#1a1a1a] p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Nama Varian Produk *</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="misal: Stik Keju Tenggiri Pedas Manis 100g"
              />
            </div>

            {/* Kategori + Level Pedas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="categoryId">Kategori *</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="categoryId">
                    <SelectValue placeholder="Pilih kategori..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="spiceLevel">Level Pedas *</Label>
                <Select value={spiceLevel} onValueChange={setSpiceLevel}>
                  <SelectTrigger id="spiceLevel">
                    <SelectValue placeholder="Pilih level..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Original">Original</SelectItem>
                    <SelectItem value="Pedas Sedang">Pedas Sedang</SelectItem>
                    <SelectItem value="Extra Pedas">Extra Pedas</SelectItem>
                    <SelectItem value="Campur">Campur (Combo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Harga + Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="price">Harga (Rp) *</Label>
                <Input
                  id="price"
                  type="number"
                  required
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="isAvailable">Status Stok</Label>
                <div className="flex h-9 items-center gap-3 rounded-md border border-[#2a2a2a] bg-[#161616] px-3">
                  <Switch id="isAvailable" checked={isAvailable} onCheckedChange={setIsAvailable} />
                  <span className={`text-xs font-medium ${isAvailable ? "text-emerald-400" : "text-[#737373]"}`}>
                    {isAvailable ? "Ready Stock" : "Stok Habis"}
                  </span>
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-1.5">
              <Label htmlFor="imageUrl">URL Gambar Produk</Label>
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Deskripsi Produk *</Label>
              <Textarea
                id="description"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan keunikan cita rasa, komposisi, atau berat bersih..."
              />
            </div>

            <Separator />

            <div className="flex items-center justify-end gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/produk">Batal</Link>
              </Button>
              <Button type="submit" disabled={loading} size="sm">
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {loading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Produk"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
