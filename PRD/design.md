# Design System — Website Bon Giri Stik Keju

**Versi:** 1.0
**Tanggal:** 14 Agustus 2026
**Cakupan:** Portal Publik (Katalog) — Mobile-First
**Terkait:** `prd.md` v2.1

---

## 1. Prinsip Desain

1. **Mobile-first, bukan mobile-responsive.** Semua keputusan desain dimulai dari layar 375–414px, baru di-scale ke tablet/desktop. Mayoritas pengunjung datang dari klik link Instagram/WhatsApp langsung di HP.
2. **Foto adalah hero.** Produk makanan dijual lewat visual, bukan teks. Beri ruang sebesar mungkin untuk foto di setiap card.
3. **Satu CTA yang jelas per layar.** Jangan bersaing dengan banyak tombol berwarna — hanya satu aksen warna untuk aksi utama (pesan/checkout).
4. **Thumb-friendly.** Semua interaksi penting bisa dijangkau ibu jari saat HP dipegang satu tangan (zona bawah layar).
5. **Terasa cepat, walau koneksi lambat.** Skeleton loading, lazy load gambar, dan animasi ringan — bukan spinner kosong yang bikin cemas.

---

## 2. Palet Warna (Portal Publik — "Artisanal Crunch")

| Token | Hex | Penggunaan |
|---|---|---|
| `--color-cream` | `#FFFDD0` | Background utama halaman |
| `--color-cream-soft` | `#FFF9E6` | Background section alternatif / card skeleton |
| `--color-gold` | `#FDB813` | Aksen CTA utama, badge harga, highlight — **pakai selektif** |
| `--color-gold-dark` | `#E0A20A` | Hover/active state tombol emas |
| `--color-navy` | `#005B96` | Aksen sekunder (link, ikon info, badge kategori) |
| `--color-charcoal` | `#1A1A1A` | Teks utama, judul |
| `--color-charcoal-soft` | `#4A4A4A` | Teks sekunder/deskripsi |
| `--color-white` | `#FFFFFF` | Card foreground, permukaan elevated |
| `--color-success` | `#2E9B4F` | Badge "Ready Stock" |
| `--color-muted` | `#9C9C9C` | Badge "Stok Habis", teks disabled |
| `--color-error` | `#D64545` | Validasi error (form kontak, dsb) |

**Aturan pemakaian warna:**
- Warna emas (`--color-gold`) **maksimal muncul di 1–2 elemen per layar** — biasanya CTA utama + 1 badge. Jika semua elemen emas, tidak ada yang menonjol.
- Background krem tidak pernah polos kosong — selalu ada tekstur lembut lewat card putih dengan shadow tipis di atasnya, supaya ada kedalaman (depth).

---

## 3. Tipografi

| Peran | Font | Contoh Ukuran (Mobile) | Berat |
|---|---|---|---|
| Display / Judul Hero | **Fraunces** (serif hangat, sedikit playful) | 28–32px | 600 |
| Heading Section | **Plus Jakarta Sans** | 20–22px | 700 |
| Body / Deskripsi | **Plus Jakarta Sans** | 14–15px | 400–500 |
| Harga / Angka | **Plus Jakarta Sans** (tabular numbers) | 16–18px | 700 |
| Caption / Label kecil | **Plus Jakarta Sans** | 11–12px | 500, uppercase, letter-spacing 0.03em |

- Line-height body: 1.5–1.6 untuk keterbacaan di layar kecil.
- Hindari lebih dari 2 keluarga font. Fraunces hanya untuk judul besar yang jumlahnya sedikit (hero, nama halaman) — jangan dipakai di body.
- Angka harga selalu tabular/monospace-style agar rapi saat berjajar (mis. daftar harga varian).

---

## 4. Grid, Spacing & Radius

| Token | Nilai | Catatan |
|---|---|---|
| Container padding (mobile) | 16px | Margin kiri-kanan konsisten di semua section |
| Grid produk | 2 kolom, gap 12px | Bukan 1 kolom — biar cepat di-scan |
| Card radius | 16–20px | Kesan lembut, "artisanal", bukan tajam/korporat |
| Card shadow | `0 2px 8px rgba(26,26,26,0.06)` | Halus, jangan terlalu gelap |
| Spacing scale | 4 / 8 / 12 / 16 / 24 / 32 / 48px | Skala konsisten, hindari nilai acak |
| Tap target minimum | 44×44px | Semua tombol, chip, ikon interaktif |
| Bottom safe area | +16–24px padding bawah | Untuk sticky bar di atas gesture bar iOS/Android |

---

## 5. Struktur Halaman Utama (Mobile)

### 5.1 Beranda (`/`)
1. **Hero Section** — foto produk unggulan full-bleed, judul singkat (Fraunces), 1 CTA emas "Lihat Katalog".
2. **Value Props strip** — 3 ikon horizontal scroll: Kalsium Ikan Tenggiri, Bebas Pengawet, Halal.
3. **Grid Produk Unggulan** — 2 kolom, maksimal 4–6 produk, tombol "Lihat Semua" di bawah.
4. **Cerita Produk / Testimoni** — card carousel swipe horizontal, bukan grid statis.
5. **Sticky bottom bar** — tombol "Pesan Sekarang" muncul setelah user scroll melewati hero.

### 5.2 Katalog (`/katalog`)
1. **Search bar** sticky di atas, di bawah header — full width, ikon kaca pembesar.
2. **Category chips** — horizontal scroll, chip aktif berwarna navy/gold, sisanya outline.
3. **Grid Produk 2 kolom** — foto rasio 1:1, badge stok di pojok kiri-atas foto, harga tabular di bawah nama.
4. **Empty state** (hasil search kosong) — ilustrasi ringan + CTA "Reset Filter", bukan teks kosong doang.

