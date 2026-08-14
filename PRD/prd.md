# PRD — Website Katalog & Admin Panel Bon Giri Stik Keju

**Versi:** 2.1 (Update: Integrasi QRIS pada Alur Checkout)  
**Tanggal:** 14 Agustus 2026  
**Pemilik Produk:** Tim Bon Giri (KLK Kewirausahaan UBB)  
**Status:** Terimplementasi & Aktif — Dalam Pengembangan Fitur QRIS  

---

## 0. Changelog

| Versi | Tanggal | Perubahan |
|---|---|---|
| 2.0 | 10 Agustus 2026 | Rilis awal — Katalog Publik & Admin Panel Next.js. |
| 2.1 | 14 Agustus 2026 | Menambahkan **Integrasi QRIS** pada alur pemesanan (tampilan QRIS statis DANA Bisnis di web + penyesuaian format pesan WhatsApp otomatis agar menyertakan konfirmasi pembayaran). Tidak ada payment gateway otomatis — pembayaran tetap divalidasi manual oleh Admin/Staff melalui aplikasi mobile. |

---

## 1. Latar Belakang & Tujuan

Bon Giri adalah UMKM kuliner khas Bangka Belitung yang memproduksi stik keju gurih renyah berbahan dasar kalsium dari tepung tulang ikan tenggiri. Sebelumnya, pemasaran dan penjualan hanya mengandalkan akun Instagram (`@stikkeju.bongiri_`) serta transaksi manual via WhatsApp. 

Website ini dibangun untuk:
1. Menyediakan **katalog produk digital** yang rapi, cepat, dan independen tanpa ketergantungan pada algoritma media sosial.
2. Mempercepat dan mengotomatisasi **alur pemesanan via WhatsApp** dengan pesan awal terformat otomatis berisi nama produk, jumlah, dan total harga.
3. Memberikan **Panel Admin Internal** yang modern, aman, dan mudah digunakan oleh tim usaha untuk mengelola katalog, stok, pengguna staff, dan pengaturan bisnis secara mandiri.

### 1.1 Tujuan Bisnis
- Meningkatkan rasio konversi pengunjung dari hanya "melihat katalog" menjadi "kirim chat order WhatsApp".
- Memperkuat branding profesional Bon Giri sebagai oleh-oleh khas Bangka Belitung berkualitas tinggi.
- Memudahkan pengelolaan operasional harian (restok, penambahan varian rasa baru) tanpa memerlukan bantuan pengembang (developer-free content management).

### 1.2 Tujuan Produk
- **Portal Publik**: Fast-loading, SEO-optimized, mobile-first e-commerce catalog.
- **Panel Admin**: Full-featured dark mode dashboard berbasis shadcn/ui & Radix UI primitives.
- **WhatsApp Direct Order Engine**: Konversi klik produk langsung menjadi pesan siap kirim di aplikasi WhatsApp customer.

---

## 2. Target Pengguna & Role

| Persona | Role System | Deskripsi & Hak Akses |
|---|---|---|
| **Pembeli / Pengunjung** | *Public User* | Mengakses katalog rasa, mencari/memfilter produk, melihat detail varian, dan melakukan pemesanan via WhatsApp. |
| **Admin Utama** | `ADMIN` | Pemilik usaha/Manajer. Akses penuh ke seluruh fitur: CRUD Produk, Hapus Produk Permanen, Pengaturan Nomor WA & Bisnis, serta Manajemen Pengguna Staff. |
| **Staff Pengelola** | `STAFF` | Karyawan operasional. Dapat menambah/mengedit data produk & mengubah status stok. **Dilarang** menghapus produk permanen dan tidak dapat mengakses manajemen user staff. |

---

## 3. Lingkup Sistem (Scope & Features)

### 3.1 Portal Publik (Public Front-End)
- **Beranda (Home Page)**:
  - Hero Section dengan CTA pemesanan dan highlight nilai tambah produk (Kalsium Ikan Tenggiri, Bebas Pengawet, Halal).
  - Grid Produk Unggulan (Featured Items).
  - Banner Cerita Produk & Testimoni Pelanggan.
- **Katalog Rasa (`/katalog`)**:
  - Filter interaktif berdasarkan Kategori (Original, Pedas Sedang, Extra Pedas, Combo Paket).
  - Search bar pencarian nama varian secara *real-time*.
  - Indikator ketersediaan stok (*Ready Stock* vs *Stok Habis*).
  - Quick View Modal & Halaman Detail Produk (`/katalog/[slug]`).
  - Tombol **"Pesan via WhatsApp"** yang memicu URL `wa.me` dengan teks pesan dinamis.
