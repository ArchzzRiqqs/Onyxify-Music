---
agent: agent
description: "Onyxify 07: Prisma schema, Auth.js, proteksi route"
---

# Task: Database & autentikasi

## Prisma schema (`prisma/schema.prisma`)

Model: `User`, `Account`, `Session` (sesuai Auth.js adapter), `Playlist`, `PlaylistTrack`, `LikedTrack`, `RecentlyPlayed`.

- Track eksternal **tidak** disalin penuh. Simpan snapshot minimal (`provider`, `externalId`, `title`, `artists`, `coverUrl`, `durationSec`) di `PlaylistTrack`/`LikedTrack` agar playlist tetap tampil walau provider lambat.
- `Playlist`: `id (cuid)`, `ownerId`, `name`, `description?`, `isPublic`, timestamps.
- `PlaylistTrack`: `position` (int), unique `(playlistId, position)`, unique `(playlistId, provider, externalId)`.
- Index: `Playlist(ownerId, updatedAt)`, `LikedTrack(userId, createdAt)`, `RecentlyPlayed(userId, playedAt)`.

## Auth

1. Auth.js dengan session cookie `httpOnly`. Provider: Google OAuth + Credentials opsional (jika Credentials, hash dengan `argon2`/`bcrypt`, validasi password min 10 char).
2. `middleware.ts` melindungi `/library`, `/playlist/*/edit`, dan semua `/api` mutasi.
3. Helper `requireUser()` di `lib/auth.ts` (server-only) untuk use-case.
4. Halaman `/login` bergaya Onyxify, dengan state error yang jelas dan tanpa membocorkan apakah email terdaftar.
5. Seed script (`prisma/seed.ts`) untuk data dev.

## Constraint

- Tidak ada raw SQL. Operasi multi-tulis memakai `prisma.$transaction`.
- Rate limit login (mis. 5 percobaan/menit/IP).

## Tests

Unit: `requireUser`. Integration: akses resource milik user lain harus 403/404.

## Acceptance criteria

- User tak login yang membuka `/library` diarahkan ke `/login`.
- `pnpm prisma migrate dev` dan `pnpm prisma db seed` berjalan bersih.
