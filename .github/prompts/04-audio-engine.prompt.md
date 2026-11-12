---
agent: agent
description: "Onyxify 04: audio engine, player store, queue, Media Session"
---

# Task: Audio engine + player state

Terapkan aturan "Audio" di `.github/copilot-instructions.md`.

## Kerjakan di `src/features/player/`

1. `schemas.ts`: Zod `TrackSchema` (`id, title, artists[], album, coverUrl, audioUrl, durationSec, license`), `RepeatMode = 'off' | 'one' | 'all'`.
2. `audio-engine.ts`: singleton class membungkus satu `HTMLAudioElement`.
   - API: `load(track)`, `play()`, `pause()`, `seek(sec)`, `setVolume(0..1)`, `destroy()`.
   - Emit event typed: `timeupdate`, `ended`, `loadstart`, `canplay`, `waiting`, `error`.
   - Aman di SSR (tidak menyentuh `window` saat import).
3. `player.store.ts` (Zustand): `queue`, `originalQueue`, `currentIndex`, `isPlaying`, `status`, `position`, `duration`, `volume`, `muted`, `shuffle`, `repeat`.
   - Actions: `playTrack(track, queue?)`, `togglePlay`, `next`, `prev`, `seek`, `toggleShuffle`, `cycleRepeat`, `enqueue`, `playNext`, `removeFromQueue`, `reorderQueue`, `clear`.
   - Aturan: `prev` saat `position > 3s` mengulang track; shuffle memakai Fisher-Yates dan menjaga track aktif tetap pertama; `repeat: 'one'` mengulang, `'all'` loop queue, `'off'` berhenti di akhir.
4. `use-audio-bridge.ts`: hook yang dipasang **sekali** di root untuk menghubungkan engine ↔ store.
5. `media-session.ts`: set `navigator.mediaSession.metadata` (title, artist, album, artwork) dan action handlers (`play, pause, previoustrack, nexttrack, seekto`).
6. Hubungkan `PlayerBar`, `MiniPlayer`, `SeekBar`, `VolumeSlider` ke store dengan **selector sempit** (cegah re-render berlebih). Persist `volume`/`muted`/`repeat`/`shuffle` ke `localStorage` (bukan token, bukan data sensitif).
7. Keyboard shortcuts global (lihat frontend instructions).
8. Halaman dev `/dev/player` dengan 3 track demo (URL audio berlisensi bebas).

## Edge cases yang wajib ditangani

Queue kosong, track terakhir, URL audio gagal dimuat (skip otomatis + toast), seek di luar rentang, autoplay diblokir browser, ganti track saat loading.

## Tests (Vitest)

Unit test untuk store: next/prev, shuffle, repeat tiga mode, enqueue/reorder, serta engine dengan `HTMLAudioElement` yang di-mock.

## Acceptance criteria

- Audio terus berjalan saat pindah halaman.
- Lock screen / media keys berfungsi.
- Tidak ada memory leak (listener dibersihkan di `destroy`).
