# Onyxify: Copilot Global Instructions

Onyxify adalah web app streaming musik bertema gelap dengan UX ala Spotify (sidebar, player bar permanen, library, playlist, search, queue).

## Tech stack (jangan ganti tanpa diminta)

- Next.js (App Router) + React + TypeScript `strict`
- Tailwind CSS + shadcn/ui (Radix) + `lucide-react`
- State: Zustand (UI/player state), TanStack Query (server state)
- Validasi: Zod di semua boundary (API input, env, response provider eksternal)
- DB: PostgreSQL + Prisma
- Auth: Auth.js
- Test: Vitest + React Testing Library, Playwright untuk e2e
- Package manager: pnpm

## Bahasa

- Kode, nama variabel, komentar, commit: **English**.
- Teks UI: **Bahasa Indonesia**, semua string terpusat di `src/lib/i18n/id.ts` (siap diganti locale lain).
- Penjelasan ke developer: Bahasa Indonesia, istilah teknis tetap English.

## Arsitektur (feature-first, Clean Architecture ringan)

```
src/
├── app/                      # routes, layouts, route handlers (tipis, tanpa logika bisnis)
├── features/
│   └── <feature>/
│       ├── components/       # UI khusus fitur
│       ├── hooks/
│       ├── server/           # use-case, repository, provider (server-only)
│       ├── schemas.ts        # Zod schemas + inferred types
│       └── types.ts
├── components/ui/            # shadcn primitives
├── components/shared/        # reusable lintas fitur
├── lib/                      # env, db, i18n, utils, logger
└── styles/
```

- Dependensi searah: `app` → `features` → `lib`. Fitur tidak boleh import dari fitur lain, lewat `shared` atau `lib`.
- Route handler hanya: parse input (Zod) → panggil use-case → map ke response. Tanpa logika bisnis.
- Akses data eksternal selalu lewat interface (`MusicProvider`), bukan fetch langsung dari komponen.

## Domain inti

`Track`, `Album`, `Artist`, `Playlist`, `PlaybackState`, `QueueItem`. Tipe diturunkan dari Zod schema (`z.infer`), bukan ditulis ganda.

## Audio (aturan keras)

- Satu `AudioEngine` singleton membungkus **satu** `HTMLAudioElement`. Player bar ada di root layout agar tidak ter-unmount saat navigasi.
- Zustand store = sumber kebenaran state UI player; engine mengirim event ke store, bukan sebaliknya secara dua arah liar.
- Wajib implementasi Media Session API (metadata, play/pause/next/prev/seek).
- Jangan taruh audio logic di dalam render atau `useEffect` yang bergantung state tak stabil.

## Legal & sumber musik

- Hanya audio berlisensi: Jamendo (Creative Commons), upload user dengan hak sah, atau file sendiri.
- **Jangan** scraping/ripping Spotify, YouTube, atau sumber tak berlisensi.
- Jangan pakai nama, logo, atau hijau `#1DB954` milik Spotify. Aksen Onyxify memakai CSS variable `--accent`.

## Security

- Semua input dari luar divalidasi Zod. Env divalidasi saat startup (`src/lib/env.ts`).
- Secret hanya di env server. Jangan pernah ke client bundle atau `NEXT_PUBLIC_*`.
- Jangan simpan token di `localStorage`. Gunakan cookie `httpOnly`, `secure`, `sameSite=lax`.
- Authorization dicek di server pada setiap mutasi (cek kepemilikan resource).
- Rate limit endpoint publik dan auth. Set security headers + CSP.
- Query DB hanya lewat Prisma. Tidak ada raw SQL tanpa parameter.

## Performance

- Server Components secara default. `'use client'` hanya di leaf yang butuh interaksi.
- `next/image` dengan ukuran eksplisit. Virtualisasi list > 100 item.
- Hindari re-render player bar: selector Zustand yang sempit.
- Cache response provider (revalidate/`unstable_cache`) dan hindari N+1 di Prisma.

## Gaya kode

- Fungsi kecil, satu tanggung jawab. Hindari `any`. Gunakan `unknown` + narrowing.
- Early return, tanpa nested conditional dalam. Hindari abstraksi prematur (KISS, DRY setelah 3x duplikasi).
- Error: gunakan typed result/error class, jangan telan error diam-diam. Log lewat `lib/logger`.
- Setiap komponen interaktif: keyboard accessible, `aria-*` benar, focus ring terlihat.
- Jangan tambahkan dependency baru tanpa alasan. Sebutkan alasannya.

## Cara kerja

- Untuk tugas besar: tulis rencana singkat dulu (file yang disentuh, urutan, risiko), baru kerjakan.
- Diff kecil dan fokus. Jangan refactor di luar scope.
- Jika requirement ambigu, ajukan pertanyaan singkat, jangan menebak.
- Setelah selesai: jelaskan apa yang berubah, edge case yang ditangani, dan cara menjalankan test.
