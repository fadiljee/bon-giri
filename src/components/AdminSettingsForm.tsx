"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, MessageSquare, MapPin, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { InstagramIcon } from "./InstagramIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

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
        body: JSON.stringify({ whatsappNumber, address, openingHours, instagramHandle }),
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
    <div className="p-6 md:p-8">
      <div className="max-w-2xl space-y-5">
        <div>
          <h1 className="text-xl font-bold text-[#ededed]">Pengaturan Usaha</h1>
          <p className="mt-0.5 text-[12px] text-[#525252]">
            Perbarui informasi kontak WhatsApp dan detail usaha yang tampil di website publik.
          </p>
        </div>

        {success && (
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription className="font-semibold">
              Pengaturan berhasil disimpan!
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-semibold">{error}</AlertDescription>
          </Alert>
        )}

        <div className="rounded-xl border border-[#262626] bg-[#1a1a1a] p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="wa-number" className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                Nomor WhatsApp Tujuan Order *
              </Label>
              <Input
                id="wa-number"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="6288267018426"
              />
              <p className="text-[10px] text-[#525252]">
                Format internasional tanpa + atau spasi (contoh: <span className="text-[#737373]">6288267018426</span>).
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address" className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#525252]" />
                Alamat Usaha *
              </Label>
              <Input
                id="address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Pangkalpinang, Kepulauan Bangka Belitung"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="opening-hours" className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#525252]" />
                Jam Operasional *
              </Label>
              <Input
                id="opening-hours"
                required
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="Senin - Sabtu: 08.00 - 17.00 WIB"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="instagram" className="flex items-center gap-1.5">
                <InstagramIcon className="w-3.5 h-3.5 text-[#525252]" />
                Username Instagram *
              </Label>
              <Input
                id="instagram"
                required
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="stikkeju.bongiri_"
              />
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button type="submit" disabled={loading} size="sm">
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {loading ? "Menyimpan..." : "Simpan Pengaturan"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
