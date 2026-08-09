# PRD — Website Katalog Bon Giri Stik Keju

**Versi:** 1.0
**Tanggal:** 9 Agustus 2026
**Pemilik Produk:** Tim Bon Giri (KLK Kewirausahaan UBB)
**Status:** Draft untuk review

---

## 1. Latar Belakang & Tujuan

Bon Giri adalah UMKM produk stik keju berbahan dasar tulang ikan tenggiri, berbasis di Bangka Belitung. Saat ini penjualan berjalan lewat Instagram (@stikkeju.bongiri_) dan order manual via WhatsApp. Website ini dibangun untuk:

1. Memberi katalog produk yang rapi dan mudah diakses tanpa bergantung pada algoritma media sosial.
2. Mempercepat proses order — pengunjung memilih produk, langsung terhubung ke WhatsApp dengan pesan yang sudah terisi otomatis.
3. Memberi tim internal panel admin untuk mengelola produk (tambah/edit/hapus, update stok) tanpa bantuan developer.

### 1.1 Tujuan Bisnis
- Meningkatkan konversi dari "lihat produk" ke "chat order" dibanding proses manual saat ini.
- Membangun citra profesional untuk mendukung ekspansi pasar di luar Bangka Belitung.

### 1.2 Tujuan Produk
- Katalog produk publik yang cepat, mobile-first.
- Panel admin internal untuk tim mengelola konten sendiri.
- Alur order tanpa checkout (WhatsApp-based), dengan opsi upgrade ke checkout penuh di masa depan (out of scope v1).

---

## 2. Target Pengguna

| Persona | Deskripsi | Kebutuhan Utama |
|---|---|---|
| Pembeli | Pengguna Instagram/Google yang mencari camilan lokal | Lihat varian rasa, harga, lalu order cepat via WA |
| Admin/Owner | Pemilik usaha | Kontrol penuh: produk, harga, user staff, lihat statistik dasar |
| Staff | Karyawan yang input data produk sehari-hari | Tambah/edit produk & stok, tanpa akses pengaturan sensitif |

---

## 3. Lingkup (Scope)

### 3.1 Termasuk (In Scope — v1)
- Halaman publik: Beranda, Katalog, Detail Produk, Tentang, Kontak
- Order via tombol "Pesan" → deep link WhatsApp (`wa.me`) dengan pesan otomatis
- Panel admin (login) untuk kelola produk, kategori, dan status stok
- Manajemen user dengan 2 role: **Admin** dan **Staff**
- Upload & kelola gambar produk
- Responsive penuh (mobile-first, karena mayoritas pengunjung dari HP)
- SEO dasar (meta tag, sitemap, open graph untuk share ke sosial media)

### 3.2 Tidak Termasuk (Out of Scope — v1)
- Checkout & pembayaran online (masih via WA manual)
- Sistem pengiriman otomatis / ongkir kalkulasi
- Program loyalitas/membership pembeli
- Multi-bahasa
- Aplikasi mobile native

*(Checkout online bisa jadi v2 jika volume order sudah signifikan.)*

---

## 4. Tech Stack

| Layer | Pilihan | Alasan |
|---|---|---|
| Framework | **Next.js 15** (App Router) | SSR/SSG untuk SEO bagus, satu codebase untuk halaman publik + admin |
| Bahasa | TypeScript | Type-safety, mengurangi bug terutama di form admin |
| Database | **PostgreSQL** | Relasional, cocok untuk data produk-kategori-user yang terstruktur |
| ORM | Prisma | Migrasi schema mudah, type-safe query ke Postgres |
| Hosting DB | Supabase atau Neon (Postgres terkelola) | Gratis untuk skala UMKM, backup otomatis |
| Hosting App | Vercel | Deploy langsung dari Next.js, gratis untuk trafik skala UMKM |
| Autentikasi | NextAuth.js (Auth.js) — credentials/email login | Cukup untuk 2 role internal (admin/staff), tanpa perlu login sosial pembeli |
| Penyimpanan gambar | Vercel Blob atau Supabase Storage | Upload foto produk langsung dari panel admin |
| Styling | Tailwind CSS | Cepat untuk membangun UI konsisten dengan desain katalog |
| Validasi form | Zod + React Hook Form | Validasi input produk di sisi admin |

**Catatan:** stack ini tanpa biaya di tahap awal (semua provider punya free tier yang cukup untuk trafik UMKM). Biaya baru muncul saat trafik/data tumbuh signifikan.

---

## 5. Model Data (Skema Utama)

```
User
- id, name, email, passwordHash, role (ADMIN | STAFF), createdAt

Category
- id, name, slug

Product
- id, name, slug, description, price, spiceLevel, isAvailable (boolean)
- categoryId (FK -> Category)
- images (relasi ke ProductImage)
- createdBy (FK -> User), updatedAt

ProductImage
- id, productId (FK), url, altText, sortOrder

BusinessSetting  (singleton — no. WA, alamat, jam operasional, dsb — diedit lewat admin)
- id, whatsappNumber, address, openingHours, instagramHandle
```