- **Alur Checkout QRIS (`Fitur Baru`)**:
  - Saat pembeli mengklik tombol **"Pesan"**, sistem menampilkan **Modal/Section Pembayaran QRIS** sebelum diarahkan ke WhatsApp.
  - Modal menampilkan **gambar QRIS statis DANA Bisnis** milik Bon Giri, ringkasan pesanan (nama produk, qty, total harga), dan instruksi langkah pembayaran.
  - Instruksi ditampilkan secara jelas: *"Setelah scan QRIS dan transfer, kirim bukti transfer & detail pesanan Anda melalui tombol WhatsApp di bawah."*
  - Tombol **"Sudah Bayar, Kirim ke WhatsApp"** meneruskan pembeli ke `wa.me` dengan teks pesan otomatis yang sudah menyertakan konfirmasi pembayaran (lihat format pada F3 di bagian 6.1).
  - Tidak ada proses payment gateway otomatis (tanpa API pembayaran pihak ketiga) — validasi pembayaran QRIS dilakukan **manual oleh Admin/Staff** melalui aplikasi DANA Bisnis dan dicatat di Aplikasi Mobile (lihat `prd-aplikasi.md`, Modul 3).
  - Gambar QRIS disimpan sebagai aset statis (folder `public/`) atau di **Supabase Storage** (bucket `business-assets`) agar dapat diperbarui oleh Admin melalui Modul Pengaturan Bisnis di aplikasi mobile tanpa perlu deploy ulang web.
- **Tentang Kami (`/tentang`)**:
  - Profil usaha Bon Giri, latar belakang pemanfaatan kalsium tulang ikan tenggiri, dan standar kualitas.
- **Kontak & Lokasi (`/kontak`)**:
  - Informasi alamat produksi, jam operasional, link Instagram resmi, dan tombol WhatsApp langsung.

### 3.2 Panel Admin Internal (`/admin`)
- **Sistem Autentikasi (`/admin/login`)**:
  - Form login terproteksi NextAuth.js berbasis Credentials (Email & Password di-hash menggunakan `bcryptjs`).
  - Desain Dark Mode konsisten dengan visual dashboard.
- **Dashboard Overview (`/admin/dashboard`)**:
  - **Stat Cards**: Total Produk, Stok Ready, Stok Habis, dan Jumlah Kategori dengan font monospace & badge persentase/indikator tren (`↗ %`, `↘ %`).
  - **Distribusi Stok Area Chart**: Grafik area bertumpuk (SVG multi-layer) untuk pemantauan proporsi stok.
  - **Tabel Aktivitas Terkini**: Ringkasan 5–8 produk yang terakhir ditambahkan atau diperbarui.
- **Manajemen Produk (`/admin/produk`)**:
  - Tabel produk komprehensif dengan pencarian, filter, dan tombol aksi (Lihat di Katalog, Edit, Hapus).
  - Form Tambah/Edit Produk (`/admin/produk/tambah` & `/admin/produk/edit/[id]`): Input nama, kategori (`Select`), level pedas (`Select`), harga, status stok (`Switch`), URL foto produk, dan deskripsi (`Textarea`).
  - Modal Konfirmasi Hapus (`Dialog` Radix UI) terproteksi hak akses role `ADMIN`.
- **Pengaturan Usaha (`/admin/pengaturan`)**:
  - Pengubahan dinamis nomor WhatsApp tujuan order, alamat produksi, jam layanan, dan username Instagram. Update langsung berdampak ke portal publik secara *real-time*.
- **Manajemen Staff (`/admin/users`)**:
  - Khusus role `ADMIN`: Membuat akun staff baru dan melihat daftar pengguna internal terdaftar.

---

## 4. Arsitektur & Tech Stack

| Komponen | Teknologi | Keterangan & Implementasi |
|---|---|---|
| **Framework** | **Next.js 16** (App Router, Turbopack) | Server & Client Components terpisah, Server Actions & API Routes |
| **Bahasa** | **TypeScript 5** | Strict type definitions untuk model Prisma, NextAuth, dan Props |
| **Styling** | **Tailwind CSS v4** | CSS Variables (`globals.css`), `@theme` rules, HSL-based color tokens |
| **UI Components** | **shadcn/ui** + **Radix UI** | Primitives: `@radix-ui/react-dialog`, `dropdown-menu`, `tabs`, `select`, `switch`, `avatar`, `label`, `tooltip`, `scroll-area`, `separator`, `slot` |
| **Database** | **PostgreSQL** (Prisma ORM 6) | Produksi: Supabase/Neon PostgreSQL via `@prisma/adapter-pg` & `pg` pool. Dev: SQLite fallback |
| **Autentikasi** | **NextAuth.js v4** | Credentials Provider, JWT session strategy, Middleware route protection |
| **Iconography** | **Lucide React** | Line icons modern dengan stroke-width konsisten |

---

