---
agent: agent
description: "Onyxify 06: halaman Home, Search, Album, Artist"
---

# Task: Browse & Search

## Kerjakan

1. **Home** (`/`): sapaan sesuai waktu, grid "Quick picks" (6 item), rail horizontal per section (Featured, Genre, Baru dirilis). Data dari server.
2. **Search** (`/search`):
   - Input dengan debounce 300ms, sinkron ke URL (`?q=`) supaya bisa dibagikan dan back/forward bekerja.
   - Batalkan request lama saat query berubah (race-safe).
   - Hasil dikelompokkan (Top result, Tracks, Albums, Artists). State: idle (grid genre), loading, empty, error.
   - Navigasi hasil dengan keyboard (`↑/↓`, `Enter` memutar).
3. **Album** (`/album/[id]`) dan **Artist** (`/artist/[id]`): header besar dengan gradien dari warna dominan cover, tombol play/shuffle, daftar `TrackRow` (virtualized bila > 100).
4. `TrackRow`: klik dua kali / `Enter` memutar dan menjadikan daftar itu sebagai queue; menu aksi (Putar berikutnya, Tambah ke antrean, Tambah ke playlist, Salin tautan).
5. Indikator "sedang diputar" (equalizer bars mini) pada track aktif.

## Constraint

- Fetch awal di Server Component. TanStack Query hanya untuk interaksi client (search).
- Tidak ada waterfall request. Paralelkan dengan `Promise.all`.

## Tests

- Component: Search (debounce, empty, error), TrackRow (aksi menu).
- e2e: cari → putar → pindah halaman → audio tetap jalan.

## Acceptance criteria

- Mengetik cepat tidak menghasilkan hasil basi (stale).
- LCP halaman Home < 2.5s pada throttled 4G (cek Lighthouse).
