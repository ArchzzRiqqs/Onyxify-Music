---
agent: agent
description: "Onyxify 08: library, liked songs, playlist CRUD + reorder"
---

# Task: Library & Playlist

## Backend (`src/features/library/server/`)

Use-case + repository untuk: `createPlaylist`, `renamePlaylist`, `deletePlaylist`, `addTrackToPlaylist` (idempoten, tolak duplikat dengan 409), `removeTrack`, `reorderTracks` (transaksi, atomic), `toggleLike`, `listLiked`, `listRecentlyPlayed`, `recordPlay`.

- Semua mutasi memeriksa kepemilikan (`ownerId`). Resource milik orang lain → 404.
- Pagination cursor untuk list.
- Route handlers tipis + Zod.

## Frontend

1. **Library** (`/library`): tab Playlists | Albums | Artists | Liked, dengan filter dan sort (terbaru, alfabet).
2. **Playlist detail** (`/playlist/[id]`): header (cover collage 2x2, nama editable inline), daftar track, **drag & drop reorder** (`@dnd-kit`, aksesibel dengan keyboard), hapus track, hapus playlist (dialog konfirmasi).
3. Dialog "Tambah ke playlist" (dari menu `TrackRow`) dengan opsi "Playlist baru".
4. Tombol like (ikon hati) pada `PlayerBar` dan `TrackRow` dengan **optimistic update** + rollback saat gagal (TanStack Query `onMutate`/`onError`).
5. `recordPlay` dipanggil saat track diputar ≥ 30 detik (satu kali per play).

## Edge cases

Playlist kosong, nama kosong/terlalu panjang, reorder konkuren, hapus playlist yang sedang diputar (queue tetap jalan), double-click tombol like.

## Tests

- Unit use-case (otorisasi, duplikat, reorder).
- Component: optimistic like + rollback.
- e2e: buat playlist → tambah track → reorder → hapus.
