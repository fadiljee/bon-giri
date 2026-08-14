# PRD — Aplikasi Mobile Admin & Keuangan Bon Giri (React Native + Supabase)

**Nama Proyek:** Bon Giri Manager Mobile  
**Versi:** 1.1  
**Tanggal:** 14 Agustus 2026  
**Pemilik Produk:** Tim Bon Giri (KLK Kewirausahaan UBB)  
**Status:** Draf Arsitektur Baru (Mobile Admin Strategy) — Update Alur Verifikasi QRIS & Grafik Laporan  

---

## 0. Changelog

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | 10 Agustus 2026 | Rilis awal — Arsitektur mobile admin, POS, dan laporan keuangan. |
| 1.1 | 14 Agustus 2026 | Menambahkan **Alur Verifikasi Pembayaran QRIS Manual** (via cek saldo DANA Bisnis sebelum input transaksi POS) dan **Grafik Visual Laporan Keuangan** (tren pendapatan, pengeluaran, dan laba bersih) pada Modul Laporan Keuangan untuk role ADMIN. |

---

## 1. Ringkasan Eksekutif & Perubahan Arsitektur

### 1.1 Latar Belakang Perubahan Arsitektur
Untuk memisahkan antara **Portal Publik Pembeli** dan **Manajemen Internal**, seluruh fitur administrasi yang sebelumnya berada di web (`/admin` Next.js) **dihentikan (deprecated)** dan dipindahkan sepenuhnya ke **Aplikasi Mobile Berbasis React Native**.

Dengan arsitektur baru ini:
1. **Website (`bon-giri.com`)**: Murni menjadi katalog publik *fast-loading* untuk pembeli (tanpa rute `/admin`, tanpa form login web). Web membaca data produk & pengaturan usaha langsung dari Supabase.
2. **Aplikasi Mobile (Android/iOS)**: Menjadi pusat kendali operasional internal Bon Giri. Pemilik dan staff mengelola produk, menyetujui/menginput transaksi penjualan, mencatat pengeluaran harian, serta memantau laporan keuangan langsung dari smartphone.
3. **Backend-as-a-Service (Supabase)**: Menjadi *Single Source of Truth* untuk database PostgreSQL, autentikasi user (`Supabase Auth`), penyimpanan media foto produk (`Supabase Storage`), serta keamanan akses berbasis baris (`Row Level Security - RLS`).

---

## 2. Target Pengguna & Restriksi Hak Akses (RBAC)

Aplikasi mobile mendukung 2 tingkatan hak akses berbasis *Row Level Security* (RLS) di Supabase:

| Role | Target Pengguna | Hak Akses di Aplikasi Mobile |
|---|---|---|
| **ADMIN** | Owner / Pemilik Usaha | **Akses Penuh**: Manajemen Produk, Hapus Produk Permanen, Input Penjualan, **Laporan Keuangan & Arus Kas (Penuh)**, Pengaturan Nomor WA/Usaha, dan Manajemen Akun Staff. |
| **STAFF** | Kasir / Tim Operasional Harian | **Akses Terbatas**: Input Penjualan, Tambah/Edit Produk, Toggle Status Stok Ready/Habis. **Dilarang** menghapus produk permanen, tidak memiliki akses ke Laporan Keuangan Sensitif (Keuntungan Bersih/Pengeluaran), dan tidak dapat mengelola akun user lain. |

---

## 3. Tech Stack Aplikasi Mobile

