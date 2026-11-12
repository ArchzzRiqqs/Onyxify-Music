---
agent: agent
description: "Onyxify 09: queue panel, sleep timer, lirik, tema dinamis"
---

# Task: Fitur pelengkap pemutar

Kerjakan satu per satu, commit-able secara terpisah.

1. **Queue panel** (drawer kanan di desktop, sheet di mobile): "Sedang diputar" + "Berikutnya", drag reorder, hapus item, tombol "Bersihkan antrean". Terhubung ke `player.store`.
2. **Full-screen player** (mobile & opsional desktop): cover besar, seek bar, kontrol, transisi `layout` halus dari mini player, tutup dengan swipe-down/`Esc`.
3. **Sleep timer**: pilihan 5/15/30/60 menit atau "akhir track". Fade-out volume 3 detik sebelum pause. Batalkan saat user play manual.
4. **Lirik**: parser `.lrc` (`src/features/lyrics/parse-lrc.ts`, pure function + unit test), tampilan lirik tersinkron dengan auto-scroll ke baris aktif. Jika lirik tak tersedia → empty state.
5. **Tema dinamis**: ekstrak warna dominan cover (canvas kecil 32x32, di client, dengan fallback ke `--accent`) untuk gradien header. Pastikan kontras teks tetap AA.

## Constraint

- Tidak menambah library berat. Ekstraksi warna harus ringan (< 1KB logika kustom).
- Semua animasi mengikuti `prefers-reduced-motion`.

## Acceptance criteria

- Parser `.lrc` menangani timestamp ganda per baris, offset `[offset:]`, dan baris rusak tanpa crash.
- Sleep timer tidak bocor (interval dibersihkan) dan tetap akurat saat tab di background.
