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
pnpm test:coverage
```

Struktur kode mengikuti feature-first architecture di `src/`, dengan route tipis di
`src/app/`.

## Environment

Required: `DATABASE_URL`, `AUTH_SECRET`, `JAMENDO_CLIENT_ID`, and
`NEXT_PUBLIC_APP_URL`. Set `MUSIC_PROVIDER=fixtures` for network-free local
development and tests. Google OAuth uses optional `GOOGLE_CLIENT_ID` and
`GOOGLE_CLIENT_SECRET`. Production rate limiting requires
`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`; local development uses
the bounded in-memory fallback when these values are absent.

## Docker development

```bash
docker compose up --build
```

The app runs as a non-root user and connects to the bundled PostgreSQL service.
Run `pnpm prisma migrate dev` (or your deployment migration job) before using
database-backed routes.
