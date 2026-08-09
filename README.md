# 🧀 BON GIRI — Stik Keju Tulang Ikan Tenggiri Khas Bangka Belitung

Selamat datang di repositori web **Bon Giri**, platform katalog digital dan portal admin internal untuk produk camilan gurih renyah stik keju berbahan dasar tepung tulang ikan tenggiri tinggi kalsium khas Kepulauan Bangka Belitung. Produk ini merupakan inovasi pangan lokal asli binaan **Kelompok Laboratorium Kewirausahaan (KLK) Universitas Bangka Belitung (UBB)**.

---

## 🌟 Fitur Utama

### 🛒 Halaman Publik (Pelanggan)
- **Beranda (Hero Section)**: Tampilan visual interaktif dengan animasi smooth scroll, trust badges, dan varian favorit.
- **Katalog Produk Digital**: Fitur pencarian realtime, filter varian rasa (Original, Pedas Balado, BBQ, Rumput Laut), serta detail harga & stok.
- **Detail Produk**: Informasi lengkap komposisi, manfaat nutrisi kalsium tulang ikan, serta tombol **Direct Order WhatsApp**.
- **Tentang Bon Giri**: Kisah latar belakang usaha, inovasi pengolahan limbah tulang ikan tenggiri, dan standar kualitas UBB.
- **Kontak & Pemesanan**: Informasi alamat usaha, jam operasional, tautan media sosial, serta fitur kirim pesan WhatsApp otomatis.

### 🛡️ Portal Admin Internal (`/admin`)
- **Login Portal Dedicated**: Tampilan login modern *full-screen* aman untuk pengurus usaha.
- **Dashboard Ringkasan**: Statistik total produk, status stok, dan kontrol cepat.
- **Manajemen Produk**: Tambah produk baru, ubah harga/deskripsi/kategori, unggah gambar, serta ubah status ketersediaan (*In Stock / Out of Stock*).
- **Pengaturan Usaha**: Ubah nomor WhatsApp pemesanan, alamat fisik toko, jam buka, dan tautan Instagram secara realtime.
- **Otentikasi Multi-Role**: Dukungan akses peran **ADMIN** (Akses penuh) dan **STAFF** (Manajemen produk & persediaan).

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling & Design System**: [Tailwind CSS v4](https://tailwindcss.com/) dengan palet warna *Artisanal Crunch*
- **Tipografi**: [Montserrat](https://fonts.google.com/specimen/Montserrat) (Teks Utama) & [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (Judul / Display)
- **Animasi & Smooth Scroll**: [GSAP (ScrollTrigger)](https://gsap.com/) + [Lenis Smooth Scroll](https://lenis.darkroom.engineering/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM 7](https://www.prisma.io/)
- **Otentikasi**: [NextAuth.js](https://next-auth.js.org/) + `bcryptjs`
- **Ikon UI**: [Lucide React](https://lucide.dev/)

---

## 🚀 Panduan Instalasi & Menjalankan Lokal

### 1. Prasyarat
Pastikan perangkat Anda telah terpasang:
- **Node.js**: v18.0.0 atau yang lebih baru
- **PostgreSQL**: Server PostgreSQL aktif pada port `5432`

### 2. Kloning Repositori & Install Dependencies
```bash
git clone https://github.com/fadiljee/bon-giri.git
cd bon-giri
npm install
```

### 3. Konfigurasi Environment (`.env`)
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan kredensial PostgreSQL Anda pada `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bon_giri?schema=public"
NEXTAUTH_SECRET="bon-giri-secret-key-super-secure-2026"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Setup Database & Seeding
Atur pengguna PostgreSQL & buat database (jika belum ada):
```bash
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
sudo -u postgres createdb bon_giri
```
Jalankan migrasi skema Prisma dan seeding data awal:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 5. Jalankan Server Pengembang (Development)
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## 🔑 Kredensial Login Portal Admin Default

Setelah menjalankan perintah `npx tsx prisma/seed.ts`, Anda dapat masuk ke Portal Admin di [http://localhost:3000/admin/login](http://localhost:3000/admin/login) dengan akun berikut:

| Peran | Email | Password | Akses |
| :--- | :--- | :--- | :--- |
| **Admin Utama** | `admin@bongiri.com` | `adminbongiri123` | Akses Penuh (Dashboard, Produk, Settings, Users) |
| **Staff Penjualan** | `staff@bongiri.com` | `staffbongiri123` | Kelola Katalog Produk & Stok |

---

## 📁 Struktur Direktori Proyek

```text
bon-giri/
├── PRD/                      # Dokumen PRD & Spesifikasi Desain UI
├── prisma/                   # Skema database & script seed PostgreSQL
│   ├── schema.prisma
│   └── seed.ts
├── public/                   # Asset gambar produk, logo, dan favicon
│   ├── favicon.ico
│   ├── icon.png
│   └── images/
│       ├── logo.png
│       └── products/
├── src/
│   ├── app/                  # Next.js App Router (Pages & API Routes)
│   │   ├── admin/            # Portal Admin Internal (/admin)
│   │   ├── api/              # API Routes (NextAuth & Admin API)
│   │   ├── katalog/          # Halaman Katalog Produk
│   │   ├── kontak/           # Halaman Kontak & Informasi WA
│   │   ├── tentang/          # Halaman Profile Usaha
│   │   ├── globals.css       # Tailwind v4 Design System & Token Warna
│   │   └── layout.tsx        # Root Layout & Tipografi
│   ├── components/           # Komponen UI (Navbar, Footer, SmoothScroll, dll)
│   └── lib/                  # Klien Prisma & Konfigurasi NextAuth
├── .env.example              # Templat variabel lingkungan
├── .gitignore                # Aturan pembatasan commit Git
├── package.json              # Manifes npm & script build
└── README.md                 # Dokumentasi Resmi Proyek
```

---

## 📜 Lisensi & Hak Cipta

© 2026 **Bon Giri** — Kelompok Laboratorium Kewirausahaan (KLK) Universitas Bangka Belitung. Seluruh Hak Cipta Dilindungi Undang-Undang.
