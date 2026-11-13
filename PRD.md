# Product Requirements Document (PRD) — Website Flagship Storefront UMKM

**Versi Dokumen:** 1.0  
**Target Produk:** Landing Page & Etalase Produk Unggulan UMKM (*Direct-to-Consumer*)  
**Bahasa Implementasi:** Indonesia (dapat disesuaikan ke multi-bahasa)  
**Basis Arsitektur:** Single-Page Application (React + TypeScript + GSAP + Lenis + WebGL2/Canvas 2D)

---

## 1. Ringkasan Eksekutif & Visi Produk

Website ini dirancang sebagai **etalase digital flagship (*flagship storefront*) untuk UMKM** yang ingin menjual 1 produk unggulan (atau 1 lini produk utama dengan beberapa varian warna/rasa/ukuran) secara langsung ke konsumen (*Direct-to-Consumer*). 

Berbeda dengan halaman toko online konvensional yang penuh dengan grid katalog padat, banner diskon mencolok, atau elemen yang mengganggu fokus, website ini mengadopsi pendekatan **Architectural Storytelling & Tactile Commerce**: membangun kepercayaan terhadap kualitas pengerjaan (*craftsmanship*) produk lokal melalui pengalaman scroll sinematik, bukti visual interaktif, dan proses pemesanan yang cepat melalui *slide-over bag drawer*.

### Tujuan Bisnis Utama
1. **Meningkatkan Kepercayaan (*Brand Trust*)**: Menampilkan detail material, proses pembuatan, dan keunggulan produk UMKM setara merek ritel global.
2. **Meningkatkan Rasio Konversi (*Add-to-Bag / Checkout*)**: Mengarahkan pengunjung secara mulus dari narasi produk menuju konfigurator varian dan keranjang belanja tanpa pindah halaman (*zero page reload*).
3. **Siap Terhubung ke Alur Pemesanan UMKM**: Mendukung ringkasan keranjang real-time yang siap diteruskan ke admin WhatsApp, COD, atau gerbang pembayaran lokal.

---

## 2. Target Pengguna & Persona

| Persona | Profil Singkat | Kebutuhan Utama | Solusi pada Website |
| :--- | :--- | :--- | :--- |
| **Pembeli Ritel (End-User)** | Konsumen usia 20–45 tahun yang mengakses via smartphone/desktop dan menghargai kualitas serta keaslian produk lokal. | Melihat tampilan produk dari berbagai sudut, memahami keunggulan dibanding produk biasa, memilih varian, dan memesan dengan cepat. | Showcase 4 tahap saat scroll, slider perbandingan Before/After, konfigurator varian interaktif, dan keranjang geser instan. |
| **Pemilik / Admin UMKM** | Pelaku usaha yang mengelola 1 produk unggulan beserta variasi warna/ukuran/kemasan dan memproses order masuk. | Konten mudah diganti (teks, foto, harga Rupiah, daftar varian) tanpa merusak tata letak dan animasi. | Struktur data terpusat (array konfigurasi varian, ukuran, harga, dan daftar foto showcase). |

---

## 3. Arsitektur Informasi & Alur Pengguna (*User Flow*)