## 5. Model Data (Prisma Schema)

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String   // Hashed with bcryptjs (salt rounds = 10)
  role      Role     @default(STAFF) // ADMIN | STAFF
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Category {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String
  price       Int
  spiceLevel  String   // Original, Pedas Sedang, Extra Pedas, Campur
  isAvailable Boolean  @default(true)
  imageUrl    String?
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model BusinessSetting {
  id              String   @id @default("default")
  whatsappNumber  String
  address         String
  openingHours    String
  instagramHandle String
  updatedAt       DateTime @updatedAt
}

enum Role {
  ADMIN
  STAFF
}
```

---

## 6. Kebutuhan Fungsional & Status Implemetasi

### 6.1 Portal Publik
| ID | Kebutuhan | Status | Implementasi |
|---|---|---|---|
| F1 | Tampilan katalog produk dengan foto, harga, & deskripsi | ✅ Terpasang | `/katalog` & `/katalog/[slug]` |
| F2 | Filter kategori & pencarian kata kunci | ✅ Terpasang | Real-time Client State Filtering |
| F3 | Tombol "Pesan via WhatsApp" dengan pesan terformat | ✅ Terpasang | Auto-generated `https://wa.me/{number}?text=...` |
| F3a | Modal/Section QRIS sebelum checkout WhatsApp | 🆕 Dalam Pengembangan | Menampilkan QRIS DANA Bisnis + instruksi bayar sebelum redirect ke WA |
| F3b | Format pesan WhatsApp menyertakan konfirmasi pembayaran QRIS | 🆕 Dalam Pengembangan | Contoh: *"Halo Bon Giri, saya ingin memesan [Nama Produk]. Total Rp[Harga]. Saya sudah melakukan pembayaran via QRIS, berikut bukti pembayarannya: [Link Foto/Lampiran]."* |
| F4 | Indikator status stok "Ready" vs "Stok Habis" | ✅ Terpasang | Dynamic Badge & Disabled Order Button jika habis |
| F5 | Halaman Profil & Kontak Dinamis | ✅ Terpasang | Diambil dari tabel `BusinessSetting` DB |

### 6.2 Panel Admin
| ID | Kebutuhan | Status | Implementasi |
|---|---|---|---|
| F6 | Login Credentials & Proteksi Router | ✅ Terpasang | `/admin/login` & NextAuth Middleware |
| F7 | Dashboard Statistik & Grafik Stok | ✅ Terpasang | Stat Cards + Monospace Numbers + SVG Area Chart |
| F8 | CRUD Produk Lengkap | ✅ Terpasang | Modal Dialog Radix, Form Select, Switch |
| F9 | Restriksi Hak Akses Staff (Dilarang Hapus) | ✅ Terpasang | RBAC Enforcement di API & UI |
| F10 | Pengaturan Usaha (WA, Alamat, IG, Jam) | ✅ Terpasang | `/admin/pengaturan` API Update |
| F11 | Manajemen Pengguna Staff | ✅ Terpasang | `/admin/users` (Khusus ADMIN) |

---

## 7. Desain & Estetika Sistem

Sistem mengadopsi **Dual-Theme Design System**:
1. **Portal Publik (Artisanal Crunch - Light Theme)**:
   - Dominan Krem (`#FFFDD0`), Kuning Keemasan (`#FDB813`), Biru Bahari (`#005B96`), dan Hitam Arang (`#1A1A1A`). Memberikan kesan hangat, higienis, dan terpercaya.
2. **Panel Admin (Obsidian Developer Dark Mode)**:
   - Terinspirasi oleh dashboard developer modern (Vercel/Linear).
   - Latar utama obsidian (`#0f0f0f`), Sidebar (`#111111`), Card/Modal (`#1a1a1a`), dan Border mikro (`#1f1f1f` / `#262626`).
   - Aksesibilitas kontras tinggi (`#ededed` untuk teks utama, `#525252` & `#737373` untuk label/subteks).

---

## 7.1 Catatan Arsitektur — Efisiensi Web tanpa Payment Gateway

Karena tidak ada integrasi payment gateway otomatis (Midtrans, Xendit, dll), website tetap ringan dan *fast-loading*:
- QRIS ditampilkan sebagai **gambar statis** (bukan QRIS dinamis generate-per-transaksi), sehingga tidak memerlukan API call ke penyedia pembayaran.
- Satu-satunya kebutuhan tambahan adalah penyimpanan 1 aset gambar QRIS (di `public/` atau Supabase Storage) dan sedikit state UI untuk modal checkout.
- Validasi status "sudah dibayar" sepenuhnya berada di sisi manusia (Admin/Staff mengecek DANA Bisnis) dan dicatat di Aplikasi Mobile — bukan tanggung jawab website.

---

## 8. Verifikasi & Performa Build

- **Next.js Production Build**: `npm run build` lulus 100% tanpa error TypeScript maupun Linting.
- **Rute Tergenerasi**: 18 rute terkompilasi sempurna (Static & Dynamic SSR).
- **Keamanan**: Password di-hash menggunakan `bcryptjs`, API admin terproteksi sesi server-side NextAuth, dan restriksi role terverifikasi di level backend API route.