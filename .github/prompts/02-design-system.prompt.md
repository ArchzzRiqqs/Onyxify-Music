---
agent: agent
description: "Onyxify 02: design tokens, tema gelap, komponen dasar"
---

# Task: Design system & tema Onyxify

Gunakan design tokens di `.github/instructions/frontend.instructions.md`.

## Kerjakan

1. Definisikan CSS variables (bg, surface, elevated, border, text, muted, accent) di `globals.css`, terhubung ke Tailwind theme. Tema gelap sebagai default.
2. Setup font via `next/font` (satu family) dan skala tipografi (display, h1, h2, body, caption).
3. Install komponen shadcn: `button`, `input`, `slider`, `dropdown-menu`, `dialog`, `tooltip`, `scroll-area`, `skeleton`, `sonner`.
4. Buat komponen reusable di `components/shared/`:
   - `CoverImage` (next/image, fallback gradient, rounded)
   - `PlayButton` (bulat, ukuran sm/md/lg, state playing/paused)
   - `TrackRow` (nomor/cover, judul, artis, durasi, menu aksi, hover state)
   - `AlbumCard` / `PlaylistCard` (cover, judul, subjudul, play button muncul saat hover)
   - `EmptyState`, `ErrorState` (dengan tombol retry)
5. Halaman `/design` (dev only) yang menampilkan semua komponen dengan berbagai state.

## Constraint

- Tanpa warna hardcode di komponen, hanya token. Jangan memakai hijau `#1DB954`.
- Semua komponen keyboard accessible dan punya focus ring.
- Animasi halus (150-200ms) dan hormati `prefers-reduced-motion`.

## Acceptance criteria

- Mengganti `--accent` di satu tempat mengubah seluruh aksen.
- Lighthouse a11y ≥ 95 untuk halaman `/design`.
