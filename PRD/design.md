# Design System — Bon Giri Stik Keju
**Tema: "Artisanal Crunch"**

Versi: 1.0 · 9 Agustus 2026
Dipakai untuk: website katalog publik + panel admin (Next.js)

---

## 1. Prinsip Desain

- **Hangat & buatan tangan** — warna kuning-madu dan krem mencerminkan proses gorengan rumahan, bukan pabrikan.
- **Terpercaya** — biru tua sebagai warna sekunder memberi kesan kredibel/profesional, menyeimbangkan kesan "jajanan" agar tetap layak untuk toko resmi.
- **Jelas untuk semua umur** — kontras tinggi, tipografi besar dan tegas, karena target pembeli lintas generasi.

---

## 2. Palet Warna

### 2.1 Warna Inti

| Token | Hex | Peran |
|---|---|---|
| `--color-primary` | `#FDB813` | Aksi utama, CTA, highlight harga |
| `--color-secondary` | `#005B96` | Elemen pendukung, link, aksen kepercayaan |
| `--color-tertiary` | `#FFFDD0` | Latar lembut, area highlight ringan |
| `--color-neutral-900` | `#1A1A1A` | Teks utama, latar gelap (footer/nav) |

### 2.2 Skala Warna (Tint & Shade)

Gunakan skala ini untuk state (hover, disabled, background) dan hierarki visual — jangan buat warna baru di luar skala ini.

**Primary (Gold)**
```
--primary-900: #4A3200   (paling gelap — teks di atas primary jika perlu)
--primary-700: #8C6300
--primary-500: #FDB813   (base)
--primary-300: #FDD273
--primary-100: #FEEBB8
```

**Secondary (Blue)**
```
--secondary-900: #001F33
--secondary-700: #003D5C
--secondary-500: #005B96   (base)
--secondary-300: #4D8FBF
--secondary-100: #B3D1E8
```

**Tertiary (Cream)**
```
--tertiary-900: #7A7550   (olive gelap, untuk teks di atas cream)
--tertiary-700: #B0AA78
--tertiary-500: #FFFDD0   (base)
--tertiary-300: #FFFEE3
--tertiary-100: #FFFEF3
```

**Neutral (Grayscale)**
```
--neutral-900: #1A1A1A   (base — teks utama)
--neutral-700: #3D3D3D
--neutral-500: #6B6B6B
--neutral-300: #A6A6A6
--neutral-100: #E0E0E0
--neutral-0:   #FFFFFF
```

### 2.3 Warna Fungsional (Status)

Dipetakan dari swatch tombol ikon aksi (kuning/biru/olive/merah):

| Token | Hex | Penggunaan |
|---|---|---|
| `--status-info` | `#005B96` (secondary-500) | Info netral |
| `--status-success` | `#4A6B1F` (olive) | Berhasil disimpan, stok tersedia |
| `--status-warning` | `#FDB813` (primary-500) | Stok menipis |
| `--status-danger` | `#C81E1E` | Hapus, stok habis, error |

### 2.4 Aturan Kontras
- Teks di atas `primary-500`: gunakan `neutral-900`, **bukan** putih (kontras putih di atas kuning gagal WCAG AA).
- Teks di atas `secondary-500`/`neutral-900`: gunakan `neutral-0` (putih).
- Teks body minimal rasio kontras 4.5:1 — cek tiap kombinasi baru dengan tool contrast checker sebelum dipakai.

---

## 3. Tipografi

**Font tunggal: Montserrat** (headline, body, label) — dibedakan lewat *weight* dan *size*, bukan ganti-ganti font.

| Peran | Ukuran | Weight | Contoh Penggunaan |
|---|---|---|---|
| Display / Hero | 48–56px | 700 (Bold) | Judul hero halaman beranda |
| Headline | 28–34px | 700 (Bold) | Judul section ("Katalog Rasa") |
| Subheading | 18–20px | 600 (SemiBold) | Nama produk di kartu |
| Body | 15–16px | 400 (Regular) | Deskripsi, paragraf |
| Label / Caption | 12–13px | 500 (Medium), uppercase, letter-spacing 0.04em | Tag kategori, harga satuan, form label |

```css
--font-family: 'Montserrat', sans-serif;
--fs-display: 52px;
--fs-headline: 32px;
--fs-subheading: 19px;
--fs-body: 16px;
--fs-label: 12px;
--lh-body: 1.6;
--lh-heading: 1.15;
```

---

## 4. Komponen

### 4.1 Tombol (Button)

Empat varian, konsisten di seluruh situs — dari halaman katalog sampai panel admin.

| Varian | Latar | Teks | Border | Penggunaan |
|---|---|---|---|---|
| **Primary** | `primary-500` | `neutral-900` | none | Aksi utama: "Pesan via WhatsApp", "Simpan Produk" |
| **Secondary** | transparan | `neutral-900` atau `secondary-500` | none | Aksi kedua yang tidak menonjol: "Batal", link teks |
| **Inverted** | `neutral-900` | `neutral-0` | none | Di atas latar terang, untuk kontras kuat (nav gelap, footer CTA) |
| **Outlined** | transparan | `neutral-900` | 1.5px `neutral-300` | Aksi netral: "Lihat Detail", filter |

