# Onyxify

Fondasi web app streaming musik Onyxify dengan Next.js App Router.

## Getting Started

Salin `.env.example` menjadi `.env.local`, isi nilainya, lalu jalankan:

```bash
pnpm install
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000).

Perintah verifikasi:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Struktur kode mengikuti feature-first architecture di `src/`, dengan route tipis di
`src/app/`.
