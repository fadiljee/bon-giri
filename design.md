# Design System & Motion Specification (`DESIGN.md`)

**Gaya Desain:** Architectural Minimalism · Editorial Scrollytelling · Tactile D2C  
**Target Aplikasi:** Website Flagship Storefront UMKM  
**Mode Tema:** Dual-Theme (`light` default, `dark` opsional via `[data-theme]`)

---

## 1. Filosofi Visual & Prinsip Desain

Desain ini dibangun untuk memberikan kesan **produk lokal berkualitas tinggi, kokoh, dan terpercaya** melalui ketenangan ruang kosong (*whitespace*), tipografi editorial berukuran besar, serta interaksi berbasis sentuhan fisik (*tactile physics*).

### Aturan Inti (*Design Constitution*)
1. **Aturan Warna 60-30-10**:
   - **60% Kanvas Netral**: Latar belakang halaman yang bersih dan tidak menyilaukan.
   - **30% Permukaan Struktural**: Kontainer kartu, garis pemisah tipis (`1px`), dan teks sekunder.
   - **10% Aksen Aksi**: Warna merek UMKM difokuskan hanya pada tombol CTA utama, status aktif, dan indikator terpilih.
2. **Tanpa Hitam/Putih Murni**: Menghindari `#000000` dan `#ffffff` murni agar kontras terasa lebih natural seperti material batu mineral dan kertas arsitektural.
3. **Konsistensi Bentuk (*Shape Lock*)**: Hanya ada 2 radius sudut di seluruh aplikasi:
   - **Kartu & Media**: `12px` (`--radius-card`)
   - **Tombol, Kontrol, & Indikator**: `999px` (`--radius-pill`)
4. **Anti-Clutter Marketplace**: Tidak menggunakan *badge* diskon berkedip, label status dekoratif, atau kotak di dalam kotak (*nested cards*).

---

## 2. Sistem Token Warna (*Design Tokens*)

Seluruh warna diatur menggunakan CSS Custom Properties pada `:root` dan `:root[data-theme='dark']`. Untuk menyesuaikan identitas merek UMKM, cukup mengganti nilai token `--accent` dan `--accent-hover`.

| Token CSS | Mode Terang (`light` - Default) | Mode Gelap (`dark`) | Fungsi Penggunaan |
| :--- | :--- | :--- | :--- |
| `--bg` | `#f3f6f4` | `#0c100e` | Latar belakang utama halaman (`body`, `html`) |
| `--surface` | `#e8eeea` | `#141a17` | Latar kartu Bento, panel preview, kontrol segmented, dan drawer |
| `--surface-elevated` | `#dde5e0` | `#1b221e` | Keadaan aktif pada opsi varian, tile spesifikasi, dan hover tombol ikon |
| `--text-primary` | `#111614` | `#eff3f1` | Judul utama, harga, dan teks konten primer |
| `--text-secondary` | `#48544e` | `#98a49e` | Subjudul, label spesifikasi, link navigasi pasif, dan footer |
| `--border` | `rgba(17, 22, 20, 0.12)` | `rgba(239, 243, 241, 0.12)` | Garis pemisah tipis (`1px`) pada kartu, tabel spek, dan header |
| `--border-strong` | `rgba(17, 22, 20, 0.24)` | `rgba(239, 243, 241, 0.24)` | Border tombol ghost, badge spek, dan state aktif |
| `--accent` | `#3d5740` | `#48634b` | Tombol CTA primer, badge jumlah keranjang, state aktif segmented control |
| `--accent-hover` | `#314734` | `#56765a` | Efek hover tombol CTA primer |
| `--accent-text` | `#f3f6f4` | `#f4f6f5` | Teks di atas warna `--accent` |
| `--glass-bg` | `rgba(243, 246, 244, 0.8)` | `rgba(18, 24, 21, 0.72)` | Latar glassmorphism header, swatch bar, dan spec badge |
| `--glass-border` | `rgba(17, 22, 20, 0.14)` | `rgba(239, 243, 241, 0.16)` | Garis tepi elemen kaca |
| `--shadow-tinted` | `0 24px 64px rgba(17, 22, 20, 0.12)` | `0 24px 64px rgba(5, 8, 7, 0.56)` | Bayangan halus bernuansa kanvas |