### 5.3 Detail Produk (`/katalog/[slug]`)
1. Foto besar di atas (rasio 4:5 atau 1:1), swipeable jika ada >1 foto.
2. Nama, kategori, level pedas (badge navy), harga besar (tabular, bold).
3. Deskripsi singkat, expand/collapse jika panjang (`Baca selengkapnya`).
4. **Sticky bottom bar**: tombol "Pesan via WhatsApp" full-width, warna emas.

### 5.4 Modal/Bottom Sheet Checkout QRIS (`Fitur Baru`)
Gunakan **bottom sheet** (naik dari bawah), bukan modal tengah — pola yang familiar dari Shopee/GoFood:

```
┌─────────────────────────┐
│  ▬▬  (drag handle)       │
│  Ringkasan Pesanan       │
│  Nama Produk × Qty       │
│  Total: Rp XX.XXX        │
│  ──────────────────────  │
│  [ Gambar QRIS ]         │
│  (tap untuk perbesar)    │
│  ──────────────────────  │
│  1. Scan & bayar sesuai  │
│     nominal               │
│  2. Kirim bukti via WA   │
│  ──────────────────────  │
│  [ Sudah Bayar → WA ]    │ ← CTA emas, full-width
└─────────────────────────┘
```

- Drag handle di atas agar terasa dismissable (swipe down untuk tutup).
- Gambar QRIS bisa di-tap untuk full-screen zoom (penting — banyak HP kesulitan scan dari gambar kecil di layar).
- CTA satu-satunya warna emas di layar itu, tidak ada tombol kompetitor lain.

### 5.5 Kontak (`/kontak`)
- Card alamat, jam operasional, Instagram — layout stack vertikal, ikon navy di kiri tiap item.
- Tombol WhatsApp besar di bagian bawah, bukan link teks kecil.

---

## 6. Komponen Kunci

### 6.1 Product Card
- Foto rasio 1:1, object-fit cover, radius atas mengikuti card.
- Badge stok: pill kecil kiri-atas foto (`Ready` hijau / `Habis` abu, teks putih).
- Nama produk 1 baris (truncate + ellipsis jika panjang).
- Harga tabular, bold, warna charcoal.
- Jika stok habis: foto sedikit di-dim (opacity 60%), tombol pesan disabled dengan warna muted.

### 6.2 Sticky Bottom Bar
- Background putih, shadow ke atas `0 -2px 8px rgba(0,0,0,0.06)`.
- Selalu fixed di bawah viewport, padding memperhitungkan safe-area-inset-bottom.
- Isi: 1 CTA utama (full-width atau CTA + info harga di sebelah kiri jika di halaman detail).

### 6.3 Category Chip
- Height 36px, radius full (pill), padding horizontal 16px.
- State aktif: background navy, teks putih. State non-aktif: outline `#1A1A1A` 1px, teks charcoal.

### 6.4 Badge Stok
- `Ready`: background `--color-success` transparan 15%, teks `--color-success` solid.
- `Habis`: background `--color-muted` transparan 15%, teks `--color-muted` solid.

### 6.5 Skeleton Loading
- Warna `--color-cream-soft` dengan shimmer animasi halus (bukan spinner).
- Bentuk skeleton mengikuti bentuk asli card (foto persegi + 2 baris teks pendek).

---

## 7. Interaksi & Micro-animation

- Transisi antar state: 150–200ms ease-out — cukup cepat agar tidak terasa lag di HP low-end.
- Tap pada card produk: scale 0.98 sesaat (feedback sentuh), bukan hover effect (hover tidak relevan di touchscreen).
- Bottom sheet checkout: slide-up 250ms, backdrop fade 200ms.
- Toast konfirmasi (misal "Berhasil disalin") muncul dari bawah, auto-dismiss 2.5 detik, tidak menghalangi sticky bar.

---

## 8. Aksesibilitas & Performa Mobile

- Kontras teks minimal WCAG AA (charcoal di atas krem sudah memenuhi; hindari teks abu muda di atas krem).
- Semua gambar wajib `alt` text deskriptif (nama produk).
- Lazy load semua gambar di bawah fold menggunakan `loading="lazy"` / Next.js `<Image>`.
- Font di-load dengan `font-display: swap` agar teks tetap terbaca saat font custom belum termuat.
- Hindari elemen hover-only — semua interaksi (quick view, tooltip info) harus bisa dipicu lewat tap.
- Target Lighthouse Mobile Performance ≥ 90.

---

## 9. Yang Sebaiknya Dihindari

- ❌ Modal checkout di tengah layar (susah dijangkau ibu jari, harus scroll dalam modal kecil).
- ❌ Dropdown filter kategori tersembunyi — gunakan chip yang langsung terlihat.
- ❌ Warna emas dipakai berulang di banyak elemen sekaligus (badge, tombol, teks, border) — jadi ramai dan tidak ada fokus.
- ❌ Font serif dekoratif untuk body text — sulit dibaca di layar kecil.
- ❌ Spinner loading polos tanpa skeleton — terasa lebih lambat dari yang sebenarnya.
- ❌ Tombol WhatsApp/QRIS diletakkan hanya di bagian atas halaman — pengguna sering tidak scroll ke atas lagi setelah membaca detail.

---

## 10. Referensi Implementasi

Palet warna & radius di atas dapat langsung dipetakan ke Tailwind CSS v4 melalui `@theme` di `globals.css` (lihat `prd.md` bagian 4 — Tech Stack). Font Fraunces & Plus Jakarta Sans dapat dimuat lewat `next/font/google` untuk optimasi loading otomatis di Next.js.eks