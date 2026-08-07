# Frontend Responsive Conventions

Konvensi ini jadi acuan layout responsif untuk `public-site` dan `main-site`.

## 1. Prinsip Utama

- Selalu `mobile-first`.
- Utamakan layout fluid dulu, breakpoint belakangan.
- `Container` mengatur lebar halaman, bukan perilaku komponen.
- Komponen harus tetap bisa adaptif walau tanpa banyak media query.
- Pakai breakpoint hanya saat layout memang perlu berubah, bukan sebagai default reflex.

## 2. Breakpoint yang Dipakai

Gunakan breakpoint bawaan Tailwind secara hemat:

- `default`: mobile
- `sm`: layar kecil ke tablet kecil
- `lg`: desktop
- `xl`: hanya jika benar-benar perlu untuk density/layout besar

Hindari custom breakpoint kecuali ada kebutuhan produk yang jelas.

## 3. Container

Semua halaman dan section utama menggunakan `SiteContainer`.

File:
- [src/shared/components/layout/site-container.tsx](/abs/path/D:/Project_Alfi/kabi-kode/kodekabi/src/shared/components/layout/site-container.tsx)

Kontrak dasar container:

- `max-w-[1390px]`
- `px-5` untuk mobile
- `sm:px-6`
- `lg:px-10`

Aturan:

- Jangan kasih `max-width` baru di tiap section kalau bukan kasus khusus.
- Kalau perlu varian lebih sempit untuk konten baca panjang, buat varian container khusus, jangan override acak per page.

## 4. Section Spacing

Gunakan ritme vertikal konsisten:

- section padat: `py-10 sm:py-12 lg:py-16`
- section normal: `py-12 sm:py-16 lg:py-20`
- hero / section besar: `py-16 sm:py-20 lg:py-28`

Aturan:

- Jangan campur terlalu banyak nilai spacing acak antar section.
- Naikkan spacing karena hierarchy, bukan karena feeling.

## 5. Grid dan Layout

### Untuk row sederhana

- Pakai `flex`
- Aktifkan `flex-wrap` jika item bisa turun baris

### Untuk daftar kartu / section 2D

- Pakai `grid`
- Pola default:

```tsx
className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
```

Atau jika cocok untuk layout fluid:

```css
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
```

Aturan:

- Jangan pakai fixed width card kalau bisa pakai grid responsif.
- Jangan pakai grid untuk layout 1 dimensi yang cukup diselesaikan dengan flex.

## 6. Typography

- Heading besar gunakan `clamp()` bila perlu.
- Jangan biarkan heading overflow di tablet/mobile.
- Prioritaskan wrapping yang rapi dibanding mempertahankan size besar.

Pola umum:

```tsx
className="text-[clamp(2.5rem,6vw,5rem)]"
```

Tambahan:

- heading: `text-wrap: balance`
- paragraf panjang: `text-wrap: pretty`

## 7. Navigation

### Public Navbar

- Desktop: logo kiri, nav tengah, CTA kanan
- Mobile/tablet: boleh jadi horizontal scroll ringan atau pola collapse

### Main Navbar

- Fokus ke navigasi inti aplikasi
- Mobile bisa berubah jadi tab bar atau compact nav, bukan miniatur navbar desktop

Aturan:

- Jangan paksa desktop layout bertahan persis di mobile.
- Prioritaskan action utama dan readability.

## 8. Component Adaptation

Saat bikin komponen, cek 4 layer ini:

1. apakah lebarnya ikut container?
2. apakah spacing internal tetap aman di mobile?
3. apakah content bisa wrap tanpa pecah?
4. apakah action tetap reachable di layar kecil?

Checklist:

- tidak ada overflow horizontal yang tidak disengaja
- tidak ada text clipping
- tombol tetap bisa disentuh
- gap tidak terlalu rapat di mobile
- image/video tetap proporsional

## 9. Kapan Pakai Breakpoint

Pakai breakpoint jika:

- jumlah kolom berubah
- alignment berubah signifikan
- CTA perlu dipindah prioritas
- navigation perlu mode lain
- ukuran media perlu dibatasi ulang

Jangan pakai breakpoint jika masalahnya bisa selesai dengan:

- `flex-wrap`
- `minmax`
- `clamp`
- width `w-full`
- `max-w-*`

## 10. Khusus Project Ini

### Public Site

- lebih bebas secara visual
- section bisa lebih lebar dan dramatik
- tetap wajib rapi di mobile karena first impression penting

### Main Site

- lebih ketat dan utilitarian
- density lebih tinggi boleh, tapi hierarchy harus jelas
- responsif harus memprioritaskan usability, bukan efek visual

## 11. Rule of Thumb

- `Container` untuk batas halaman
- `Section` untuk ritme
- `Component` untuk adaptasi
- `Content` untuk prioritas

Kalau ragu, mulai dari mobile dengan layout paling sederhana yang tetap kuat, lalu scale up ke desktop.
