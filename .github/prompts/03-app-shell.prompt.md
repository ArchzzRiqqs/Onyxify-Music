---
agent: agent
description: "Onyxify 03: layout utama (sidebar, topbar, player bar, mobile nav)"
---

# Task: App shell ala Spotify

## Layout

- **Desktop:** grid 3 area, yaitu sidebar kiri (lebar 280px, collapsible), konten tengah (scroll sendiri), player bar tetap di bawah (tinggi ~88px).
- **Mobile:** bottom navigation (Home, Search, Library) + mini player di atasnya. Tanpa sidebar.
- Layout ada di `app/(main)/layout.tsx`. Player bar berada di **root layout group** agar tidak ter-unmount saat navigasi.

## Kerjakan

1. `Sidebar`: logo **Onyxify**, nav (Home, Search, Library), daftar playlist (placeholder data), tombol "Buat playlist".
2. `Topbar`: tombol back/forward, search shortcut, menu user (placeholder).
3. `PlayerBar` (UI saja, belum terhubung audio): cover + judul + artis, kontrol (shuffle, prev, play/pause, next, repeat), seek bar, volume, tombol queue.
4. `MobileNav` + `MiniPlayer`.
5. Route placeholder: `/`, `/search`, `/library`, `/playlist/[id]`, `/album/[id]`, `/artist/[id]` dengan skeleton dan `loading.tsx` + `error.tsx`.
6. Semua string dari `lib/i18n/id.ts`.

## Constraint

- Sidebar dan topbar boleh Server Component. Hanya bagian interaktif yang `'use client'`.
- Tidak ada layout shift saat konten dimuat (skeleton dengan ukuran sama).

## Acceptance criteria

- Navigasi antar route tidak me-reset PlayerBar.
- Responsif di 360px, 768px, 1280px+.
- Seluruh navigasi bisa dioperasikan dengan keyboard.
