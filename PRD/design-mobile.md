# Design.md — UI/UX Specification: Bon Giri Manager Mobile

**Proyek:** Bon Giri Manager Mobile (React Native + Expo)  
**Versi:** 1.2 (Update: Integrasi Pesanan Masuk COD & QRIS + Upload Bukti Transfer + DB Order Sync)  
**Tanggal:** 16 Agustus 2026  
**Terkait:** `PRD/prd-aplikasi.md`  
**Tema Desain:** Obsidian Dark Mode  

---

## 0. Changelog

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | 10 Agustus 2026 | Rilis awal — Arsitektur UI/UX mobile admin, POS, dan laporan keuangan. |
| 1.1 | 14 Agustus 2026 | Menambahkan alur verifikasi QRIS manual & grafik visual laporan keuangan. |
| 1.2 | 16 Agustus 2026 | Menambahkan **Integrasi Alur Checkout Pembeli (COD & QRIS)**, **Penyimpanan Transaksi ke DB sebelum WA**, **Fitur Upload Bukti Pembayaran QRIS**, **Layar Pembayaran Berhasil (Success View)**, serta **Riwayat Pesanan Lokal Client (`localStorage`)**. |

---

## 1. Prinsip Desain

1. **Speed-first** — Kasir/staff bekerja cepat saat jam sibuk. Aksi utama (Input Penjualan, Toggle Stok, Verifikasi Pesanan Web) maksimal 2 tap dari layar manapun.
2. **Role-aware UI** — Tampilan menyesuaikan role. STAFF tidak melihat elemen UI yang tidak bisa diaksesnya (bukan sekadar di-disable, tapi disembunyikan agar tidak membingungkan).
3. **Thumb-reachable** — Aksi primer diletakkan di zona bawah layar (mudah dijangkau ibu jari saat pegang HP satu tangan).
4. **Feedback jelas** — Setiap aksi transaksi (simpan penjualan, unggah bukti transfer, ubah stok) disertai haptic feedback + toast konfirmasi.
5. **Gelap tapi tidak datar** — Dark mode dengan elevasi kartu yang jelas (bukan hitam pekat rata) agar hierarki visual tetap terbaca.

---

## 2. Design Tokens

### 2.1 Palet Warna

| Token | Hex | Penggunaan |
|---|---|---|
| `--bg-base` | `#0f0f0f` | Background utama aplikasi |
| `--bg-card` | `#111111` | Kartu, sheet, modal |
| `--bg-card-elevated` | `#1a1a1a` | Kartu di atas kartu (nested), input field |
| `--border-subtle` | `#262626` | Garis pembatas antar elemen |
| `--accent-gold` | `#FDB813` | Aksi primer, highlight, badge ADMIN |
| `--accent-gold-muted` | `#FDB81333` (20% opacity) | Background badge/chip aktif |
| `--text-primary` | `#F5F5F5` | Judul, angka penting |
| `--text-secondary` | `#A3A3A3` | Label, keterangan |
| `--text-disabled` | `#525252` | Teks nonaktif |
| `--success` | `#22C55E` | Stok Ready, transaksi sukses, laba positif, bukti transfer terverifikasi |
| `--danger` | `#EF4444` | Stok Habis, hapus produk, pengeluaran/laba negatif |
| `--warning` | `#F59E0B` | Peringatan stok menipis, pesanan pending COD/QRIS |
| `--info` | `#3B82F6` | Transfer Bank / QRIS badge |

### 2.2 Tipografi

| Level | Font | Size / Weight | Penggunaan |
|---|---|---|---|
| Display | Inter / SF Pro | 28px / Bold | Angka omset di Dashboard |
| H1 | Inter | 22px / Semibold | Judul layar |
| H2 | Inter | 18px / Semibold | Judul section/kartu |
| Body | Inter | 15px / Regular | Teks umum |
| Label | Inter | 13px / Medium, uppercase, letter-spacing 0.5px | Label form, kategori |
| Caption | Inter | 12px / Regular | Timestamp, keterangan kecil |
| Angka Uang | Inter / Tabular Nums | Bold, warna sesuai konteks | Semua nominal Rupiah |

### 2.3 Spacing & Radius

- Grid dasar: kelipatan 4px (4, 8, 12, 16, 24, 32).
- Padding layar horizontal: 16px.
- Radius kartu: 16px. Radius tombol: 12px. Radius chip/badge: 999px (pill).
- Elevasi kartu: shadow halus `rgba(0,0,0,0.4)` blur 12px, tanpa border terang (dark mode friendly).

