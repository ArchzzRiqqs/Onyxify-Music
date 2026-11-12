---
agent: ask
description: "Onyxify 12: review kritis (pakai kapan saja pada file/diff terpilih)"
---

# Task: Senior code review

Review kode yang dipilih atau di-attach sebagai senior engineer yang kritis dan praktis. Acuan: `.github/copilot-instructions.md`.

## Periksa

- **Correctness**: bug, logic flaw, race condition, edge case.
- **Security**: validasi input, authz/IDOR, kebocoran secret, XSS/CSRF.
- **Arsitektur**: pelanggaran layering, coupling antar fitur, logika bisnis di route/komponen, abstraksi prematur atau duplikasi (DRY/KISS/SOLID).
- **Performance**: re-render berlebih, N+1, bundle, request waterfall.
- **A11y & UX**: keyboard, label, state loading/empty/error.
- **Testability**: seberapa mudah dites, test yang kurang.

## Format jawaban (Bahasa Indonesia)

1. **Ringkasan** (2-3 kalimat, siap merge atau tidak).
2. **Temuan**, diurutkan dari paling parah. Tiap temuan: `[High|Med|Low]` lokasi → masalah → _kenapa bermasalah_ → saran perbaikan (kode singkat).
3. **Hal yang sudah bagus** (singkat).
4. **Test yang perlu ditambah**.

Jangan mengubah kode. Hanya review. Jangan mengarang temuan, jika tidak yakin, tulis sebagai pertanyaan.
