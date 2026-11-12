---
agent: agent
description: "Onyxify 01: scaffold project, tooling, struktur folder"
---

# Task: Scaffold Onyxify

Buat fondasi project web **Onyxify** sesuai `.github/copilot-instructions.md`.

## Kerjakan

1. Inisialisasi Next.js (App Router, TypeScript strict, Tailwind, ESLint, `src/` dir, import alias `@/*`) dengan **pnpm**.
2. Install dan konfigurasi: shadcn/ui, `lucide-react`, `zustand`, `@tanstack/react-query`, `zod`, `prisma` + `@prisma/client`, `next-auth` (Auth.js), `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@playwright/test`, `msw`, `prettier` + plugin Tailwind, `husky` + `lint-staged`.
3. Buat struktur folder persis seperti di instructions (folder kosong diberi `.gitkeep`).
4. `src/lib/env.ts`: validasi env dengan Zod (`DATABASE_URL`, `AUTH_SECRET`, `JAMENDO_CLIENT_ID`, `NEXT_PUBLIC_APP_URL`), crash cepat bila salah. Buat `.env.example`.
5. Script `package.json`: `dev`, `build`, `lint`, `typecheck`, `test`, `test:e2e`, `format`.
6. `tsconfig`: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`.
7. CI sederhana `.github/workflows/ci.yml`: install → lint → typecheck → test → build.
8. `README.md` singkat: cara setup dan menjalankan.

## Constraint

- Jangan membuat fitur apa pun dulu. Hanya fondasi.
- Jangan menambah dependency di luar daftar tanpa alasan.

## Acceptance criteria

- `pnpm dev`, `pnpm lint`, `pnpm typecheck`, `pnpm test` semua sukses.
- Env yang hilang menghasilkan pesan error jelas saat startup.

## Output

Ringkas: file yang dibuat, keputusan penting, dan perintah verifikasi.
