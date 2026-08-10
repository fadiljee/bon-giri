import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

// ── SVG Area Chart (decorative) ──────────────────────────────────────────────
function AreaChart() {
  // Two smooth overlapping areas — matches visual in reference image
  return (
    <svg
      viewBox="0 0 600 140"
      className="w-full h-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#374151" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#374151" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f2937" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1f2937" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Back area — taller peak */}
      <path
        d="M0,95 C60,75 120,45 180,58 C240,71 300,30 360,42 C420,54 480,25 540,35 L600,38 L600,140 L0,140 Z"
        fill="url(#ag1)"
      />
      {/* Front area — lower, overlapping */}
      <path
        d="M0,118 C60,108 120,90 180,98 C240,106 300,75 360,82 C420,89 480,62 540,68 L600,65 L600,140 L0,140 Z"
        fill="url(#ag2)"
      />
      {/* Stroke line on front area */}
      <path
        d="M0,118 C60,108 120,90 180,98 C240,106 300,75 360,82 C420,89 480,62 540,68 L600,65"
        fill="none"
        stroke="#4b5563"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  badge,
  badgeType,
  desc1,
  desc2,
}: {
  label: string;
  value: string | number;
  badge?: string;
  badgeType?: "positive" | "negative" | "neutral";
  desc1: string;
  desc2: string;
}) {
  const badgeClass =
    badgeType === "positive"
      ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/50"
      : badgeType === "negative"
      ? "bg-red-950/60 text-red-400 border border-red-900/50"
      : "bg-[#1f1f1f] text-[#737373] border border-[#2a2a2a]";

  return (
    <div className="flex min-w-[260px] flex-col justify-between rounded-xl border border-[#262626] bg-[#1a1a1a] p-5 shadow-sm">
      {/* Label + badge row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-widest text-[#525252]">
          {label}
        </span>
        {badge && (
          <span
            className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold ${badgeClass}`}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Large number */}
      <p className="mt-3 font-mono text-4xl font-bold tracking-tight text-[#ededed]">
        {value}
      </p>

      {/* Descriptions */}
      <div className="mt-3 space-y-0.5">
        <p className="text-[12px] font-semibold text-[#a3a3a3]">{desc1}</p>
        <p className="text-[11px] text-[#525252]">{desc2}</p>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const [totalProducts, availableProducts, outOfStockProducts, categoriesCount, recentProducts] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isAvailable: true } }),
      prisma.product.count({ where: { isAvailable: false } }),
      prisma.category.count(),
      prisma.product.findMany({
        take: 8,
        orderBy: { updatedAt: "desc" },
        include: { category: true },
      }),
    ]);

  const availPct =
    totalProducts > 0
      ? `${Math.round((availableProducts / totalProducts) * 100)}%`
      : "0%";

  const outPct =
    totalProducts > 0
      ? `${Math.round((outOfStockProducts / totalProducts) * 100)}%`
      : "0%";

  return (
    <div className="p-6 md:p-8 space-y-6">

      {/* ── Stat Cards (horizontal scroll on mobile) ─────────────────── */}
      <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
        <StatCard
          label="Total Produk"
          value={totalProducts}
          badge="Katalog Aktif"
          badgeType="neutral"
          desc1="Total varian produk terdaftar"
          desc2="Stik keju Bon Giri aktif di database"
        />
        <StatCard
          label="Stok Ready"
          value={availableProducts}
          badge={`↗ ${availPct}`}
          badgeType="positive"
          desc1="Produk tersedia untuk diorder"
          desc2="Siap kirim ke pelanggan"
        />
        <StatCard
          label="Stok Habis"
          value={outOfStockProducts}
          badge={outOfStockProducts > 0 ? `↘ ${outPct}` : "✓ Aman"}
          badgeType={outOfStockProducts > 0 ? "negative" : "positive"}
          desc1={outOfStockProducts > 0 ? "Perlu segera direstok" : "Semua stok aman"}
          desc2="Produk nonaktif di katalog"
        />
        <StatCard
          label="Kategori"
          value={categoriesCount}
          badge="Jenis Varian"
          badgeType="neutral"
          desc1="Kelompok kategori produk"
          desc2="Klasifikasi varian Bon Giri"
        />
      </div>

      {/* ── Total Visitors-style Chart Card ──────────────────────────── */}
      <div className="rounded-xl border border-[#262626] bg-[#1a1a1a] overflow-hidden">
        <div className="flex items-start justify-between px-5 pt-5 pb-3">
          <div>
            <p className="text-[13px] font-semibold text-[#ededed]">
              Distribusi Stok Produk
            </p>
            <p className="mt-0.5 text-[11px] text-[#525252]">
              Proporsi produk ready vs habis dari total katalog
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-[11px] -mt-0.5">
            <Link href="/admin/produk">Kelola Produk →</Link>
          </Button>
        </div>

        {/* Chart area */}
        <div className="h-36 w-full px-0">
          <AreaChart />
        </div>
      </div>

      {/* ── Recent Products Table Card ────────────────────────────────── */}
      <div className="rounded-xl border border-[#262626] bg-[#1a1a1a] overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between border-b border-[#262626] px-5 py-4">
          <div>
            <p className="text-[13px] font-semibold text-[#ededed]">
              Aktivitas Produk Terkini
            </p>
            <p className="mt-0.5 text-[11px] text-[#525252]">
              Produk yang baru ditambahkan atau diperbarui
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-[11px]">
            <Link href="/admin/produk">Lihat Semua →</Link>
          </Button>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Varian</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-[#525252]">
                  Belum ada produk. Tambahkan produk pertama Anda.
                </TableCell>
              </TableRow>
            ) : (
              recentProducts.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#ededed]">{p.name}</span>
                      {p.spiceLevel && (
                        <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide bg-amber-950/40 text-amber-400 border border-amber-900/40">
                          {p.spiceLevel}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[11px] text-[#737373]">{p.category.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-[13px] font-semibold text-[#a3a3a3]">
                      Rp {p.price.toLocaleString("id-ID")}
                    </span>
                  </TableCell>
                  <TableCell>
                    {p.isAvailable ? (
                      <span className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-emerald-950/50 text-emerald-400 border border-emerald-900/50">
                        Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-red-950/50 text-red-400 border border-red-900/50">
                        Habis
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/admin/produk/edit/${p.id}`}
                      className="text-[11px] font-semibold text-[#737373] transition-colors hover:text-[#ededed]"
                    >
                      Edit →
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
