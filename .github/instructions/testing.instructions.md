---
applyTo: "**/*.test.ts,**/*.test.tsx,e2e/**/*.ts"
---

# Testing rules (Onyxify)

- Pola **Arrange-Act-Assert**, satu perilaku per test, nama test berupa kalimat (`it('skips to next track when queue has items')`).
- Unit test: use-case, store Zustand (reducer-style), util, mapper provider. Mock di boundary (`MusicProvider`, repository), bukan internal.
- Component test (RTL): query berdasarkan role/label, bukan class atau test-id kecuali terpaksa. Gunakan `userEvent`.
- Audio: mock `HTMLAudioElement` (`play`, `pause`, `currentTime`, event `ended`/`timeupdate`). Jangan memutar audio asli di test.
- Cover: happy path, empty, error, edge case (queue kosong, track terakhir + repeat off/one/all, shuffle tanpa mengulang track sama, seek di luar rentang).
- e2e (Playwright): alur kritis saja, yaitu login, search → play, tambah ke playlist, navigasi tanpa memutus audio.
- Test harus deterministik: tanpa `setTimeout` nyata, gunakan fake timers. Tanpa jaringan nyata (MSW untuk HTTP).
- Jangan menguji detail implementasi atau snapshot besar.