### Kalibrasi Warna Produk via CSS Filter
Untuk UMKM yang hanya memiliki 1 foto studio produk berlatar transparan (*cutout*) namun ingin menampilkan beberapa varian warna secara instan:
- **Varian Default (Netral/Sage)**: Tanpa filter warna tambahan, hanya `drop-shadow(0 28px 42px rgba(5, 8, 7, 0.36))`.
- **Varian Gelap (Basalt/Hitam)**: `filter: saturate(0.14) brightness(0.68) contrast(1.18) drop-shadow(...)`
- **Varian Terang (Glacier/Silver)**: `filter: saturate(0.08) brightness(1.38) contrast(1.08) drop-shadow(...)`
*(Catatan: Untuk produk UMKM dengan warna berbeda total seperti batik atau makanan berbeda rasa, disarankan mengganti `src` gambar langsung per varian).*

---

## 3. Tipografi & Skala Hirarki

Menggunakan aturan **1 Keluarga Sans-Serif + 1 Monospace Teknis**:
- `--font-sans`: `'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif` (Bobot `400`, `500`, `700`)
- `--font-mono`: `'DM Mono', monospace` (Bobot `400`–`700`)

| Elemen | Ukuran (`font-size`) | Bobot | Tracking (`letter-spacing`) | Line Height | Catatan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title** (`.hero-title`) | `clamp(3.4rem, 6.4vw, 6rem)` | `700` | `-0.04em` | `0.98` | Judul editorial rapat, maks. 3–4 kata |
| **Showcase Title** (`.caption-title`) | `clamp(2.5rem, 5.2vw, 4.75rem)` | `700` | `-0.04em` | `0.98` | Putih (`#f4f6f5`) langsung di atas gradient scrim |
| **Section Title** (`.section-title`) | `clamp(2.5rem, 4.7vw, 4rem)` | `700` | `-0.035em` | `1.04` | Judul per bagian |
| **Bento Tile Title** (`.bento-title`) | `clamp(1.5rem, 2.2vw, 2rem)` | `700` | `-0.025em` | `1.08` | Judul di pojok kiri bawah kartu Bento |
| **Metric Value** (`.metric-value`) | `31px` | `700` | `-0.02em` | `1.2` | Menggunakan `--font-mono` |
| **Order Price** (`.order-price`) | `26px` | `500` | `normal` | `1.3` | Menggunakan `--font-mono` |
| **Body Dasar** (`html`) | `17.5px` | `400` | `normal` | `1.5` | Subjudul memakai `18px` (`max-width: 42ch`) |

---

## 4. Sistem Grid, Spasial & Responsivitas