---

## 6. Kebutuhan Fungsional

### 6.1 Halaman Publik
| ID | Kebutuhan | Prioritas |
|---|---|---|
| F1 | Pengunjung dapat melihat daftar produk dengan foto, nama, harga | Must |
| F2 | Pengunjung dapat filter produk berdasarkan kategori/rasa | Should |
| F3 | Pengunjung dapat membuka detail produk (deskripsi, level pedas, foto) | Must |
| F4 | Tombol "Pesan" membuka WhatsApp dengan pesan otomatis berisi nama produk | Must |
| F5 | Produk dengan status habis ditampilkan tapi tombol pesan nonaktif/label "Stok Habis" | Should |
| F6 | Halaman Tentang & Kontak menampilkan info usaha yang diambil dari `BusinessSetting` | Must |

### 6.2 Panel Admin
| ID | Kebutuhan | Prioritas |
|---|---|---|
| F7 | Login dengan email & password | Must |
| F8 | Admin dapat CRUD produk (nama, harga, deskripsi, kategori, foto, status stok) | Must |
| F9 | Staff dapat CRUD produk **kecuali** menghapus produk secara permanen (hanya nonaktifkan) | Should |
| F10 | Admin dapat kelola akun staff (tambah/nonaktifkan akun) | Must |
| F11 | Admin dapat edit info bisnis (no. WA, alamat, jam operasional) | Must |
| F12 | Upload gambar produk langsung dari form (drag & drop atau pilih file) | Must |
| F13 | Log aktivitas dasar: siapa terakhir mengubah produk & kapan | Could |

### 6.3 Non-Fungsional
| ID | Kebutuhan |
|---|---|
| N1 | Waktu muat halaman katalog < 2 detik pada koneksi 4G rata-rata |
| N2 | Fully responsive: mobile (360px) sampai desktop |
| N3 | Password admin/staff di-hash (bcrypt/argon2), tidak pernah disimpan plain text |
| N4 | Backup database otomatis (mengandalkan fitur bawaan Supabase/Neon) |
| N5 | Uptime target 99% (mengandalkan SLA Vercel + provider Postgres) |
| N6 | SEO dasar: meta title/description per halaman, sitemap.xml, Open Graph image |

---

## 7. Alur Utama (User Flow)

**Alur Pembeli:**
Beranda → Katalog → Detail Produk → Klik "Pesan via WhatsApp" → Chat WA terbuka dengan pesan siap kirim → Konfirmasi manual oleh tim.

**Alur Admin/Staff:**
Login → Dashboard produk → Tambah/Edit produk → Upload foto → Simpan → Perubahan langsung tampil di halaman publik.

---

## 8. Metrik Keberhasilan

- Jumlah klik tombol "Pesan via WhatsApp" per bulan (event tracking sederhana)
- Waktu rata-rata staff menambahkan 1 produk baru (target < 3 menit, indikator kemudahan admin panel)
- Bounce rate halaman katalog (target di bawah rata-rata industri e-commerce UMKM)

---

## 9. Timeline & Milestone (Estimasi)

| Fase | Cakupan | Estimasi Durasi |
|---|---|---|
| 1. Setup | Repo, database schema, auth, deploy pipeline | 3–5 hari |
| 2. Halaman Publik | Beranda, katalog, detail produk, kontak | 5–7 hari |
| 3. Panel Admin | CRUD produk, manajemen user, upload gambar | 5–7 hari |
| 4. QA & Polish | Testing responsif, SEO, perbaikan bug | 3–4 hari |
| 5. Deploy & Handover | Deploy produksi, training tim pakai admin panel | 1–2 hari |

**Total estimasi: ~3–4 minggu** (asumsi 1 developer, part-time/full-time tergantung kapasitas).

---

## 10. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Tim non-teknis kesulitan pakai panel admin | Buat UI admin sesederhana mungkin + sediakan panduan singkat bergambar |
| Nomor WA tunggal kewalahan saat order ramai | Rencanakan migrasi ke WhatsApp Business API di v2 jika volume naik |
| Biaya hosting naik seiring trafik | Pantau penggunaan free tier Vercel/Supabase, siapkan estimasi biaya upgrade |

---

## 11. Pertanyaan Terbuka

- Apakah perlu multi-kategori (misal "camilan" vs "paket hemat") sejak v1, atau cukup satu list flat?
- Apakah tim ingin analytics dasar (Google Analytics/Plausible) terpasang sejak awal?
- Siapa yang akan jadi Admin utama vs Staff pertama kali sistem berjalan?