| Layer | Teknologi | Peran & Alasan |
|---|---|---|
| **Framework Mobile** | **React Native** (dengan **Expo SDK**) | Cross-platform (Android & iOS) dengan 1 codebase, performa native, dan kemudahan build via Expo EAS. |
| **Bahasa** | **TypeScript** | Memastikan type-safety antara skema Supabase DB dan komponen UI mobile. |
| **Backend & Database** | **Supabase (PostgreSQL)** | Database terkelola, Supabase Client Library (`@supabase/supabase-js`), Supabase Auth, Supabase Storage, Realtime DB Subscriptions. |
| **State Management** | **TanStack Query (React Query v5)** | Caching data, re-fetching otomatis saat ada transaksi baru, dan optimisic UI updates. |
| **UI Design System** | **NativeWind (Tailwind for RN) / React Native Paper** | Konsistensi visual dengan tema **Obsidian Dark Mode** modern (`#0f0f0f` background, `#111111` card). |
| **Navigasi Mobile** | **React Navigation v6** (Stack & Bottom Tabs) | Navigasi antarmuka native yang mulus (Dashboard, Penjualan, Produk, Laporan, Pengaturan). |
| **Penyimpanan Lokal** | **MMKV / Expo SecureStore** | Menyimpan token sesi autentikasi Supabase secara aman di perangkat mobile. |
| **Visualisasi Data / Charting** | **Victory Native / React Native Gifted Charts** | Merender grafik tren penjualan (Dashboard) & grafik laporan keuangan (Laba/Rugi, Komposisi Pengeluaran, Metode Pembayaran) khusus role `ADMIN`. |

---

## 4. Skema Database Supabase (PostgreSQL Schema)

Aplikasi mobile menggunakan skema tabel PostgreSQL terpusat di Supabase yang mencakup data produk, transaksi penjualan, dan laporan keuangan:

```sql
-- 1. Enum Roles
CREATE TYPE user_role AS ENUM ('ADMIN', 'STAFF');

-- 2. Profiles (Extended from auth.users Supabase)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'STAFF',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Categories
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Products
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  cost_price NUMERIC(12, 2) DEFAULT 0, -- Harga Pokok Penjualan (HPP) untuk hitung profit
  spice_level TEXT DEFAULT 'Original',
  is_available BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Business Settings (Singleton)
CREATE TABLE public.business_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  whatsapp_number TEXT NOT NULL,
  address TEXT NOT NULL,
  opening_hours TEXT NOT NULL,
  instagram_handle TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Sales Transactions (Tabel Penjualan Baru)
CREATE TABLE public.sales_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL, -- Format: BG-YYYYMMDD-XXXX
  customer_name TEXT DEFAULT 'Pembeli Umum',
  customer_phone TEXT,
  total_amount NUMERIC(12, 2) NOT NULL,
  total_cost NUMERIC(12, 2) DEFAULT 0, -- Total HPP untuk hitung laba kotor
  gross_profit NUMERIC(12, 2) DEFAULT 0, -- total_amount - total_cost
  payment_method TEXT DEFAULT 'CASH', -- CASH, TRANSFER_BANK, QRIS, WHATSAPP_ORDER
  status TEXT DEFAULT 'COMPLETED', -- COMPLETED, PENDING, CANCELLED
  created_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Sales Transaction Items
CREATE TABLE public.sales_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES public.sales_transactions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  cost_price NUMERIC(12, 2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  subtotal NUMERIC(12, 2) NOT NULL
);

-- 8. Financial Expenses & Records (Tabel Pengeluaran & Kas Baru)
CREATE TABLE public.financial_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'INCOME' (Pemasukan Lain) atau 'EXPENSE' (Pengeluaran Operasional/Bahan Baku)
  category TEXT NOT NULL, -- 'BAHAN_BAKU', 'OPERASIONAL', 'GAJI', 'LKM_UBB', 'LAINNYA'
  title TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  notes TEXT,
  receipt_image_url TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Fitur Utama & Struktur Modul Aplikasi Mobile

### Modul 1: Autentikasi & Keamanan (Supabase Auth)
- **Login Screen**: Login khusus staff/admin menggunakan email & password.
- **Session Manager**: Penyimpanan JWT token otomatis di perangkat, auto-refresh session, dan proteksi biometrik opsional (Fingerprint / Face ID).
- **Profile & Role Badge**: Menampilkan role aktif (`ADMIN` atau `STAFF`) di header aplikasi.

### Modul 2: Dashboard Overview & Realtime Analytics
- **Kartu Ringkasan Harian (Real-time)**:
  - Total Penjualan Hari Ini (Rp) & Jumlah Transaksi.
  - Estimasi Laba Kotor Hari Ini.
  - Jumlah Varian *Ready Stock* vs *Stok Habis*.
- **Grafik Tren Penjualan**: Visualisasi grafik garis/area tren omset mingguan & bulanan.
- **Peringatan Stok**: Banner peringatan jika ada varian produk yang ditandai *Stok Habis*.

### Modul 3: Input Penjualan / POS Manual (`Fitur Baru`)
- **Antarmuka Kasir Cepat (Quick POS)**:
  - Katalog produk berbasis kartu grid/list dengan filter cepat varian rasa.
  - Keranjang belanja interaktif: Tambah qty, atur level pedas, hitung total harga otomatis.
- **Detail Transaksi**:
  - Input Nama Pembeli & Nomor WhatsApp (opsional untuk rekap histori).
  - Pilihan Metode Pembayaran: Tunai (*Cash*), Transfer Bank, atau QRIS.
  - Pengurangan Stok Otomatis: Saat transaksi disimpan, status persediaan produk diperbarui.
- **Struk Digital (Receipt Generator)**:
  - Generate struk belanja digital yang bisa dibagikan langsung ke WhatsApp pembeli (*Share via WhatsApp API*).

#### 3.1 Alur Verifikasi Pembayaran QRIS (`Fitur Baru`)
Karena website tidak memiliki payment gateway otomatis, konfirmasi pembayaran QRIS dari pembeli divalidasi secara **manual** oleh Staff/Admin sebelum transaksi dicatat di aplikasi mobile:

1. **Chat Masuk**: Staff/Admin menerima pesan order dari pembeli di WhatsApp (berisi detail pesanan & bukti transfer QRIS, hasil dari alur checkout di website).
2. **Cek Saldo**: Staff/Admin membuka aplikasi **DANA Bisnis** untuk memastikan dana benar-benar sudah masuk sesuai nominal pesanan.
3. **Input Transaksi**: Setelah dana terverifikasi, Staff/Admin membuka **Aplikasi Mobile Bon Giri → Modul POS (Input Penjualan)**.
4. **Simpan Transaksi**: Pilih produk sesuai pesanan → pilih metode pembayaran **`QRIS` / `TRANSFER_BANK`** pada dropdown → simpan transaksi. Stok otomatis berkurang dan data langsung masuk ke `sales_transactions`.
5. **Balasan ke Pembeli**: Staff/Admin dapat langsung mengirim struk digital via WhatsApp sebagai konfirmasi pesanan diterima.

**Catatan Desain**:
- Tidak ada rekonsiliasi otomatis antara saldo DANA Bisnis dan data di Supabase — proses ini sepenuhnya berbasis kepercayaan & ketelitian Staff/Admin saat mengecek saldo secara manual.
- Field `payment_method = 'QRIS'` pada tabel `sales_transactions` digunakan untuk membedakan transaksi QRIS dari transaksi tunai di laporan keuangan, sehingga Admin bisa memantau proporsi metode pembayaran.
- Karena proses ini manual, disarankan menambahkan **field opsional `notes`** pada form POS untuk mencatat referensi (misalnya nomor referensi DANA Bisnis atau nama pengirim) guna memudahkan audit di kemudian hari.

### Modul 4: Manajemen Produk & Inventoris (CRUD & Stok Toggle)
- **Daftar Produk**: Tampilan daftar varian dengan pencarian cepat, harga, dan toggle status stok (*Ready Stock* / *Habis*) langsung dari switch 1-kali-tap.
- **Form Tambah & Edit Produk**:
  - Input nama varian, kategori, level pedas, harga jual, dan **Harga Pokok Penjualan (HPP / Cost Price)**.
  - Kamera & Galeri Integration: Upload foto produk langsung dari kamera HP ke **Supabase Storage bucket (`product-images`)**.
- **Restriksi Role**: Tombol Hapus Produk hanya aktif untuk akun dengan role `ADMIN`.

### Modul 5: Laporan Keuangan & Arus Kas (`Fitur Baru`)
- **Laporan Laba / Rugi (Profit & Loss Statement)**:
  - **Total Pendapatan (Revenue)**: Penjualan produk otomatis terakumulasi.
  - **Harga Pokok Penjualan (COGS / HPP)**: Total modal bahan baku terhitung otomatis.
  - **Laba Kotor (Gross Profit)**: Total Pendapatan − Total HPP.
  - **Pengeluaran Operasional (Operational Expenses)**: Catatan biaya sewa, gaji, kemasan, atau bahan bakar.
  - **Laba Bersih (Net Profit)**: Laba Kotor − Total Pengeluaran Operasional.
- **Catat Pengeluaran (Expense Tracker)**:
  - Form catat pengeluaran harian (kategori: Bahan Baku Ikan/Keju, Plastik Kemasan, Transportasi, Operasional).
  - Foto Struk / Nota Pengeluaran: Upload foto bukti pembayaran kasir ke Supabase Storage.
- **Export Laporan**: Ekspor laporan keuangan bulanan ke format **PDF** atau **Excel (CSV)** untuk pembukuan laporan usaha UMKM Bon Giri & program UBB.
- **Grafik Visual Laporan Keuangan (`Fitur Baru`, Khusus `ADMIN`)**:
  - **Grafik Tren Pendapatan vs Pengeluaran vs Laba Bersih**: Line/area chart interaktif dengan filter periode (Mingguan, Bulanan, 3 Bulan Terakhir, Tahunan), menampilkan tiga garis/area berbeda warna untuk memudahkan perbandingan.
  - **Grafik Komposisi Pengeluaran (Pie/Donut Chart)**: Proporsi pengeluaran per kategori (`BAHAN_BAKU`, `OPERASIONAL`, `GAJI`, `LKM_UBB`, `LAINNYA`) untuk periode yang dipilih.
  - **Grafik Metode Pembayaran (Bar Chart)**: Perbandingan volume transaksi & nominal per metode pembayaran (`CASH`, `TRANSFER_BANK`, `QRIS`, `WHATSAPP_ORDER`) — membantu Admin memantau proporsi transaksi yang melalui alur verifikasi QRIS manual.
  - **Ringkasan Kartu Metrik**: Total Pendapatan, Total Pengeluaran, Laba Bersih, dan Margin Laba (%) untuk periode terpilih, ditampilkan di atas grafik.
  - Grafik dibangun menggunakan library charting React Native (misal `react-native-gifted-charts` atau `victory-native`), mengambil data teragregasi dari `sales_transactions` dan `financial_records` via Supabase Client/RPC, dengan caching TanStack Query agar grafik tetap responsif saat data besar.
  - **Restriksi Akses**: Seluruh grafik pada bagian ini hanya tampil untuk role `ADMIN`; role `STAFF` tidak memiliki akses ke tab Laporan Keuangan sama sekali (sesuai RBAC pada bagian 2).

### Modul 6: Pengaturan Bisnis (Terhubung ke Web Publik)
- Edit Nomor WhatsApp Tujuan Order utama (misal: `6288267018426`).
- Edit Alamat Produksi, Jam Operasional, dan Akun Instagram.
- Setiap perubahan pada modul ini **langsung meng-update tampilan Kontak & Navbar pada Website Publik** secara *real-time* via Supabase.

### Modul 7: Manajemen Pengguna Staff (Khusus ADMIN)
- **Kelola Akun Staff**: Tambah akun staff baru (Email, Nama, Password, Role).
- Reset password akun staff dan ubah role akses.

---

## 6. Arsitektur Komunikasi Web Publik & Mobile App

```
                  +-----------------------------------+
                  |   Pelanggan / Pengunjung Web      |
                  +-----------------------------------+
                                    |
                                    v
                  +-----------------------------------+
                  |  Website Publik (Next.js Catalog) |
                  |  - Hanya Baca Produk & Setting    |
                  |  - Tombol Order -> Direct WA      |
                  +-----------------------------------+
                                    |
                                    v (Read Only API / DB)
                  +-----------------------------------+
                  |        SUPABASE BACKEND           |
                  |  - PostgreSQL Database            |
                  |  - Supabase Auth                  |
                  |  - Supabase Storage (Bucket)      |
                  |  - Row Level Security (RLS)       |
                  +-----------------------------------+
                                    ^
                                    | (Read & Write via Supabase Client)
                  +-----------------------------------+
                  |   Aplikasi Mobile Admin (React Native)|
                  |   - Dashboard & Inventoris        |
                  |   - Input Penjualan / POS         |
                  |   - Laporan Keuangan & Arus Kas   |
                  |   - Kelola Staff & Pengaturan WA  |
                  +-----------------------------------+
                                    ^
                                    |
                  +-----------------------------------+
                  |    Owner / Staff (Smartphone)     |
                  +-----------------------------------+