```css
.btn-primary   { background: var(--primary-500); color: var(--neutral-900); border-radius: 8px; font-weight: 600; }
.btn-secondary { background: transparent; color: var(--neutral-900); font-weight: 600; }
.btn-inverted  { background: var(--neutral-900); color: var(--neutral-0); border-radius: 8px; font-weight: 600; }
.btn-outlined  { background: transparent; border: 1.5px solid var(--neutral-300); color: var(--neutral-900); border-radius: 8px; }
```

Radius standar: **8px** untuk tombol & input, **12px** untuk card, **100px** (pill) khusus tombol WhatsApp agar terasa "actionable" dan berbeda dari tombol lain.

### 4.2 Search Input

- Latar `neutral-0`, border `neutral-100`, ikon kaca pembesar di kiri (warna `neutral-500`)
- Radius 8px, padding vertikal 10px
- Placeholder pakai `neutral-500`, teks input `neutral-900`

### 4.3 Navigasi Ikon (Icon Nav)

Kelompok ikon bulat (home, search, akun) seperti pada referensi:
- Bentuk lingkaran, diameter 40px
- Default: latar `neutral-100`, ikon `neutral-700`
- Aktif/selected: latar `primary-500`, ikon `neutral-900`

### 4.4 Label / Tag

- Bentuk pill, padding `4px 10px`, font label (12px, medium, uppercase)
- Varian "filled": latar `primary-500`, teks `neutral-900` — dipakai untuk tag rasa/kategori di kartu produk
- Varian "outline": border `neutral-300`, teks `neutral-700` — dipakai untuk tag netral (mis. berat produk)

### 4.5 Icon Action Buttons (Status Berwarna)

Tombol ikon bulat kecil (32px) untuk aksi cepat di panel admin — warna menandakan jenis aksi:

| Warna | Aksi |
|---|---|
| Gold (`primary-500`) | Edit |
| Biru (`secondary-500`) | Lihat detail / info |
| Olive (`status-success`) | Tandai tersedia/aktif |
| Merah (`status-danger`) | Hapus / nonaktifkan |

### 4.6 Card (Kartu Produk / Panel)

- Latar `neutral-0`, radius 12px, shadow lembut (`0 2px 8px rgba(26,26,26,0.06)`)
- Padding internal 20–24px
- Header opsional dengan latar `tertiary-500` untuk kartu highlight/promo

---

## 5. Spacing System

Skala 4px sebagai basis, dipakai konsisten untuk padding, margin, dan gap:

```
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 24px
--space-6: 32px
--space-7: 48px
--space-8: 64px
```

---

## 6. Ikonografi

- Gaya **line icon**, stroke width 1.5–2px, sudut membulat (rounded linecap/linejoin) — selaras dengan radius 8–12px pada komponen lain.
- Warna default ikon: `neutral-700`; ikon di dalam tombol mengikuti warna teks tombol.

---

## 7. Penerapan ke Halaman Bon Giri

| Elemen | Token yang dipakai |
|---|---|
| Latar utama halaman | `neutral-0` (bukan lagi navy gelap seperti draf sebelumnya) |
| Navbar & footer | `neutral-900` latar, teks `neutral-0`, logo/aksen `primary-500` |
| Hero section | Latar `tertiary-500` atau `neutral-0`, headline `neutral-900`, aksen highlight `primary-500` |
| Kartu produk (katalog) | Latar `neutral-0`, border tipis `neutral-100`, tag rasa pakai Label filled (`primary-500`) |
| Tombol "Pesan via WhatsApp" | `btn-primary`, radius pill 100px, agar berbeda dari tombol lain dan terasa jadi aksi utama |
| Badge "Stok Habis" | Label filled dengan `status-danger` |
| Panel admin — tabel produk | Icon action buttons (§4.5) di kolom aksi tiap baris |
| Panel admin — form tambah produk | Input & search style §4.2, tombol simpan `btn-primary`, batal `btn-secondary` |

---

## 8. Yang Berubah dari Draf Desain Sebelumnya

Draf mockup awal (nota/tiket berwarna navy-gold-coral) digantikan sistem ini agar konsisten dengan brand kit "Artisanal Crunch" yang sudah ditentukan. Perbedaan utama:
- Latar dasar berubah dari **navy gelap** → **terang (neutral-0/tertiary)**, kesan jadi lebih bersih dan approachable.
- Font accent (Fraunces serif + JetBrains Mono) digantikan **satu keluarga font: Montserrat** di semua peran teks.
- Warna CTA berubah dari **coral** → **gold (primary-500)**, selaras dengan warna dominan brand kit.

---

## 9. Referensi File Terkait

- Token warna & tipografi di atas dapat langsung dipetakan ke `tailwind.config.js` (`theme.extend.colors`, `theme.extend.fontFamily`) saat implementasi Next.js.
- Rekomendasi: simpan token sebagai CSS variables di `globals.css` agar bisa dipakai baik di komponen Tailwind maupun custom CSS.