Website disusun dalam **5 bagian vertikal berurutan** ditambah **Header tetap** dan **Slide-Over Order Drawer**.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ FIXED HEADER (64px): Logo UMKM · Navigasi · Toggle Tema · Ikon Tas (N)  │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ SECTION 1: ASYMMETRIC SPLIT HERO (100dvh)                               │
│ • Kiri: Headline Utama + Subjudul Nilai Produk + CTA (Belanja / Jelajah)│
│ • Kanan: Foto Cutout Produk (3D Pointer Tilt) + Swatch Pemilih Varian   │
│ • Latar: WebGL2 Procedural Shader (Topografi / Tekstur Organik Halus)   │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ SECTION 2: PINNED 4-STAGE ENVIRONMENTAL SHOWCASE (Scroll-Locked)        │
│ • Viewport terkunci selama scroll (+=280%)                              │
│ • 4 foto produk dalam konteks penggunaan nyata berganti via Wipe Scroll │
│ • Caption judul & subjudul berganti otomatis + Indikator Dot interaktif │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ SECTION 3: INTERACTIVE COMPARISON SLIDER (Bukti Keunggulan Produk)      │
│ • Kiri: Slider Before/After atau Kondisi A vs B (Drag + Keyboard)       │
│ • Kanan: Penjelasan keunggulan + Segmented Control + 2 Metrik Kunci     │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ SECTION 4: ASYMMETRIC 3-TILE EDITORIAL BENTO GRID (Craft & Detail)      │
│ • Tile Kiri (Tinggi): Detail bahan baku / pengerjaan tangan / kemasan   │
│ • Tile Kanan Atas: Tekstur / ketahanan / sertifikasi (Halal, BPOM, SNI) │
│ • Tile Kanan Bawah: Wireframe/Ilustrasi Canvas 2D + Spesifikasi Teknis  │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ SECTION 5: INTERACTIVE CONFIGURATOR + SLIDE-OVER ORDER BAG DRAWER       │
│ • Kiri: Preview produk dinamis (skala & filter warna mengikuti pilihan) │
│ • Kanan: Pilih Varian -> Pilih Ukuran/Paket -> Daftar Spek -> Tambah    │
│ • Aksi: Membuka Slide-Over Drawer (Stepper Qty, Total, Konfirmasi Order)│
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Kebutuhan Fungsional (*Functional Requirements*)

### F1. Navigasi Global & Pengalih Tema (`#site-header`)
- **Brand Lockup**: Menampilkan ikon SVG merek UMKM dan nama brand di sisi kiri, mengarah kembali ke `#hero`.
- **Navigasi Single-Line**: Tautan ringkas (`Showcase` / Galeri, `Specs` / Detail) yang disembunyikan pada layar mobile `< 768px` agar header tidak padat.
- **Toggle Tema Terang/Gelap**: Mengubah atribut `data-theme` pada `document.documentElement` antara `light` (default) dan `dark`. Perubahan ini harus menyinkronkan warna CSS, shader WebGL2 Hero, dan warna garis Canvas 2D secara langsung.
- **Tombol Keranjang (`#bag-trigger`)**: Menampilkan lencana jumlah total item (`totalQty`) dan membuka *Slide-Over Drawer* saat diklik.

### F2. Hero Split & Swatch Varian Cepat (`#hero`)
- **Interaksi 3D Pointer Tilt**: Pada perangkat dengan pointer presisi (desktop), foto produk beresolusi tinggi merespons posisi kursor dengan rotasi 3D halus (*spring-damping*), disertai pergeseran bayangan bawah (*floor shadow*) secara berlawanan.
- **Sinkronisasi Swatch Varian**: Memilih varian di Hero (`hero-swatches`) langsung mengubah tampilan warna/kalibrasi gambar di Hero **dan** menyinkronkan state `finish`/varian yang aktif pada Configurator di Section 5 (`#order`).
- **Tombol CTA Ganda**:
  - CTA Primer (`Shop` / `Pesan Sekarang`): *Smooth scroll* menuju `#order`.
  - CTA Sekunder (`Explore` / `Lihat Detail`): *Smooth scroll* menuju `#showcase`.

### F3. Pinned 4-Stage Showcase (`#showcase`)
- **Scroll-Pinning**: Saat pengguna menggulir masuk ke `#showcase`, layar terkunci selama panjang scroll `+=280%`.
- **Transisi Tirai Horizontal**: Frame ke-2, ke-3, dan ke-4 terbuka dari kanan ke kiri mengikuti progres scroll (*scrubbed timeline*).
- **Sinkronisasi Caption**: Teks judul dan deskripsi singkat pada sudut kiri bawah hanya berubah ketika gambar baru sudah terbuka ≥ 90%, dengan efek transisi *blur-fade* (`100ms`) agar tidak berkedip saat scroll cepat.
- **Navigasi Manual**: Titik indikator (*stage dots*) di kanan bawah dapat diklik untuk melompat langsung ke sudut/konteks foto ke-1 sampai ke-4.

