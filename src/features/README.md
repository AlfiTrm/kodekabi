# Features Structure

Project ini memakai dua surface utama:

- `public-site`: marketing/public experience sebelum autentikasi
- `main-site`: aplikasi utama setelah user masuk

Aturan umum:

- `src/app` hanya untuk routing, layout, dan composition entry.
- `src/features/public-site` menampung slice halaman untuk public site.
- `src/features/main-site` menampung slice halaman untuk main app.
- `src/shared` hanya untuk primitive dan utilitas global lintas dua surface.

Pola folder feature bersifat opsional sesuai kebutuhan halaman:

```txt
feature-name/
  components/
  containers/
  hooks/
  types/
  data/
  services/
```

Reusable yang masih spesifik satu surface diletakkan di `_shared` milik surface tersebut, bukan langsung dinaikkan ke `src/shared`.