---

## 3. Arsitektur Navigasi & Alur Checkout

```
Pembeli (Public Mobile Web / Client)
├── Katalog & Detail Produk (Tambah ke Keranjang + Stepper Qty)
├── Keranjang Belanja (/cart)
└── Checkout Modal:
    ├── Step 1: Pilih Metode Pembayaran (COD vs QRIS)
    ├── Step 2: Upload Bukti Transfer QRIS (/api/upload) & Input Alamat
    ├── Step 3: Simpan Transaksi ke DB (/api/orders) & Local Storage History
    └── Step 4: Layar Pembayaran Berhasil (No. Faktur + Tombol Konfirmasi WA)

Main App (Bottom Tab Navigator - Admin/Kasir Mobile)
├── Tab 1: Dashboard (Statistik + Notifikasi Pesanan Masuk)
├── Tab 2: Kasir (POS)
├── Tab 3: Produk
├── Tab 4: Laporan (Khusus ADMIN)
└── Tab 5: Pengaturan
```

---

## 4. Spesifikasi Layar & Fitur Baru (v1.2)

### 4.1 Alur Pembayaran Pembeli (COD & QRIS)
1. **Modal Checkout Pilihan Pembayaran**:
   - Tab segmented: **QRIS / Transfer** vs **COD (Bayar di Tempat)**.
2. **Fitur Upload Bukti Pembayaran (Khusus QRIS)**:
   - Input file gambar (JPG, PNG, WEBP).
   - Pratinjau (*preview*) gambar bukti transfer secara *realtime*.
   - Unggah otomatis ke backend via `/api/upload` (disimpan ke `/public/uploads/` atau Supabase Storage).
   - Tombol konfirmasi terkunci sampai bukti pembayaran selesai diunggah.
3. **Penyimpanan Pesanan ke Database (`/api/orders`)**:
   - Saat pembeli mengklik "Konfirmasi & Selesaikan Pesanan", data pesanan disimpan ke tabel `SalesTransaction` & `SalesItem` di database.
   - Status pesanan otomatis diset ke `PENDING_PAYMENT` (QRIS) atau `PENDING_COD` (COD) dengan nomor faktur unik (`INV-xxxxxx-xxxx`).
   - Tautan gambar bukti transfer disimpan pada kolom `notes` transaksi.
4. **Layar Pembayaran & Pesanan Berhasil! (Success Screen)**:
   - **TIDAK langsung me-redirect paksa ke WhatsApp**.
   - Tampil layar sukses dengan animasi centang hijau, Nomor Faktur, Metode Pembayaran, dan Total Tagihan.
   - **Tombol Aksi**:
     1. *"Konfirmasi Pesanan ke WhatsApp"* (Membuka WA resmi Bon Giri dengan nomor faktur & link bukti transfer terformat otomatis).
     2. *"Lihat Riwayat Pesanan"* (Mengarahkan ke halaman `/pesanan`).
     3. *"Selesai & Belanja Lagi"* (Menutup modal dan mereset keranjang).

### 4.2 Riwayat Pesanan Lokal Pembeli (`/pesanan`)
- Menyimpan setiap transaksi yang diselesaikan ke `localStorage` (`bon_giri_orders`).
- Menampilkan kartu riwayat pesanan berisi No. Faktur, tanggal/jam transaksi, daftar varian & jumlah, total pembayaran, status metode (`QRIS` / `COD`), dan tautan bukti transfer.
- Tombol aksi *"Tanya Admin WA mengenai Faktur ini"* untuk memfasilitasi *inquiry* status pesanan secara instan.

### 4.3 Verifikasi Pesanan Masuk di Mobile Admin (Dashboard / Transactions)
- Admin/Staff dapat melihat daftar pesanan pembeli yang masuk dari web/mobile publik secara *real-time*.
- Admin/Staff dapat membuka tautan foto bukti transfer yang dilampirkan pembeli untuk mencocokkan saldo masuk di akun DANA Bisnis / Bank sebelum mengubah status transaksi menjadi `COMPLETED`.

---

## 5. Status Dokumen

- Dokumen ini diperbarui untuk versi **1.2** (16 Agustus 2026) dan diselaraskan dengan codebase `bon-giri` & `bon-giri-mobile`.
