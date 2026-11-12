---
agent: agent
description: "Onyxify 05: MusicProvider abstraction + Jamendo + API routes"
---

# Task: Sumber musik legal lewat `MusicProvider`

## Kerjakan di `src/features/catalog/server/`

1. `music-provider.ts`: interface
   ```ts
   interface MusicProvider {
     searchTracks(
       q: string,
       opts: { limit: number; cursor?: string },
     ): Promise<Page<Track>>;
     getTrack(id: string): Promise<Track | null>;
     getAlbum(id: string): Promise<AlbumWithTracks | null>;
     getArtist(id: string): Promise<ArtistWithTopTracks | null>;
     getFeatured(): Promise<{ title: string; items: (Album | Playlist)[] }[]>;
   }
   ```
2. `jamendo.provider.ts`: implementasi memakai Jamendo API v3.
   - Validasi **setiap** response dengan Zod, lalu mapping ke tipe domain (jangan bocorkan bentuk Jamendo keluar dari file ini).
   - Timeout 8 detik (`AbortController`), retry 1x dengan backoff untuk 5xx, error terklasifikasi (`ProviderError`).
   - Cache dengan revalidate (search 60s, detail 1 jam).
   - Simpan atribusi lisensi CC di field `license` dan tampilkan di UI track detail.
3. `local-fixtures.provider.ts`: provider palsu untuk dev/test tanpa jaringan.
4. `provider.factory.ts`: pilih provider dari env (`MUSIC_PROVIDER=jamendo|fixtures`).
5. Route handlers (tipis): `GET /api/search?q=&cursor=`, `/api/tracks/[id]`, `/api/albums/[id]`, `/api/artists/[id]`, `/api/featured`.
   - Zod untuk query params (`q` trim 1-100 char), rate limit, format response sesuai backend instructions.

## Konsumsi di UI

- Home: section "Featured" dari `/api/featured` (Server Component).
- Query client memakai TanStack Query dengan query key terstruktur (`['search', q]`).

## Tests

- Unit: mapper Jamendo (fixture JSON nyata yang disederhanakan), error handling (timeout, 500, JSON invalid).
- Route: validasi input buruk → 400, rate limit → 429.

## Acceptance criteria

- Mengganti provider hanya mengubah satu env var, tanpa perubahan UI.
- Response Jamendo yang berubah bentuk menghasilkan error terkontrol, bukan crash.
