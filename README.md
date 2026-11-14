# Bon Giri

Etalase web untuk **Bon Giri**, produk stik keju berbahan tepung tulang ikan tenggiri dari Pangkalpinang, Kepulauan Bangka Belitung, binaan Kelompok Laboratorium Kewirausahaan (KLK) Universitas Bangka Belitung.

Aplikasi ini menampilkan empat varian produk (Original, Pedas Balado, Rasa BBQ, dan Rumput Laut) dalam ukuran kemasan 100 g, 300 g, dan 500 g, lalu meneruskan ringkasan pesanan langsung ke WhatsApp.

## Arsitektur Halaman & Fitur

Halaman utama (`/`) disusun sebagai alur satu halaman dengan lima bagian berurutan dan laci keranjang geser (*slide-over bag drawer*):

1. `#hero` menampilkan foto kemasan dengan kemiringan 3D mengikuti kursor, latar kontur topografi prosedural berbasis WebGL2 (`HeroCanvas`), serta tombol pemilih varian yang langsung menyinkronkan warna dan produk aktif di bagian pemesanan.
2. `#showcase` mengunci layar selama guliran (`GSAP ScrollTrigger`) untuk membuka empat foto varian secara berurutan dari kanan ke kiri, dilengkapi navigasi titik (*stage dots*) di sudut bawah.
3. `#thermal` menyediakan penggeser interaktif yang dapat ditarik dengan kursor, sentuhan jari, atau tombol panah papan ketik untuk membandingkan bahan mentah tulang ikan tenggiri dengan hasil akhir stik keju.
4. `#craft` menyusun tiga kartu berisi rincian pengolahan, standar produksi, dan kanvas wireframe berputar 2D (`SpecsCanvas`).
5. `#order` memuat konfigurator varian rasa dan paket ukuran (1 bungkus 100 g, 3 bungkus 300 g, atau 5 bungkus 500 g), menghitung total harga dalam Rupiah secara langsung, menyimpan keranjang di `localStorage`, dan menyusun pesan pemesanan ke WhatsApp.

Selain halaman utama, repositori ini mencakup rute berikut:

- `/katalog` dan `/katalog/[slug]` untuk daftar produk, pencarian, penyaringan kategori, serta halaman rincian tiap varian.
- `/cart`, `/favorit`, `/pesanan`, dan `/profil` untuk keranjang belanja, produk tersimpan, dan riwayat pesanan di peramban pengguna.
- `/tentang` dan `/kontak` untuk profil usaha KLK Universitas Bangka Belitung, jam operasional, lokasi di Pangkalpinang, dan kontak pemesanan.
- `/api/auth/[...nextauth]` untuk endpoint otentikasi NextAuth berbasis kredensial PostgreSQL.

Seluruh halaman mendukung peralihan tema terang dan gelap (`data-theme="light"` dan `data-theme="dark"`) serta menghormati preferensi `prefers-reduced-motion: reduce` dengan mematikan animasi gulir dan loop shader.

## Tumpukan Teknologi

- Next.js 16.3 (App Router) dan React 19.2 dengan TypeScript 5
- Tailwind CSS v4 dan CSS custom properties (spesifikasi lengkap ada di `design.md`)
- GSAP 3.15 (`ScrollTrigger`) dan Lenis 1.3 untuk kontrol gulir
- WebGL2 dan HTML5 Canvas 2D untuk grafis latar prosedural tanpa pustaka 3D eksternal
- PostgreSQL dan Prisma ORM 7.9 (`@prisma/adapter-pg`) dengan data cadangan statis otomatis (`src/data/storefront.ts`) bila database sedang tidak terhubung
- NextAuth.js v4 dan `bcryptjs` untuk otentikasi
- Radix UI dan Lucide React untuk komponen antarmuka dan ikon

## Menjalankan Secara Lokal

### Prasyarat

- Node.js v18 atau lebih baru
- PostgreSQL (opsional untuk sekadar menjalankan tampilan depan, karena halaman utama dan katalog memiliki data cadangan di `src/data/storefront.ts`)

### 1. Pasang Dependensi

```bash
git clone https://github.com/fadiljee/bon-giri.git
cd bon-giri
npm install
```

### 2. Atur Variabel Lingkungan

Salin `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Isi variabel di dalam `.env` sesuai konfigurasi PostgreSQL lokal atau Supabase Anda:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bon_giri?schema=public"
NEXTAUTH_SECRET="ganti-dengan-secret-acak"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Siapkan Database dan Data Awal

Jika menggunakan PostgreSQL lokal, dorong skema Prisma dan jalankan skrip *seed* untuk mengisi 4 varian produk, 3 kategori, pengaturan toko, serta akun awal:

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

Jika menggunakan Supabase, ganti `DATABASE_URL` di `.env` dengan URI *Transaction Pooler* (port `6543`) dari dasbor Supabase Anda sebelum menjalankan kedua perintah di atas.

### 4. Jalankan Server Pengembangan

```bash
npm run dev
```

Buka `http://localhost:3000` di peramban.

## Akun Awal Database (Seed)

Skrip `prisma/seed.ts` membuat dua akun berikut di tabel `User`:

| Peran | Email | Kata Sandi |
| :--- | :--- | :--- |
| `ADMIN` | `admin@bongiri.com` | `adminbongiri123` |
| `STAFF` | `staff@bongiri.com` | `staffbongiri123` |

## Struktur Direktori

```text
bon-giri/
├── prisma/
│   ├── schema.prisma         # Skema PostgreSQL (User, Product, Category, SalesTransaction, dll.)
│   └── seed.ts               # Skrip pengisi data awal produk dan akun
├── public/
│   └── images/               # Foto produk (.webp dan cutout .png) serta logo
├── src/
│   ├── app/                  # Rute Next.js App Router (/, /katalog, /cart, /favorit, /pesanan, /profil, /tentang, /kontak)
│   ├── components/
│   │   └── storefront/       # Komponen etalase utama (StorefrontClient, HeroCanvas, SpecsCanvas, BagDrawer, dll.)
│   ├── context/              # CartContext untuk pengelolaan keranjang, favorit, dan sesi lokal
│   ├── data/
│   │   └── storefront.ts     # Data produk cadangan, opsi paket, dan informasi toko
│   └── lib/                  # Inisialisasi Prisma, konfigurasi NextAuth, dan riwayat pesanan
├── design.md                 # Spesifikasi sistem desain, token warna, tipografi, dan koreografi animasi
├── PRD.md                    # Dokumen kebutuhan produk (Product Requirements Document)
└── package.json
```

## Lisensi

Hak cipta 2026 Bon Giri, Kelompok Laboratorium Kewirausahaan (KLK) Universitas Bangka Belitung.