### Kontainer Global
```
┌─────────────────────────────────────────────────────────────────────────┐
│ .container (max-width: 1360px, margin-inline: auto)                     │
│ padding-inline: clamp(20px, 4vw, 48px)                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Struktur Grid per Bagian (Desktop `> 768px` vs Mobile `<= 768px`)

1. **Header (`.site-header`)**:
   - Tinggi tetap `64px`, `position: fixed`, `z-index: 50`, `backdrop-filter: blur(18px)`.
   - Pada mobile (`<= 768px`), `.nav-link` disembunyikan sehingga hanya menyisakan Logo di kiri dan tombol Tema + Keranjang di kanan.

2. **Hero Split (`.hero-grid`)**:
   - Desktop: `grid-template-columns: 1.05fr 0.95fr`, `gap: clamp(32px, 5vw, 72px)`, tinggi minimal `100dvh`.
   - Mobile: Kolom tunggal (`1fr`), teks di atas (`order: 1`), panggung produk di bawah (`order: 2`), `.hero-swatches` melingkar (*wrap*) dengan `border-radius: 24px`.

3. **Pinned Showcase (`.showcase-viewport`)**:
   - Ukuran penuh `100% × 100dvh`, `overflow: hidden`.
   - **Contrast Scrim** (`.showcase-viewport::after`): Gradasi vertikal dari `rgba(10, 14, 12, 0.72)` di bawah ke `transparent` pada `70%` tinggi agar teks caption putih selalu kontras terbaca.
   - Pada perangkat berorientasi potret (`@media (max-aspect-ratio: 3 / 4)`), posisi fokus foto bergeser ke `object-position: 72% 0%`.

4. **Comparison Section (`.thermal-grid`)**:
   - Desktop: `grid-template-columns: 1.35fr 1fr`.
   - Frame pembanding: `aspect-ratio: 16 / 10`, `cursor: ew-resize`, `touch-action: pan-y` agar tidak mengganggu scroll vertikal di ponsel.

5. **Editorial Bento Grid (`.bento-grid`)**:
   ```
   Desktop (12 Kolom × 2 Baris):
   ┌─────────────────────────────┬───────────────────────┐
   │                             │  bento-top            │
   │  bento-tall                 │  (5 kolom × 1 baris)  │
   │  (7 kolom × 2 baris)        ├───────────────────────┤
   │  minmax(260px, 320px) × 2   │  bento-bottom         │
   │                             │  (5 kolom × 1 baris)  │
   └─────────────────────────────┴───────────────────────┘

   Mobile (<= 768px):
   Menumpuk vertikal (1 kolom), masing-masing min-height: 300px.
   ```

6. **Order Configurator (`.order-grid`) & Drawer (`.bag-drawer`)**:
   - Desktop: `grid-template-columns: 1.05fr 0.95fr`, panel preview berasio `aspect-ratio: 4 / 5`.
   - Drawer Keranjang: `width: min(400px, 100vw)`, `z-index: 80`, di atas backdrop blur (`z-index: 70`).

---

## 5. Spesifikasi Motion, Scroll, & Grafis Prosedural

### A. Kurva Easing Standar
- `--ease-out`: `cubic-bezier(0.23, 1, 0.32, 1)` — digunakan pada hover tombol, perpindahan tema, skala produk, dan slider preset.
- `--ease-in-out`: `cubic-bezier(0.77, 0, 0.175, 1)` — untuk transisi simetris.
- `--ease-drawer`: `cubic-bezier(0.32, 0.72, 0, 1)` — kurva masuk/keluar drawer bergaya iOS sheet, dipasangkan dengan CSS `@starting-style`.
- **Feedback Sentuhan (`:active`)**: Tombol utama menyusut halus `scale(0.97)` (`.btn:active`, `.pill-option:active`) dan tombol ikon/kuantitas `scale(0.95)` / `0.92`.

### B. Smooth Scroll (Lenis) + GSAP ScrollTrigger
- **Lenis Config**: `duration: 1.05`, `smoothWheel: true`, kurva eksponensial `Math.min(1, 1.001 - Math.pow(2, -10 * t))`.
- Terhubung langsung ke loop frame GSAP via `lenis.on('scroll', ScrollTrigger.update)` dan `gsap.ticker.lagSmoothing(0)`.

### C. Koreografi Efek Scroll di Bagian Produk

#### 1. Pinned Clip-Path Wipe Showcase (`#showcase`)
```
Progres Timeline GSAP (t = self.progress * 3.5):
0.00 ─────── 0.25 ──────── 1.05 ──── 1.30 ──────── 2.10 ──── 2.35 ──────── 3.15 ─── 3.50
  │   Dwell   │   Wipe 2    │  Dwell  │   Wipe 3    │  Dwell  │   Wipe 4    │  Dwell │
  │ Frame 1   │ inset 100→0 │ Frame 2 │ inset 100→0 │ Frame 3 │ inset 100→0 │ Frame 4│
                         ▲                     ▲                     ▲
                  t >= 0.97             t >= 2.02             t >= 3.07
               Caption → Stage 2     Caption → Stage 3     Caption → Stage 4
               (Blur 3px 100ms)      (Blur 3px 100ms)      (Blur 3px 100ms)
```
- **Trigger**: `start: 'top top'`, `end: '+=280%'`, `pin: true`, `scrub: 0.65`.
- **Wipe**: Setiap frame menumpuk absolut (`position: absolute; inset: 0`) dan terbuka dari kanan ke kiri via `clipPath: 'inset(0 0 0 100%)'` menjadi `'inset(0 0 0 0%)'` dengan `ease: 'none'` selama durasi `0.8` per transisi.