```

---

## 7. Kebutuhan Non-Fungsional

1. **Performa Mobile**: Waktu *cold start* aplikasi < 2 detik pada smartphone Android midrange (RAM 4GB).
2. **Offline Handling & Caching**: Menggunakan React Query cache sehingga data produk dan transaksi hari ini tetap dapat dibuka saat koneksi internet lambat.
3. **Keamanan Data (Security & RLS)**:
   - Kebijakan Supabase RLS memastikan tabel `financial_records` dan `sales_transactions` hanya dapat dibaca oleh user terautentikasi (bukan anonim web).
   - Seluruh kredensial API Supabase disimpan di `.env` aman per ekosistem.
4. **Desain UI/UX Mobile**:
   - Tema **Obsidian Dark Mode** (`#0f0f0f` background, `#111111` cards, `#FDB813` gold accent).
   - Haptic Feedback pada tombol transaksi kasir dan toggle stok.

---

## 8. Langkah Penyesuaian Pada Repositori Web saat Ini

Karena modul `/admin` pada Next.js tidak lagi digunakan:
1. **Pembersihan Rute Web**: Menghapus direktori `/src/app/admin/*` dari Next.js untuk memperringan ukuran build dan keamanan web.
2. **Integrasi DB Web**: Mengubah koneksi database web publik Next.js agar menggunakan `@supabase/supabase-js` atau Direct Connection PostgreSQL Supabase.
3. **Pembuatan Project React Native**: Membuat repositori / folder proyek baru untuk aplikasi React Native (Expo) `bon-giri-mobile`.

---

## 9. Timeline & Rencana Pengembangan Mobile App

| Fase | Kegiatan Utama | Durasi |
|---|---|---|
| **Fase 1: Setup Supabase** | Buat skema DB PostgreSQL (Tabel Penjualan, Laporan, RLS Policies, Storage Buckets). | 2 Hari |
| **Fase 2: Setup React Native** | Inisialisasi Expo Project, UI theme Obsidian Dark, React Navigation setup. | 2 Hari |
| **Fase 3: Modul Produk & POS** | Implementasi Auth Login, Dashboard, Inventoris Produk, & Input Penjualan Kasir. | 4 Hari |
| **Fase 4: Modul Keuangan** | Implementasi Laporan Laba/Rugi, Catat Pengeluaran, & Export PDF/Excel. | 3 Hari |
| **Fase 5: Testing & Handover** | Testing di perangkat Android/iOS, pembersihan rute web `/admin`, & handover tim Bon Giri. | 2 Hari |

---

## 10. Status Dokumen & Langkah Selanjutnya

- Dokumen ini disimpan di file: `PRD/prd-aplikasi.md`.
- Siap digunakan sebagai acuan pengembangan proyek **Aplikasi Mobile Admin & Keuangan Bon Giri (React Native + Supabase)**.