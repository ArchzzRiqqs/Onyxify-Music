---
applyTo: "src/app/api/**/*.ts,src/features/**/server/**/*.ts,src/lib/**/*.ts,prisma/**/*"
---

# Backend rules (Onyxify)

## Layering

`route handler` → `use-case` → `repository / provider` → `Prisma / HTTP`

- Route handler: parse (Zod) → panggil use-case → return `NextResponse.json`. Maksimal ±25 baris.
- Use-case: fungsi murni bisnis, menerima dependency lewat parameter (mudah di-test).
- Repository: satu-satunya tempat yang menyentuh Prisma.
- Provider eksternal: implementasi `MusicProvider`, response selalu divalidasi Zod lalu dipetakan ke tipe domain.

## Kontrak API

- Format sukses: `{ data, meta? }`. Format error: `{ error: { code, message, details? } }`.
- Status code benar (400 validasi, 401 unauth, 403 forbidden, 404, 409, 429, 500).
- Pagination: cursor-based (`cursor`, `limit` max 50). Jangan offset untuk list besar.
- Jangan bocorkan stack trace atau pesan internal ke client.

## Keamanan

- `import 'server-only'` di modul yang memakai secret.
- Cek auth + ownership di setiap mutasi (`playlist.ownerId === session.user.id`).
- Rate limit per IP/user di endpoint search, auth, dan mutasi.
- Sanitasi dan batasi panjang string (`z.string().trim().min(1).max(...)`).
- Env: parse lewat Zod di `lib/env.ts`, gagal cepat saat startup.

## Database (Prisma)

- Index untuk kolom yang di-filter/sort (`ownerId`, `createdAt`, `(playlistId, position)`).
- Gunakan transaksi untuk operasi multi-tulis (reorder playlist).
- Pakai `select` eksplisit. Hindari over-fetch dan N+1 (`include` seperlunya).
- Migrasi kecil dan reversible. Jangan edit migrasi yang sudah di-apply.
