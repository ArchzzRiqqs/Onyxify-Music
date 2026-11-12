---
agent: agent
description: "Onyxify 15: perbaiki temuan code review"
---

# Task: Perbaiki temuan review

Ikuti `.github/copilot-instructions.md` dan `backend.instructions.md`.
Kerjakan SATU kelompok per sesi, sebutkan kelompoknya saat memanggil prompt ini.

## Kelompok A: Data integrity (repository)

1. addTrack: hitung posisi di dalam $transaction (isolation Serializable)
   dengan retry terbatas untuk P2002/P2034.
2. reorderTracks: satu $transaction, geser posisi ke offset sementara lalu set
   posisi final; rollback penuh bila gagal.
3. Ganti toggleLike dengan like (upsert) dan unlike (deleteMany) yang idempoten
   (PUT/DELETE), lalu sesuaikan optimistic update di klien.
4. Test konkurensi: add-track paralel, reorder paralel, like/unlike berulang.

## Kelompok B: API

1. `handleRoute` terpusat: ZodError→400, AppError→status-nya, lainnya→500
   tanpa detail internal. Terapkan ke semua route handler.
2. Contract test: input malformed → 400 dengan format error standar.
3. /api/health: force-dynamic, SELECT 1 tiap request, no-store; test saat DB putus.
4. next.config: images.remotePatterns hanya untuk host provider yang dipakai
   (tanpa wildcard) + test konfigurasi.

## Kelompok C: Rate limit & domain

1. Ganti Map in-memory dengan limiter terdistribusi (Upstash) + TTL; ambil IP
   dari sumber tepercaya (bukan x-forwarded-for mentah); limit login juga
   per-identifier akun. Sediakan fallback in-memory hanya untuk dev.
2. Tambahkan `provider` ke Track dan teruskan ke payload library
   (hapus hardcode 'jamendo' di player-bar dan browse-detail).
3. Test: spoofing header, perilaku multi-instance, provider benar tersimpan.

Constraint: diff kecil, tanpa refactor di luar scope. Jangan melonggarkan aturan.
Acceptance: semua test lama + baru lulus; tiap temuan punya test regresi.