#### 2. Bento Staggered Reveal (`#craft`)
- Animasi masuk: `from({ y: 28, scale: 0.96, opacity: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out' })`.
- Trigger: `start: 'top 82%'`, `once: true`, dengan `clearProps: 'transform,opacity'` setelah selesai agar efek hover CSS `scale(1.03)` pada gambar tetap bekerja bersih.

### D. Efek Interaktif Non-Scroll
1. **Hero 3D Pointer Tilt**:
   - Kontainer `.hero-stage` memakai `perspective: 1200px`.
   - Sudut target: `rotY = nx * 14deg`, `rotX = -ny * 10deg`.
   - Perhitungan fisika per frame: akselerasi `0.08` dan redaman kecepatan (*damping*) `0.82`.
   - Bayangan `.flask-shadow` ikut bergeser berlawanan (`translateX = -curRotY * 1.4px`).
2. **Comparison Slider (`#thermal`)**:
   - Lapisan depan (`.comparison-cold`) dipotong dari kanan sebesar `(100 - splitPct)%` via `clipPath: inset(0 ${100 - splitPct}% 0 0)`.
   - Saat di-drag manual, `transition` dimatikan (`none`) agar respons 1:1 dengan jari/mouse. Saat klik tombol tab atau panah keyboard, `transition: 380ms var(--ease-out)` diaktifkan.
   - Ketika `splitPct <= 2` atau `>= 98`, kelas `.is-edge` aktif untuk menyembunyikan garis vertikal (`opacity: 0`) agar kenop tidak memotong tepi frame.

### E. Latar Prosedural WebGL2 & Canvas 2D
1. **WebGL2 Topographic Contour (`heroCanvas`)**:
   - Shader fragmen prosedural menghitung dua lapis *value noise* (`elev = n1 * 0.65 + n2 * 0.35`) yang menghasilkan garis kontur topografi halus (`fract(elev * 9.0)`).
   - Cahaya *ambient glow* mengikuti kursor secara halus (`lerp 0.08`) dengan peluruhan Gaussian `exp(-dist * dist * 2.4)`.
   - Warna latar dan garis kontur otomatis beradaptasi membaca atribut `data-theme` melalui uniform `u_isDark`.
2. **Canvas 2D Rotating Wireframe (`specsCanvas`)**:
   - Menggambar 9 cincin elips horizontal dan 12 garis meridian 3D secara prosedural.
   - Kecepatan putar dasar `0.008 rad/frame`, bertambah `+0.018` saat kursor diarahkan ke tile Bento (`pointerenter`).
   - Dapat diganti dengan siluet koordinat cincin (`rings`) produk UMKM (misalnya bentuk cangkir, botol madu, atau tas) dengan mengubah array `{ y, r }`.

### F. Lapisan Tekstur & Aksesibilitas Motion
- **Film Grain Overlay (`.grain-overlay`)**: `position: fixed; inset: 0; z-index: 60; pointer-events: none; opacity: 0.025;` menggunakan pola titik radial `24px × 24px` (nol *repaint* saat scroll).
- **Reduced Motion (`@media (prefers-reduced-motion: reduce)`)**:
  - Mematikan `scroll-behavior: smooth`, mengunci rotasi 3D Hero ke `transform: none`, menghentikan animasi `requestAnimationFrame` pada WebGL2/Canvas 2D setelah render frame pertama, dan memangkas durasi animasi/transisi CSS menjadi `0.01ms`.
