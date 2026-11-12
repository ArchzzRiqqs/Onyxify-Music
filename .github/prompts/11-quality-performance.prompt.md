---
agent: agent
description: "Onyxify 11: testing, a11y, performance, siap produksi"
---

# Task: Production readiness

1. **Coverage**: jalankan test dan laporkan coverage. Tambahkan test untuk modul kritis dengan coverage rendah (player store, use-case library, mapper provider). Target ≥ 80% pada `features/*/server` dan `features/player`.
2. **e2e Playwright** (alur kritis): login → search → play → pindah halaman (audio lanjut) → tambah ke playlist → reorder → logout. Jalankan di CI dengan provider `fixtures`.
3. **A11y**: audit dengan `@axe-core/playwright` pada halaman utama, perbaiki pelanggaran serious/critical. Cek urutan fokus dan label tombol ikon.
4. **Performance**:
   - Ukur bundle (`@next/bundle-analyzer`), pecah komponen berat dengan `dynamic()` (full-screen player, lirik, dnd).
   - Cek re-render PlayerBar (React Profiler): seek bar tidak boleh me-render ulang seluruh bar.
   - Virtualisasi list panjang (`@tanstack/react-virtual`).
   - Target: LCP < 2.5s, CLS < 0.1, INP < 200ms.
5. **Observability**: logger terstruktur, `error.tsx` global, `/api/health`, integrasi Sentry (opsional, via env).
6. **Deploy**: `Dockerfile` multi-stage (non-root user), `docker-compose.yml` (app + postgres) untuk dev, dokumentasi env di README, strategi migrasi di CI/CD.

## Output

Laporan sebelum/sesudah (metrik), daftar perubahan, dan hal yang sengaja ditunda beserta alasannya.
