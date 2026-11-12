---
agent: agent
description: "Onyxify 13: multi-provider (Audius, Internet Archive) + dedupe"
---

# Task: Tambah sumber musik legal

Ikuti `.github/copilot-instructions.md` dan `.github/instructions/backend.instructions.md`.

1. Buat `AudiusProvider` dan `InternetArchiveProvider` yang mengimplementasi `MusicProvider` (respons divalidasi Zod, timeout 8s, retry 1x untuk 5xx, mapping ke tipe domain, error `ProviderError`).
2. Buat `CompositeProvider`: panggil provider aktif paralel dengan `Promise.allSettled`, gabungkan hasil, hapus duplikat (judul + artis + durasi yang dinormalisasi), dan kembalikan hasil parsial jika satu provider gagal.
3. Konfigurasi lewat env: `MUSIC_PROVIDERS=jamendo,audius,archive` (validasi di `lib/env.ts`, nilai tak dikenal = error saat startup).
4. Tambahkan `source` dan `license` pada `Track`, tampilkan atribusi lisensi di UI detail track.
5. Unit test: dedupe, partial failure, mapper tiap provider (MSW untuk HTTP).

## Constraint

- Jangan ubah UI selain atribusi sumber/lisensi.
- Jangan scraping sumber tak berlisensi.
- Jangan bocorkan bentuk respons provider keluar dari file provider-nya.

## Acceptance criteria

- Mematikan satu provider tidak membuat search gagal.
- Hasil duplikat antar provider tidak muncul dua kali.
- Setiap track menampilkan sumber dan lisensinya.