### F4. Slider Perbandingan Interaktif (`#thermal` / Adaptasi Bukti Produk UMKM)
- **Kegunaan untuk UMKM**: Dapat disesuaikan untuk membandingkan:
  - *Produk Kuliner/F&B*: Kemasan standar vs kemasan vakum/tahan panas, atau penyajian dingin vs hangat.
  - *Produk Craft/Fashion/Skincare*: Kondisi bahan mentah vs hasil akhir, atau pemakaian sebelum vs sesudah.
- **Mekanisme Interaksi**:
  - Pengguna dapat menyeret (*drag*) pemisah horizontal menggunakan mouse atau sentuhan jari (`PointerEvent` dengan `setPointerCapture`).
  - Pengguna dapat mengklik tombol *Segmented Control* di sebelah kanan untuk melompat mulus ke posisi `100%` (Kondisi A) atau `0%` (Kondisi B).
  - Mendukung aksesibilitas keyboard (`role="slider"`, tombol `ArrowLeft` / `ArrowRight` menggeser `±8%`).
- **Metrik Pendukung**: Menampilkan 2 metrik angka penting (contoh: `24 Jam`, `100% Lokal`, `4°C` / `85°C`) menggunakan font monospace tabular.

### F5. Bento Grid Keunggulan & Spesifikasi (`#craft`)
- **Tata Letak Asimetris 12-Kolom**:
  - 1 kartu tinggi di kiri (`7 kolom × 2 baris`) untuk foto makro kualitas bahan/jahitan/proses produksi.
  - 1 kartu kanan atas (`5 kolom × 1 baris`) untuk detail tekstur, ketahanan, atau sertifikasi usaha (mis. PIRT / Halal / Garansi).
  - 1 kartu kanan bawah (`5 kolom × 1 baris`) berisi visualisasi Canvas 2D interaktif (wireframe produk berputar yang kecepatannya meningkat saat di-hover) dan ringkasan kapasitas/berat.
- **Animasi Masuk**: Kartu muncul berurutan (*stagger*) sekali saat pertama kali masuk ke viewport (`once: true`).

### F6. Configurator Varian & Slide-Over Order Drawer (`#order` & `#bag-drawer`)
- **Pemilih Varian (*Finish / Rasa / Motif*)**: Pill button dengan indikator titik warna (*swatch dot*) atau label varian.
- **Pemilih Ukuran / Paket (*Capacity / Weight / Bundle*)**: Pill button yang secara dinamis memperbarui harga (`price`) dan mengubah skala visual preview produk (`scale: 0.94`, `1.0`, `1.06`) agar pembeli mendapat umpan balik ukuran secara visual.
- **Daftar Spesifikasi Ringkas**: 3 baris kunci-nilai (misal: Ketahanan/Masa Simpan, Material/Komposisi, Garansi/Pengiriman).
- **Slide-Over Order Bag Drawer**:
  - Terbuka dari kanan dengan animasi spring dan backdrop blur; dapat ditutup lewat tombol `×`, klik backdrop, atau tombol `Escape`.
  - Menampilkan *empty state* beserta tombol CTA kembali ke `#order` bila keranjang kosong.
  - Menampilkan daftar item unik berdasarkan kombinasi `(varian + ukuran)`, lengkap dengan thumbnail, harga satuan, tombol stepper `-` / `+` (menghapus item otomatis jika qty = 0), dan kalkulasi **Total Harga** real-time.
  - **Ekstensi Alur UMKM (*Order Confirmation / WhatsApp Checkout*)**: Tombol utama `Checkout` mengonfirmasi pesanan dengan status loading/konfirmasi (`Order Confirmed` selama `1100ms`), dan pada implementasi produksi UMKM dapat dihubungkan ke `https://wa.me/<nomor_admin>?text=<ringkasan_pesanan>` atau API pembayaran lokal.

---

## 5. Panduan Kustomisasi Konten untuk UMKM

Untuk mengadaptasi template ini ke jenis UMKM tertentu, cukup ubah konstanta data berikut tanpa mengubah logika inti:

| Elemen di Aplikasi | Contoh UMKM F&B (Kopi / Madu / Sambal) | Contoh UMKM Fashion / Craft (Tas Kulit / Batik) |
| :--- | :--- | :--- |
| **Varian (`FINISH_META`)** | Tingkat Sangrai (Light, Medium, Dark) atau Varian Rasa | Warna Kulit / Motif Kain (Tan, Espresso, Obsidian) |
| **Ukuran (`SIZE_OPTIONS`)** | Kemasan `250 g` (Rp65.000), `500 g` (Rp120.000), `1 kg` (Rp220.000) | Ukuran `Compact S`, `Daily M`, `Travel L` |
| **Showcase 4 Tahap** | 1. Studio Kemasan · 2. Asal Bahan/Kebun · 3. Proses Seduh/Saji · 4. Momen Konsumsi | 1. Studio Produk · 2. Dipakai Kerja · 3. Detail Jahitan · 4. Perjalanan Luar Ruang |
| **Comparison Slider** | Biji Mentah vs Hasil Roasting / Panas vs Dingin | Kulit Mentah vs Finishing Wax / Siang vs Malam |
| **Bento Grid (`#craft`)** | Seal Kemasan Kedap Udara, Tekstur Bubuk/Biji, Berat Bersih & Sertifikasi Halal | Resleting Kuningan, Tekstur Kulit Asli, Dimensi & Kapasitas Laptop |

---

## 6. Kebutuhan Non-Fungsional (*Non-Functional Requirements*)

1. **Performa & Render**:
   - Canvas WebGL2 (`heroCanvas`) menggunakan `powerPreference: 'low-power'` dan membatasi *devicePixelRatio* maksimal `2` agar tetap ringan di ponsel kelas menengah.
   - Animasi scroll hanya memanipulasi properti *compositor-friendly* (`transform`, `clip-path`, `opacity`, `filter`) tanpa memicu *layout reflow*.
2. **Aksesibilitas (*Accessibility*)**:
   - Mendukung penuh `prefers-reduced-motion: reduce`: mematikan Lenis smooth scroll, menonaktifkan GSAP ScrollTrigger scrub & tilt 3D, menghentikan loop `requestAnimationFrame` shader pada frame diam, dan meminimalkan durasi transisi CSS menjadi `0.01ms`.
   - Atribut ARIA lengkap pada *radiogroup* varian, *tablist* showcase & thermal, *role="slider"* pada pemisah perbandingan, dan *role="dialog" aria-modal="true"* pada drawer keranjang.
3. **Responsivitas**:
   - Tata letak 2 kolom otomatis berubah menjadi 1 kolom vertikal pada layar `<= 768px`.
   - Rasio gambar showcase menyesuaikan `object-position` pada layar potret (`max-aspect-ratio: 3 / 4`) agar produk tetap terlihat di area aman layar HP.
4. **Pemeliharaan Data (*Maintainability*)**:
   - Seluruh aset gambar harus memiliki `alt` deskriptif dan rasio seragam (landscape 16:9 / 16:10 untuk showcase & comparison; portrait cutout transparan untuk hero & configurator).

---

## 7. Kriteria Penerimaan (*Acceptance Criteria*)

- [ ] Pengguna dapat berpindah mode `Light` dan `Dark` dari header tanpa ada teks yang hilang kontrasnya.
- [ ] Memilih varian di Hero langsung memperbarui gambar & pilihan aktif di bagian Configurator (`#order`).
- [ ] Scroll melewati `#showcase` mengunci viewport dan membuka ke-4 foto secara mulus via *clip-path wipe*, sementara klik *stage dots* berpindah instan ke foto terkait.
- [ ] Slider perbandingan (`#thermal`) dapat digeser lewat pointer, tombol segmented, maupun tombol panah keyboard.
- [ ] Menambahkan kombinasi `(varian + ukuran)` berbeda ke keranjang membuat baris item terpisah; kombinasi sama menambah kuantitas (`qty`).
- [ ] Menekan `Escape` atau klik di luar drawer menutup keranjang dengan transisi halus.
