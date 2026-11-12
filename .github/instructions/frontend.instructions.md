---
applyTo: "src/app/**/*.tsx,src/components/**/*.tsx,src/features/**/components/**/*.tsx"
---

# Frontend rules (Onyxify)

## Design tokens (Tailwind CSS variables, jangan hardcode warna)

- `--bg: #0A0A0B`, `--surface: #141416`, `--elevated: #1C1C1F`, `--border: #2A2A2E`
- `--text: #F4F4F5`, `--muted: #A1A1AA`
- `--accent: #22D3EE` (satu-satunya warna aksen, bisa diganti di satu tempat)
- Radius: kartu `12px`, tombol `9999px` untuk play, input `8px`.
- Font: satu family (Inter atau Plus Jakarta Sans via `next/font`), maksimal 3 ukuran heading.

## Komponen

- Gunakan shadcn/ui primitives, ekstensi lewat `cva` + `cn()`.
- Komponen reusable wajib: `TrackRow`, `AlbumCard`, `PlaylistCard`, `PlayButton`, `SeekBar`, `VolumeSlider`, `CoverImage`, `EmptyState`, `Skeleton*`.
- Props typed eksplisit. Tidak ada prop drilling > 2 level (pakai store/context).
- Setiap list/fetch punya 3 state: loading (skeleton), empty, error (dengan retry).

## Interaksi & a11y

- Semua kontrol bisa diakses keyboard. Shortcut global: `Space` play/pause, `←/→` seek 5s, `Shift+←/→` prev/next, `M` mute. Jangan aktif saat fokus di input.
- `aria-label` pada tombol ikon, `role="slider"` + `aria-valuenow` pada seek/volume.
- Hormati `prefers-reduced-motion`. Kontras teks minimal WCAG AA.
- Responsif: mobile (bottom nav + mini player), tablet, desktop (sidebar + player bar).

## Performa

- Client component sekecil mungkin. Jangan fetch di client jika bisa di server.
- `next/image` + `sizes`. Lazy-load gambar di bawah fold.
- Gunakan `React.memo` hanya jika terbukti perlu (ukur dulu).
