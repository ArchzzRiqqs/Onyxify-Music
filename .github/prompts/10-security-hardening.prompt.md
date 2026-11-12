---
agent: agent
description: "Onyxify 10: security audit & hardening"
---

# Task: Security hardening

Audit seluruh codebase lalu perbaiki. Laporkan temuan dengan tingkat keparahan (High/Med/Low) sebelum mengubah kode.

## Checklist

1. **Headers** (`next.config` / middleware): CSP ketat (allow hanya origin audio/gambar Jamendo yang dipakai), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, `frame-ancestors 'none'`.
2. **Input**: pastikan setiap route handler memvalidasi Zod; batasi ukuran body; tolak field tak dikenal (`.strict()`).
3. **AuthZ**: telusuri tiap mutasi, pastikan ada pengecekan ownership (cari IDOR).
4. **Rate limiting**: search, login, mutasi playlist. Respons 429 dengan `Retry-After`.
5. **Secrets**: pastikan tidak ada secret di client bundle (`grep` `NEXT_PUBLIC_`, cek impor `server-only`).
6. **CSRF**: pastikan mutasi berbasis cookie dilindungi (cek `sameSite`, origin check untuk route handler non-GET).
7. **XSS**: tidak ada `dangerouslySetInnerHTML`; sanitasi lirik/deskripsi dari sumber eksternal.
8. **Dependency**: `pnpm audit`, hapus dependency tak terpakai, kunci versi.
9. **Logging**: tanpa PII/token di log. Error ke client tanpa stack trace.

## Output

Tabel temuan (lokasi, risiko, perbaikan), lalu terapkan perbaikan dalam diff kecil dan tambahkan test regresi untuk tiap perbaikan High/Med.
